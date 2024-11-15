import asyncio
from datetime import datetime
from io import BytesIO
import json
from fastapi import HTTPException
import logging
from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import Dict, List, Optional
import openai
import boto3
import os
from dotenv import load_dotenv
from google.cloud import texttospeech, speech_v1
from tempfile import NamedTemporaryFile
import random
from ai.mock_interview.audio_analyze import AudioAnalyzer

# 모델
from models import Answer, Feedback, InterviewType, Member, Portfolio, QuestionTag, Repository, MemberJob, JobSubCategory, Question, Interview, Analyze
from ai.mock_interview.schemas import AnswerResponseDTO, MemberInfoDTO, MemberJobDTO, PortfolioDTO, QuestionDTO, RepositoryDTO

# 환경 변수 설정
load_dotenv()

# OpenAI 설정
openai.api_key = os.getenv("OPENAI_API_KEY")

# S3 설정
s3_client = boto3.client(
    "s3",
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    region_name=os.getenv("AWS_REGION")
)

# Google Cloud 설정
tts_client = texttospeech.TextToSpeechClient()
speech_client = speech_v1.SpeechClient()
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")

# 로거 설정
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

# 오디오 분석기 초기화
analyzer = AudioAnalyzer()

async def upload_to_s3(file_data: BytesIO, file_name: str) -> str:
    """S3에 파일을 업로드하고 URL을 반환합니다."""
    try:
        s3_bucket_name = os.getenv("S3_BUCKET_NAME")
        await asyncio.get_event_loop().run_in_executor(
            None,
            lambda: s3_client.upload_fileobj(file_data, s3_bucket_name, file_name)
        )
        return f"https://{s3_bucket_name}.s3.amazonaws.com/{file_name}"
    except Exception as e:
        logger.error(f"S3 upload failed: {str(e)}")
        raise HTTPException(status_code=500, detail="S3 업로드 실패")

async def generate_tts_audio(text: str) -> BytesIO:
    """텍스트를 음성으로 변환합니다."""
    try:
        input_text = texttospeech.SynthesisInput(text=text)
        gender_choice = random.choice([texttospeech.SsmlVoiceGender.MALE, texttospeech.SsmlVoiceGender.FEMALE])
        voice = texttospeech.VoiceSelectionParams(language_code="ko-KR", ssml_gender=gender_choice)
        audio_config = texttospeech.AudioConfig(audio_encoding=texttospeech.AudioEncoding.LINEAR16)
        
        response = await asyncio.get_event_loop().run_in_executor(
            None,
            lambda: tts_client.synthesize_speech(input=input_text, voice=voice, audio_config=audio_config)
        )
        
        audio_data = BytesIO(response.audio_content)
        audio_data.seek(0)
        return audio_data
    except Exception as e:
        logger.error(f"TTS generation failed: {str(e)}")
        raise HTTPException(status_code=500, detail="음성 생성 실패")

async def convert_audio_to_text(audio_content: bytes) -> str:
    """음성을 텍스트로 변환합니다."""
    try:
        audio = speech_v1.RecognitionAudio(content=audio_content)
        config = speech_v1.RecognitionConfig(
            encoding=speech_v1.RecognitionConfig.AudioEncoding.LINEAR16,
            sample_rate_hertz=16000,
            language_code="ko-KR"
        )
        
        response = await asyncio.get_event_loop().run_in_executor(
            None,
            lambda: speech_client.recognize(config=config, audio=audio)
        )
        
        transcript = " ".join([result.alternatives[0].transcript for result in response.results])
        return transcript
    except Exception as e:
        logger.error(f"STT conversion failed: {str(e)}")
        raise HTTPException(status_code=500, detail="음성 인식 실패")

async def get_member_records(db: Session, member_id: int) -> dict:
    """회원 정보를 조회합니다."""
    try:
        member = db.query(Member).filter(Member.member_id == member_id).first()
        if not member:
            raise HTTPException(status_code=404, detail="유저 정보 없음")

        portfolios = [PortfolioDTO(
            portfolio_id=portfolio.portfolio_id,
            portfolio_title=portfolio.portfolio_title,
        ) for portfolio in member.portfolios]

        repositories = [RepositoryDTO(
            repository_id=repo.repository_id,
            repository_title=repo.repository_title,
        ) for repo in member.repositories]

        hope_jobs = [MemberJobDTO(
            job_id=job.job_id,
            job_name=job.job.job_name
        ) for job in member.member_jobs]

        return {
            "member_id": member.member_id,
            "portfolios": portfolios,
            "repositories": repositories,
            "hope_jobs": hope_jobs
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get member records: {str(e)}")
        raise HTTPException(status_code=500, detail="회원 정보 조회 실패")

# 일반 create_interview 함수도 비동기로 수정
async def create_interview(member_id: int, db: AsyncSession) -> int:
    """새로운 인터뷰를 생성합니다."""
    try:
        new_interview = Interview(
            member_id=member_id,
            interview_type=InterviewType.undefined.value,
            created_at=datetime.utcnow()
        )
        db.add(new_interview)
        await db.flush()
        await db.refresh(new_interview)
        return new_interview.interview_id
    except Exception as e:
        await db.rollback()
        logger.error(f"Failed to create interview: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"인터뷰 생성 실패: {str(e)}"
        )
    
async def create_interview_set_defaults(member_id: int, db: AsyncSession) -> int:
    """기본값이 설정된 새로운 인터뷰를 생성합니다."""
    try:
        # 인터뷰 생성
        new_interview = Interview(
            member_id=member_id,
            interview_type=InterviewType.undefined.value,
            created_at=datetime.utcnow()
        )
        db.add(new_interview)
        await db.flush()
        await db.refresh(new_interview)

        # 기본 질문 생성
        default_questions = [Question(
            interview_id=new_interview.interview_id,
            question_tag=QuestionTag.ready,  # Enum 객체 자체를 사용
            question_intent="ready",
            content="ready",
            audio_s3_key="ready",
            created_at=datetime.utcnow()
        ) for _ in range(5)]

        db.add_all(default_questions)
        await db.flush()
        
        for question in default_questions:
            await db.refresh(question)
        
        default_answers = [Answer(
            question_id=question.question_id,
            member_id=member_id,
            content=None,
            interview_type=InterviewType.undefined,  # 여기도 Enum 객체 사용
            created_at=datetime.utcnow()
        ) for question in default_questions]

        db.add_all(default_answers)
        await db.commit()

        return new_interview.interview_id
        
    except Exception as e:
        await db.rollback()
        logger.error(f"Failed to create interview with defaults: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"인터뷰 초기화 실패: {str(e)}"
        )
    
async def create_question(prompt_text: str, question_tag: QuestionTag, file_prefix: str) -> dict:
    """질문과 음성을 생성합니다."""
    try:
        refined_prompt = f"""
            다음은 '{prompt_text}'를 기반으로 한 질문과 의도입니다. '의도: ... | 질문: ...' 형식으로 질문 하나와 해당 의도 하나만 제공합니다.
            
            예시:
            의도: 이 항목에 대한 이해를 요구하고 있습니다. | 질문: {prompt_text}에 대해 알고 싶은 이유가 무엇인가요?
        """

        response = await openai.ChatCompletion.acreate(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": refined_prompt}],
            max_tokens=150,
            temperature=0.6,
        )
        
        response_text = response.choices[0].message["content"].strip()
        intent, question_text = response_text.split("|", 1) if "|" in response_text else ("의도를 알 수 없음", response_text)

        audio_data = await generate_tts_audio(question_text.strip())
        file_name = f"tts_audio/{file_prefix}_{int(datetime.utcnow().timestamp())}.wav"
        audio_url = await upload_to_s3(audio_data, file_name)

        return {
            "question_tag": question_tag,  # Enum 객체 그대로 전달
            "question_intent": intent.strip(),
            "question_text": question_text.strip(),
            "audio_s3_url": audio_url
        }
    except Exception as e:
        logger.error(f"Question creation failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"질문 생성 실패: {str(e)}"
        )

async def generate_and_save_questions(
    db: AsyncSession,
    interview_id: int,
    portfolio_text: Optional[str],
    repository_text: Optional[str],
    job_roles: List[str]
) -> List[dict]:
    """질문을 생성하고 저장합니다."""
    questions_data = []
    
    try:
        base_text = portfolio_text if portfolio_text else repository_text
        if not base_text:
            raise ValueError("포트폴리오 또는 레포지토리 중 하나는 반드시 선택되어야 합니다.")

        # 직무 관련 질문
        for role in job_roles[:1]:  
            prompts = [
                (f"{role}와 관련된 용어를 기반으로...", QuestionTag.role),
                (f"{role} 직무 상황과 관련된...", QuestionTag.role)
            ]
            
            for prompt_text, tag in prompts:
                try:
                    question_data = await create_question(prompt_text, tag, f"role_tag")
                    if question_data is not None:
                        questions_data.append(question_data)
                except Exception as e:
                    logger.error(f"직무 질문 생성 실패: {str(e)}")
                    continue

        # 경험 관련 질문
        for i in range(2):
            try:
                question_data = await create_question(base_text, QuestionTag.exp, f"experience_{i}")
                if question_data is not None:
                    questions_data.append(question_data)
            except Exception as e:
                logger.error(f"경험 질문 생성 실패: {str(e)}")
                continue

        # 인성 관련 질문
        try:
            question_data = await create_question("인성 평가", QuestionTag.fit, "personality")
            if question_data is not None:
                questions_data.append(question_data)
        except Exception as e:
            logger.error(f"인성 질문 생성 실패: {str(e)}")

        if not questions_data:
            raise ValueError("질문을 생성할 수 없습니다.")

        # 질문 저장
        for q_data in questions_data:
            question = Question(
                interview_id=interview_id,
                question_tag=q_data["question_tag"],  # 이미 Enum 객체로 전달됨
                question_intent=q_data["question_intent"],
                content=q_data["question_text"],
                audio_s3_key=q_data["audio_s3_url"],
                created_at=datetime.utcnow()
            )
            db.add(question)

        await db.commit()
        return questions_data

    except Exception as e:
        await db.rollback()
        logger.error(f"Question generation failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"질문 생성 및 저장 실패: {str(e)}"
        )

async def generate_feedback(
    question: str,
    question_intent: str,
    context_text: str,
    answer_text: str
) -> Dict:
    """답변에 대한 피드백을 생성합니다."""
    try:
        prompt = f"""
        아래 면접 답변에 대해 정확한 JSON 형식으로만 응답해주세요.
        
        [답변 정보]
        질문: {question}
        질문 의도: {question_intent}
        컨텍스트: {context_text}
        답변: {answer_text}

        응답은 다음 JSON 형식을 정확히 따라야 합니다:
        {{
            "scores": {{
                "content_relevance": 85,
                "question_understanding": 80,
                "logic": 75,
                "delivery": 70
            }},
            "strengths": [
                {{
                    "category": "CONTENT",
                    "point": "핵심 내용 전달",
                    "details": "주요 개념을 명확하게 설명함"
                }}
            ],
            "improvements": [
                {{
                    "category": "CONTENT",
                    "point": "구체성 부족",
                    "priority": 1,
                    "suggestion": "실제 예시를 추가하면 좋음"
                }}
            ],
            "suggestions": [
                {{
                    "category": "CONTENT",
                    "text": "예시 추가",
                    "example": "구체적인 사례를 들어 설명"
                }}
            ],
            "overall_comment": "전반적인 피드백 내용"
        }}

        JSON 형식만 반환하고, 다른 텍스트는 포함하지 마세요.
        """
        
        response = await openai.ChatCompletion.acreate(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "당신은 JSON 형식으로만 응답하는 면접관입니다."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=800,
            temperature=0.3,  # 더 결정적인 응답을 위해 낮춤
            response_format={ "type": "json_object" }  # JSON 응답 강제
        )
        
        feedback_text = response.choices[0].message.content.strip()
        
        # 디버깅을 위한 로깅
        logger.info(f"Raw GPT Response: {feedback_text}")
        
        try:
            feedback_data = json.loads(feedback_text)
            logger.info(f"Parsed feedback data: {json.dumps(feedback_data, indent=2, ensure_ascii=False)}")
            return feedback_data
            
        except json.JSONDecodeError as e:
            logger.error(f"JSON Parse Error: {str(e)}")
            logger.error(f"Problematic text: {feedback_text}")
            raise HTTPException(
                status_code=500,
                detail=f"피드백 생성 실패: JSON 파싱 오류 - {str(e)}"
            )
            
    except Exception as e:
        logger.error(f"Feedback Generation Error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"피드백 생성 실패: {str(e)}"
        )

async def save_text_answer_and_feedback(
    db: AsyncSession,
    question_id: int,
    member_id: int,
    answer_text: str,
    question: str,
    question_intent: str,
    context_text: str
) -> AnswerResponseDTO:
    """텍스트 답변과 피드백을 저장합니다."""
    try:
        # 답변 저장
        answer = Answer(
            question_id=question_id,
            member_id=member_id,
            content=answer_text,
            interview_type=InterviewType.text.value,
            created_at=datetime.utcnow()
        )
        db.add(answer)
        await db.flush()
        await db.refresh(answer)

        # 피드백 생성 및 저장
        feedback_data = await generate_feedback(
            question=question,
            question_intent=question_intent,
            context_text=context_text,
            answer_text=answer_text
        )
        
        feedback = Feedback(
            answer_id=answer.answer_id,
            feedback_text=feedback_data.get("overall_comment", ""),
            feedback_data=feedback_data,
            created_at=datetime.utcnow()
        )
        db.add(feedback)
        await db.commit()

        return AnswerResponseDTO(
            answer_id=answer.answer_id,
            feedback=feedback.feedback_text,
            feedback_json=feedback.feedback_data
        )
    except Exception as e:
        await db.rollback()
        logger.error(f"Failed to save text answer and feedback: {str(e)}")
        raise HTTPException(status_code=500, detail="답변 및 피드백 저장 실패")



logger = logging.getLogger(__name__)
analyzer = AudioAnalyzer()

async def save_audio_answer_and_feedback(
    db: AsyncSession,
    question_id: int,
    member_id: int,
    audio_content: bytes,
    question: str,
    question_intent: str,
    context_text: str
) -> AnswerResponseDTO:
    """음성 답변과 피드백을 저장합니다."""
    try:
        # 음성 파일 업로드
        audio_url = await upload_to_s3(
            BytesIO(audio_content), 
            f"audio_responses/{question_id}_{int(datetime.utcnow().timestamp())}.wav"
        )
        
        # 음성을 텍스트로 변환 및 분석 작업을 병렬로 실행
        tasks = [
            convert_audio_to_text(audio_content),
            asyncio.get_event_loop().run_in_executor(
                None, lambda: analyzer.analyze_audio_file(audio_content)
            ),
            asyncio.get_event_loop().run_in_executor(
                None, lambda: analyzer.analyze_speech(audio_content)
            )
        ]
        
        answer_text, audio_analysis, speech_analysis = await asyncio.gather(*tasks)

        # 답변 저장
        answer = Answer(
            question_id=question_id,
            member_id=member_id,
            content=answer_text,
            audio_s3_key=audio_url,
            interview_type=InterviewType.audio.value,
            created_at=datetime.utcnow()
        )
        db.add(answer)
        await db.flush()
        await db.refresh(answer)

        # 피드백 생성 및 저장
        try:
            feedback_data = await generate_feedback(
                question=question,
                question_intent=question_intent,
                context_text=context_text,
                answer_text=answer_text
            )
        except Exception as e:
            logger.error(f"Failed to generate feedback: {str(e)}")
            feedback_data = {
                "overall_comment": "피드백 생성 중 오류가 발생했습니다.",
                "error": str(e)
            }

        feedback = Feedback(
            answer_id=answer.answer_id,
            feedback_text=feedback_data.get("overall_comment", ""),
            feedback_data=feedback_data,
            created_at=datetime.utcnow()
        )
        db.add(feedback)

        # 분석 결과 저장
        try:
            analyze_entry = Analyze(
                answer_id=answer.answer_id,
                transcript=speech_analysis["transcript"],
                speech_rate=float(audio_analysis["속도(BPM)"]),
                volume_variation=float(audio_analysis["볼륨 떨림 정도(RMS 표준편차)"]),
                silence_ratio=float(audio_analysis["무음 비율"]),
                fluency_score=float(audio_analysis["유창성 점수"]),
                pronunciation_issues=json.dumps(speech_analysis["pronunciation_issues"]),
                word_timestamps=json.dumps(speech_analysis["words"]),
                created_at=datetime.utcnow()
            )
            db.add(analyze_entry)
        except Exception as e:
            logger.error(f"Failed to save analysis results: {str(e)}")
            # 분석 실패시에도 답변과 피드백은 저장
            
        await db.commit()

        return AnswerResponseDTO(
            answer_id=answer.answer_id,
            feedback=feedback.feedback_text,
            feedback_json=feedback.feedback_data
        )

    except HTTPException as e:
        await db.rollback()
        raise e
    except Exception as e:
        await db.rollback()
        logger.error(f"Failed to save audio answer and feedback: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail={
                "message": "음성 답변 및 피드백 저장 실패",
                "error": str(e)
            }
        )