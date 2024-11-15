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

# openai 세팅
load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

# S3 세팅
s3_client = boto3.client(
    "s3",
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    region_name=os.getenv("AWS_REGION")
)

# TTS 세팅
tts_client = texttospeech.TextToSpeechClient()
speech_client = speech_v1.SpeechClient()
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")

# 오디오 분석 클래스
analyzer = AudioAnalyzer()

# S3 업로드 함수
async def upload_to_s3(file_data: BytesIO, file_name: str) -> str:
    s3_bucket_name = os.getenv("S3_BUCKET_NAME")
    s3_client.upload_fileobj(file_data, s3_bucket_name, file_name)
    return f"https://{s3_bucket_name}.s3.amazonaws.com/{file_name}"

# TTS 오디오 생성 함수
async def generate_tts_audio(text: str) -> BytesIO:
    input_text = texttospeech.SynthesisInput(text=text)
    gender_choice = random.choice([texttospeech.SsmlVoiceGender.MALE, texttospeech.SsmlVoiceGender.FEMALE])
    voice = texttospeech.VoiceSelectionParams(language_code="ko-KR", ssml_gender=gender_choice)
    audio_config = texttospeech.AudioConfig(audio_encoding=texttospeech.AudioEncoding.LINEAR16)
    response = tts_client.synthesize_speech(input=input_text, voice=voice, audio_config=audio_config)
    audio_data = BytesIO(response.audio_content)
    audio_data.seek(0)
    return audio_data

# STT 변환 함수
async def convert_audio_to_text(audio_content: bytes) -> str:
    audio = speech_v1.RecognitionAudio(content=audio_content)
    config = speech_v1.RecognitionConfig(
        encoding=speech_v1.RecognitionConfig.AudioEncoding.LINEAR16,
        sample_rate_hertz=16000,
        language_code="ko-KR"
    )
    response = speech_client.recognize(config=config, audio=audio)
    transcript = " ".join([result.alternatives[0].transcript for result in response.results])
    return transcript

async def get_member_records(db: Session, member_id: int) -> dict:
    member = db.query(Member).filter(Member.member_id == member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="유저 정보 없음")

    # PortfolioDTO와 RepositoryDTO 인스턴스 직접 생성
    portfolios = [PortfolioDTO(
        portfolio_id=portfolio.portfolio_id,
        portfolio_title=portfolio.portfolio_title,
    ) for portfolio in member.portfolios]  # .dict() 호출 제거

    repositories = [RepositoryDTO(
        repository_id=repo.repository_id,
        repository_title=repo.repository_title,
    ) for repo in member.repositories]  # .dict() 호출 제거

    hope_jobs = [MemberJobDTO(
        job_id=job.job_id,
        job_name=job.job.job_name
    ) for job in member.member_jobs]  # .dict() 호출 제거

    return {
        "member_id": member.member_id,
        "portfolios": portfolios,      # Pydantic 모델 인스턴스 사용
        "repositories": repositories,  # Pydantic 모델 인스턴스 사용
        "hope_jobs": hope_jobs         # Pydantic 모델 인스턴스 사용
    }

# 비동기 래퍼 함수 추가
async def async_generate_tts_audio(text: str) -> bytes:
    loop = asyncio.get_running_loop()
    try:
        audio_data = await loop.run_in_executor(None, generate_tts_audio, text)
        return audio_data
    except Exception as e:
        logging.error(f"TTS generation failed: {str(e)}")
        raise Exception(f"TTS generation failed: {str(e)}")

async def async_upload_to_s3(audio_data: bytes, file_name: str) -> str:
    loop = asyncio.get_running_loop()
    try:
        url = await loop.run_in_executor(
            None,
            upload_to_s3,
            audio_data,
            file_name
        )
        return url
    except Exception as e:
        logging.error(f"S3 upload failed: {str(e)}")
        raise Exception(f"S3 upload failed: {str(e)}")

logger = logging.getLogger(__name__)


def create_interview(member_id: int, db: Session) -> int:
    new_interview = Interview(
        member_id=member_id,
        interview_type=InterviewType.undefined.value,
        created_at=datetime.utcnow()
    )
    db.add(new_interview)
    db.flush()
    return new_interview.interview_id

def create_interview_set_defaults(member_id: int, db: Session) -> int:
    new_interview = Interview(
        member_id=member_id,
        interview_type=InterviewType.undefined.value,
        created_at=datetime.utcnow()
    )
    db.add(new_interview)
    db.flush()

    default_questions = [Question(
        interview_id=new_interview.interview_id,
        question_tag=QuestionTag.ready.value,
        question_intent="ready",
        content="ready",
        created_at=datetime.utcnow()
    ) for _ in range(5)]

    db.add_all(default_questions)
    db.flush()

    default_answers = [Answer(
        question_id=question.question_id,
        member_id=member_id,
        content=None,
        interview_type=InterviewType.undefined.value,
        created_at=datetime.utcnow()
    ) for question in default_questions]

    db.add_all(default_answers)
    db.commit()

    return new_interview.interview_id

# 질문 및 의도 생성 함수
# async def create_question(prompt_text: str, question_tag: str, file_prefix: str) -> dict:
#     refined_prompt = f"""
#         다음은 '{prompt_text}'를 기반으로 한 질문과 의도입니다. '의도: ... | 질문: ...' 형식으로 질문 하나와 해당 의도 하나만 제공합니다.
        
#         예시:
#         의도: 이 항목에 대한 이해를 요구하고 있습니다. | 질문: {prompt_text}에 대해 알고 싶은 이유가 무엇인가요?
#     """

#     response = await openai.ChatCompletion.acreate(
#         model="gpt-4o-mini",
#         messages=[{"role": "user", "content": refined_prompt}],
#         max_tokens=150,
#         temperature=0.6,
#     )
#     response_text = response.choices[0].message["content"].strip()

#     # 의도와 질문을 분리하여 처리
#     if "|" in response_text:
#         intent, question_text = response_text.split("|", 1)
#     else:
#         intent, question_text = "의도를 알 수 없음", response_text

#     # TTS 오디오 생성 및 S3 업로드
#     audio_data = await generate_tts_audio(question_text.strip())
#     audio_url = await upload_to_s3(audio_data, f"tts_audio/{file_prefix}_{int(datetime.utcnow().timestamp())}.wav")

#     return {
#         "question_tag": question_tag,
#         "question_intent": intent.strip(),
#         "question_text": question_text.strip(),
#         "audio_s3_url": audio_url
#     }
async def create_question(prompt_text: str, question_tag: str, file_prefix: str) -> dict:
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

        if "|" in response_text:
            intent, question_text = response_text.split("|", 1)
        else:
            intent, question_text = "의도를 알 수 없음", response_text

        # async_ 버전의 함수 사용
        audio_data = await async_generate_tts_audio(question_text.strip())
        file_name = f"tts_audio/{file_prefix}_{int(datetime.utcnow().timestamp())}.wav"
        audio_url = await async_upload_to_s3(audio_data, file_name)

        return {
            "question_tag": question_tag,
            "question_intent": intent.strip(),
            "question_text": question_text.strip(),
            "audio_s3_url": audio_url
        }

    except Exception as e:
        logging.error(f"Question creation failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"질문 생성 중 오류 발생: {str(e)}")

# 질문 및 의도 생성과 저장을 관리하는 함수
async def generate_and_save_questions(
    db: AsyncSession,
    interview_id: int,
    portfolio_text: Optional[str],
    repository_text: Optional[str],
    job_roles: List[str]
) -> List[dict]:
    questions_data = []
    
    try:
        base_text = portfolio_text if portfolio_text else repository_text
        
        if not base_text:
            raise ValueError("포트폴리오 또는 레포지토리 중 하나는 반드시 선택되어야 합니다.")

        # 직무 관련 질문
        for role in job_roles[:1]:  
            prompts = [
                (f"{role}와 관련된 용어를 기반으로...", "직무"),
                (f"{role} 직무 상황과 관련된...", "직무")
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
                question_data = await create_question(base_text, "경험", f"experience_{i}")
                if question_data is not None:
                    questions_data.append(question_data)
            except Exception as e:
                logger.error(f"경험 질문 생성 실패: {str(e)}")
                continue

        # 인성 관련 질문
        try:
            question_data = await create_question("인성 평가", "인성", "personality")
            if question_data is not None:
                questions_data.append(question_data)
        except Exception as e:
            logger.error(f"인성 질문 생성 실패: {str(e)}")

        if not questions_data:
            raise ValueError("질문을 생성할 수 없습니다.")

        # DB에 질문 데이터 저장
        statements = []
        for q_data in questions_data:
            question = Question(
                interview_id=interview_id,
                question_tag=q_data["question_tag"],
                question_intent=q_data["question_intent"],
                content=q_data["question_text"],
                audio_s3_key=q_data["audio_s3_url"],
                created_at=datetime.utcnow()
            )
            statements.append(question)

        db.add_all(statements)
        
        try:
            await db.flush()
            await db.commit()
        except Exception as db_error:
            await db.rollback()
            raise Exception(f"데이터베이스 저장 중 오류 발생: {str(db_error)}")

        return questions_data

    except Exception as e:
        logger.error(f"Question generation failed: {str(e)}")
        try:
            await db.rollback()
        except Exception:
            pass
        raise HTTPException(status_code=500, detail=f"질문 생성 중 오류 발생: {str(e)}")

async def generate_feedback(
    question: str,
    question_intent: str,
    context_text: str,
    answer_text: str
) -> Dict:
    prompt = f"""
    다음 면접 답변에 대한 종합적인 평가와 피드백을 JSON 형식으로 제공해주세요.
    
    [입력 정보]
    질문: {question}
    질문 의도: {question_intent}
    참고 컨텍스트: {context_text}
    답변: {answer_text}
    
    다음 형식으로 JSON을 생성해주세요:
    {{
        "scores": {{
            "content_relevance": <1-100>,
            "question_understanding": <1-100>,
            "logic": <1-100>,
            "delivery": <1-100>
        }},
        "strengths": [
            {{
                "category": <"CONTENT"|"STRUCTURE"|"DELIVERY">,
                "point": <string>,
                "details": <string>
            }}
        ],
        "improvements": [
            {{
                "category": <"CONTENT"|"STRUCTURE"|"DELIVERY">,
                "point": <string>,
                "priority": <1-3>,
                "suggestion": <string>
            }}
        ],
        "suggestions": [
            {{
                "category": <"CONTENT"|"STRUCTURE"|"DELIVERY">,
                "text": <string>,
                "example": <string>
            }}
        ],
        "overall_comment": <string>
    }}
    """
    
    try:
        response = await openai.ChatCompletion.acreate(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=400,
            temperature=0.7
        )
        
        feedback_data = response.choices[0].message.content
        feedback_json = json.loads(feedback_data)

        return feedback_data
        
    except Exception as e:
        print(f"피드백 생성 중 오류 발생: {str(e)}")
        return None

async def save_text_answer_and_feedback(
    db: Session, 
    question_id: int, 
    member_id: int, 
    answer_text: str,
    question: str,
    question_intent: str,
    context_text: str
) -> AnswerResponseDTO:
    
    # 저장 로직
    answer = Answer(
        question_id=question_id,
        member_id=member_id,
        content=answer_text,
        interview_type="text",
        created_at=datetime.utcnow()
    )
    db.add(answer)
    db.flush()

    feedback_data = await generate_feedback(
        question=question,
        question_intent=question_intent,
        context_text=context_text,
        answer_text=answer_text
    )
    
    # 피드백 저장 로직
    feedback = Feedback(
        answer_id=answer.answer_id,
        feedback_text=feedback_data.get("overall_comment", ""),
        feedback_data=feedback_data
    )
    db.add(feedback)
    db.commit()

    response = AnswerResponseDTO(
        answer_id=answer.answer_id,
        feedback=feedback.feedback_text,
        feedback_json=feedback.feedback_data
    )
    return response

def save_audio_answer_and_feedback(
    db: Session,
    question_id: int,
    member_id: int,
    audio_content: bytes,
    question: str,
    question_intent: str,
    context_text: str
) -> dict:
    audio_url = upload_to_s3(BytesIO(audio_content), f"audio_responses/{question_id}_{int(datetime.utcnow().timestamp())}.wav")
    answer_text = convert_audio_to_text(audio_content)

    answer = Answer(
        question_id=question_id,
        member_id=member_id,
        content=answer_text,
        audio_s3_key=audio_url,
        interview_type="audio",
        created_at=datetime.utcnow()
    )
    db.add(answer)
    db.flush()

    feedback_data = generate_feedback(
        question=question,
        question_intent=question_intent,
        context_text=context_text,
        answer_text=answer_text
    )

    feedback = Feedback(
        answer_id=answer.answer_id,
        feedback_text=feedback_data.get("overall_comment", ""),
        feedback_data=feedback_data
    )
    db.add(feedback)

    audio_analysis = analyzer.analyze_audio_file(audio_content)
    speech_analysis = analyzer.analyze_speech(audio_content)

    analyze_entry = Analyze(
        answer_id=answer.answer_id,
        transcript=speech_analysis["transcript"],
        speech_rate=audio_analysis["속도(BPM)"],
        volume_variation=audio_analysis["볼륨 떨림 정도(RMS 표준편차)"],
        silence_ratio=audio_analysis["무음 비율"],
        fluency_score=audio_analysis["유창성 점수"],
        pronunciation_issues=speech_analysis["pronunciation_issues"],
        word_timestamps=speech_analysis["words"],
        created_at=datetime.utcnow()
    )
    db.add(analyze_entry)

    db.commit()

    response = AnswerResponseDTO(
        answer_id=answer.answer_id,
        feedback=feedback.feedback_text,
        feedback_json=feedback.feedback_data
    )
    return response.dict()




