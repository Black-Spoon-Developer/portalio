import asyncio
from datetime import datetime
from io import BytesIO
import json
from pathlib import Path
import subprocess
import tempfile
from ai.mock_interview.async_audio_analyzer import AsyncAudioAnalyzer
from fastapi import File, HTTPException, UploadFile
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
from ai.mock_interview.video_analyze import VideoAnalyzer
from moviepy.editor import VideoFileClip

# 모델
from models import Answer, Feedback, InterviewType, Member, Portfolio, QuestionTag, Repository, MemberJob, JobSubCategory, Question, Interview, Analyze, VideoAnalyze
from ai.mock_interview.schemas import AnswerResponseDTO, AudioAnalysisResult, MemberInfoDTO, MemberJobDTO, PortfolioDTO, QuestionDTO, RepositoryDTO, AudioMetrics, SpeechAnalysis, TimeSeriesData, VideoAnalysisResult, VideoAnswerResponse

# 환경 변수 설정
load_dotenv()

# OpenAI 설정
openai.api_key = os.getenv("OPENAI_API_KEY")

logger = logging.getLogger(__name__)

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
video_analyzer = VideoAnalyzer()

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

from sqlalchemy import select

# mp4/mp3 투트랙으로 가면서 안 쓸 예정
# async def extract_audio_from_video(video_content: bytes) -> bytes:
#     """비디오에서 음성을 추출합니다."""
#     temp_video = None
#     temp_audio = None
#     video_clip = None
#     audio = None
    
#     try:
#         # 임시 비디오 파일 생성
#         temp_video = tempfile.NamedTemporaryFile(suffix='.mp4', delete=False)
#         temp_video.write(video_content)
#         temp_video.close()  # 명시적으로 파일 닫기
        
#         # 비디오에서 오디오 추출
#         video_clip = VideoFileClip(temp_video.name)
#         audio = video_clip.audio
        
#         # 임시 오디오 파일 생성
#         temp_audio = tempfile.NamedTemporaryFile(suffix='.wav', delete=False)
#         audio.write_audiofile(temp_audio.name, fps=16000)
        
#         # 오디오 데이터 읽기
#         with open(temp_audio.name, 'rb') as f:
#             audio_data = f.read()
            
#         return audio_data

#     finally:
#         # 리소스 정리
#         if audio:
#             audio.close()
#         if video_clip:
#             video_clip.close()
        
#         for temp_file in [temp_video, temp_audio]:
#             if temp_file:
#                 try:
#                     if os.path.exists(temp_file.name):
#                         os.unlink(temp_file.name)
#                 except Exception as e:
#                     logger.error(f"Failed to delete temp file: {e}")

async def get_member_records(db: AsyncSession, member_id: int) -> dict:
    try:
        # Member 조회
        member_result = await db.execute(
            select(Member).filter(Member.member_id == member_id)
        )
        member = member_result.scalar_one_or_none()
        
        if not member:
            raise HTTPException(status_code=404, detail="유저 정보 없음")
            
        # Portfolios 조회
        portfolio_result = await db.execute(
            select(Portfolio).filter(Portfolio.member_id == member_id)
        )
        portfolios = portfolio_result.scalars().all()
        
        # Repositories 조회
        repo_result = await db.execute(
            select(Repository).filter(Repository.member_id == member_id)
        )
        repositories = repo_result.scalars().all()
        
        # MemberJobs 조회
        jobs_result = await db.execute(
            select(MemberJob, JobSubCategory)
            .join(JobSubCategory)
            .filter(MemberJob.member_id == member_id)
        )
        member_jobs = jobs_result.all()

        return {
            "member_id": member.member_id,
            "portfolios": [
                PortfolioDTO(
                    portfolio_id=p.portfolio_id,
                    portfolio_title=p.portfolio_title,
                    portfolio_description=p.portfolio_description,
                    portfolio_is_primary=p.portfolio_is_primary,
                ) for p in portfolios
            ],
            "repositories": [
                RepositoryDTO(
                    repository_id=r.repository_id,
                    repository_title=r.repository_title,
                    repository_description=r.repository_description,
                    repository_is_primary=r.repository_is_primary,
                ) for r in repositories
            ],
            "hope_jobs": [
                MemberJobDTO(
                    job_id=job.job_id,
                    job_name=job.job_name
                ) for _, job in member_jobs
            ]
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
    portfolio_id: Optional[int],
    repository_id: Optional[int],
    job_roles: List[str]
) -> Dict:
    """질문을 생성하고 저장합니다."""
    questions_data = []
    
    try:
        base_text = portfolio_text if portfolio_text else repository_text
        if not base_text:
            raise ValueError("포트폴리오 또는 레포지토리 중 하나는 반드시 선택되어야 합니다.")

        logger.info(f"Generating questions for interview_id: {interview_id}")
        logger.info(f"Job roles: {job_roles}")

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

        # 질문 저장 및 ID 포함하여 응답 데이터 생성
        saved_questions = []
        for q_data in questions_data:
            question = Question(
                interview_id=interview_id,
                question_tag=q_data["question_tag"],
                question_intent=q_data["question_intent"],
                content=q_data["question_text"],
                audio_s3_key=q_data["audio_s3_url"],
                created_at=datetime.utcnow()
            )
            db.add(question)
            await db.flush()  # 개별 flush로 ID 생성
            await db.refresh(question)  # ID 새로고침

            # question_id를 포함하여 저장
            saved_questions.append({
                "question_id": question.question_id,  # ID 추가
                "question_tag": q_data["question_tag"].value,
                "question_intent": q_data["question_intent"],
                "question_text": q_data["question_text"],
                "audio_s3_url": q_data["audio_s3_url"]
            })

        await db.commit()

        response_data = {
            "interview_id": interview_id,
            "portfolio_id": portfolio_id,
            "repository_id": repository_id,
            "questions": saved_questions  # question_id가 포함된 질문 목록
        }

        return response_data

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
    answer_text: str,
    question_tag: QuestionTag
) -> Dict:
    """답변에 대한 피드백을 생성합니다."""
    try:
        answer_length = len(answer_text.split())
        is_short_answer = answer_length < 100

        tag_guidelines = {
            QuestionTag.role: """
                직무 역량 평가 기준:
                1. 직무 이해도
                   - 해당 직무의 핵심 업무 이해
                   - 필요 역량에 대한 이해
                   - 업계/도메인 지식
                
                2. 실무 역량
                   - 관련 경험의 구체성
                   - 문제 해결 능력
                   - 성과 중심 답변
                
                3. 발전 가능성
                   - 자기 개발 의지
                   - 열정과 동기
                   - 직무 관련 비전
            """,
            QuestionTag.exp: """
                경험 기반 역량 평가 기준:
                1. 상황 설명
                   - 배경과 맥락의 명확성
                   - 본인의 역할
                   - 과제/문제의 중요도
                
                2. 해결 과정
                   - 분석적 사고
                   - 실행력
                   - 혁신적 접근
                
                3. 결과와 학습
                   - 정량적/정성적 성과
                   - 피드백 반영
                   - 경험을 통한 성장
            """,
            QuestionTag.fit: """
                조직 적합성 평가 기준:
                1. 가치관
                   - 직업관/가치관
                   - 조직 문화 이해
                   - 윤리의식
                
                2. 대인 관계
                   - 의사소통 능력
                   - 팀워크
                   - 갈등 해결 능력
                
                3. 태도
                   - 적극성/주도성
                   - 책임감
                   - 학습 의지
            """
        }

        # 질문 유형별 주요 평가 항목
        tag_specific_scores = {
            QuestionTag.role: {
                "job_understanding": "직무 이해도",
                "practical_ability": "실무 역량",
                "growth_potential": "성장 가능성"
            },
            QuestionTag.exp: {
                "situation_analysis": "상황 분석력",
                "problem_solving": "문제 해결력",
                "result_achievement": "성과 달성도"
            },
            QuestionTag.fit: {
                "value_alignment": "가치관 부합도",
                "communication": "소통 능력",
                "attitude": "태도"
            }
        }

        evaluation_guideline = tag_guidelines.get(question_tag, "")
        score_items = tag_specific_scores.get(question_tag, {})

        prompt = f"""
        다음 면접 답변을 분석하여 구체적이고 건설적인 피드백을 제공해주세요.
        
        [답변 정보]
        질문: {question}
        질문 의도: {question_intent}
        질문 유형: {question_tag.value}
        답변 길이: {'짧은' if is_short_answer else '충분한'} 답변
        
        컨텍스트: {context_text}
        답변 내용: {answer_text}

        [평가 지침]
        {evaluation_guideline}

        다음 JSON 형식으로 응답해주세요:
        {{
            "scores": {{
                "overall": 85,  // 전반적인 평가 점수
                {', '.join(f'"{k}": 80  // {v}' for k, v in score_items.items())}
            }},
            "strengths": [
                {{
                    "point": "강점 제목",
                    "details": "구체적인 설명",
                    "example": "답변에서 발췌한 예시"
                }}
            ],
            "improvements": [
                {{
                    "point": "개선점 제목",
                    "priority": 1,  // 우선순위 (1-3)
                    "suggestion": "구체적인 개선 제안",
                    "example": "모범 답변 예시"
                }}
            ],
            "overall_feedback": {{
                "summary": "전반적인 평가 요약",
                "key_improvement": "가장 중요한 개선점",
                "next_steps": ["구체적인 실천 방안"]
            }}
        }}

        * 점수는 0-100 범위에서 평가해주세요.
        * 구체적인 예시와 실천 가능한 제안을 포함해주세요.
        * 답변의 길이가 짧더라도 건설적인 피드백을 제공해주세요.
        """

        response = await openai.ChatCompletion.acreate(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": f"{question_tag.value} 질문에 대한 전문적인 피드백을 제공하는 면접관입니다."
                },
                {"role": "user", "content": prompt}
            ],
            max_tokens=1200 if not is_short_answer else 800,
            temperature=0.4,
            response_format={ "type": "json_object" }
        )

        feedback_text = response.choices[0].message.content.strip()
        return json.loads(feedback_text)

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
    question_tag: QuestionTag,
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
            answer_text=answer_text,
            question_tag=question_tag
        )

        overall_feedback = feedback_data.get("overall_feedback", {})
        feedback_text = overall_feedback.get("key_improvement", "")

        feedback = Feedback(
            answer_id=answer.answer_id,
            feedback_text=feedback_text,
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

audio_analyzer = AsyncAudioAnalyzer()

async def save_audio_answer_and_feedback(
    db: AsyncSession,
    question_id: int,
    member_id: int,
    audio_content: bytes,
    question: str,
    question_intent: str,
    question_tag: QuestionTag,
    context_text: str
) -> AnswerResponseDTO:
    """음성 답변과 피드백을 저장합니다."""
    try:
        # S3 업로드와 음성 분석을 병렬로 실행
        upload_task = upload_to_s3(
            BytesIO(audio_content), 
            f"audio_responses/{question_id}_{int(datetime.utcnow().timestamp())}.wav"
        )
        
        # 전역 audio_analyzer 사용
        audio_tasks = await asyncio.gather(
            upload_task,
            asyncio.get_event_loop().run_in_executor(None, audio_analyzer.stt_transcribe, audio_content),
            asyncio.get_event_loop().run_in_executor(None, audio_analyzer.analyze_audio_file, audio_content),
            asyncio.get_event_loop().run_in_executor(None, audio_analyzer.analyze_speech, audio_content)
        )

        audio_url = audio_tasks[0]
        answer_text = audio_tasks[1]
        audio_analysis = audio_tasks[2]
        speech_analysis = audio_tasks[3]

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
                answer_text=answer_text,
                question_tag=question_tag
            )
        except Exception as e:
            logger.error(f"Failed to generate feedback: {str(e)}")
            feedback_data = {
                "overall_feedback": {
                    "summary": "피드백 생성 중 오류가 발생했습니다.",
                    "key_improvement": str(e)
                }
            }

        overall_feedback = feedback_data.get("overall_feedback", {})
        feedback_text = overall_feedback.get("key_improvement", "")

        feedback = Feedback(
            answer_id=answer.answer_id,
            feedback_text=feedback_text,
            feedback_data=feedback_data,
            created_at=datetime.utcnow()
        )
        db.add(feedback)

        # 분석 결과 저장
        try:
            analyze_entry = Analyze(
                answer_id=answer.answer_id,
                transcript=speech_analysis.get("transcript", ""),
                speech_rate=float(audio_analysis["속도(BPM)"]),
                volume_variation=float(audio_analysis["볼륨 떨림 정도(RMS 표준편차)"]),
                silence_ratio=float(audio_analysis["무음 비율"]),
                fluency_score=float(audio_analysis["유창성 점수"]),
                pronunciation_issues=json.dumps(speech_analysis.get("pronunciation_issues", [])),
                word_timestamps=json.dumps(speech_analysis.get("words", [])),
                created_at=datetime.utcnow()
            )
            db.add(analyze_entry)
        except Exception as e:
            logger.error(f"Failed to save analysis results: {str(e)}")
            
        await db.commit()

        return AnswerResponseDTO(
            answer_id=answer.answer_id,
            feedback=feedback.feedback_text,
            feedback_json=feedback.feedback_data
        )

    except HTTPException:
        await db.rollback()
        raise
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=500,
            detail={
                "message": "음성 답변 및 피드백 저장 실패",
                "error": str(e)
            }
        )

async def save_video_answer_and_feedback(
    db: AsyncSession,
    question_id: int,
    member_id: int,
    video_content: bytes,
    audio_content: bytes,
    question: str,
    question_intent: str,
    question_tag: str,
    context_text: str
) -> AnswerResponseDTO:
    """화상/음성 답변과 피드백을 저장합니다."""
    try:
        loop = asyncio.get_running_loop()
        video_analyzer = VideoAnalyzer()

        # 병렬 처리할 작업들
        upload_tasks = [
            upload_to_s3(
                BytesIO(video_content), 
                f"video_responses/{question_id}_{int(datetime.utcnow().timestamp())}.mp4"
            ),
            upload_to_s3(
                BytesIO(audio_content), 
                f"audio_responses/{question_id}_{int(datetime.utcnow().timestamp())}.wav"
            )
        ]
        
        analysis_tasks = [
            video_analyzer.analyze_video(video_content),  # 직접 호출
            loop.run_in_executor(None, audio_analyzer.stt_transcribe, audio_content),
            loop.run_in_executor(None, audio_analyzer.analyze_audio_file, audio_content),
            loop.run_in_executor(None, audio_analyzer.analyze_speech, audio_content)
        ]

        # 모든 작업 동시 실행
        logger.info("Executing analysis tasks")
        all_results = await asyncio.gather(
            *upload_tasks,
            *analysis_tasks
        )
        
        # 결과 할당
        logger.info(f"Analysis tasks completed. Results: {all_results}")
        video_url, audio_url = all_results[:2]
        video_analysis, transcript, audio_analysis, speech_analysis = all_results[2:]

        # 안전한 데이터 추출
        # last_frame = video_analysis.get("time_series_data", [{}])[-1]
        logger.info(f"Video analysis result: {video_analysis}")


        # DB 엔티티 생성
        answer = Answer(
            question_id=question_id,
            member_id=member_id,
            content=transcript or "",
            video_s3_key=video_url,
            audio_s3_key=audio_url,
            interview_type=InterviewType.video.value,
            created_at=datetime.utcnow()
        )
        db.add(answer)
        await db.flush()
        await db.refresh(answer)

        # 피드백 생성
        try:
            feedback_data = await generate_feedback(
                question=question,
                question_intent=question_intent,
                context_text=context_text,
                answer_text=transcript,
                question_tag=question_tag
            )
        except Exception as e:
            logger.error(f"Failed to generate feedback: {str(e)}")
            feedback_data = {
                "overall_feedback": {
                    "summary": "피드백 생성 중 오류가 발생했습니다.",
                    "key_improvement": str(e)
                }
            }

        # 피드백 저장
        feedback = Feedback(
            answer_id=answer.answer_id,
            feedback_text=feedback_data.get("overall_feedback", {}).get("key_improvement", ""),
            feedback_data=feedback_data,
            created_at=datetime.utcnow()
        )
        db.add(feedback)

        # 분석 결과 저장
        analyze_entry = VideoAnalyze(
            answer_id=answer.answer_id,
            transcript=transcript or "",
            speech_rate=float(audio_analysis.get("속도(BPM)", 0)),
            volume_variation=float(audio_analysis.get("볼륨 떨림 정도(RMS 표준편차)", 0)),
            silence_ratio=float(audio_analysis.get("무음 비율", 0)),
            fluency_score=float(audio_analysis.get("유창성 점수", 0)),
            pronunciation_issues=json.dumps(speech_analysis.get("pronunciation_issues", [])),
            word_timestamps=json.dumps(speech_analysis.get("words", [])),
            emotion=video_analysis.get("emotion", "중립"),
            movement_focus=video_analysis.get("movement_focus", 50),
            gaze_focus=video_analysis.get("gaze_focus", 50),
            time_series_data=json.dumps(video_analysis.get("time_series_data", [])),
            created_at=datetime.utcnow()
        )
        db.add(analyze_entry)

        await db.commit()
        
        audio_metrics_dict = {
            "speech_rate": float(audio_analysis.get("속도(BPM)", 0)),
            "volume_variation": float(audio_analysis.get("볼륨 떨림 정도(RMS 표준편차)", 0)),
            "silence_ratio": float(audio_analysis.get("무음 비율", 0)),
            "fluency_score": float(audio_analysis.get("유창성 점수", 0))
        }

        speech_analysis_dict = {
            "transcript": transcript or "",
            "pronunciation_issues": speech_analysis.get("pronunciation_issues", []),
            "word_timestamps": speech_analysis.get("words", [])
        }


        audio_analysis_result = AudioAnalysisResult(
            speech_analysis=speech_analysis_dict,
            audio_metrics=audio_metrics_dict
        )

        # 시계열 데이터를 TimeSeriesData 객체로 변환
        time_series_data = [
            TimeSeriesData(
                time=data.get("time", 0),
                emotion=data.get("emotion", "중립"),
                movement_focus=data.get("movement_focus", 50),
                gaze_focus=data.get("gaze_focus", 50)
            )
            for data in video_analysis.get("time_series_data", [])
            # for data in video_analysis
        ]

        video_analysis_result = VideoAnalysisResult(
            current_emotion=video_analysis.get("emotion", "중립"),
            movement_focus=video_analysis.get("movement_focus", 50),
            gaze_focus=video_analysis.get("gaze_focus", 50),
            time_series_data=time_series_data
        )
        return VideoAnswerResponse(
            answer_id=answer.answer_id,
            feedback=feedback.feedback_text or "",
            feedback_json=feedback_data,
            video_analysis=video_analysis_result,
            audio_analysis=audio_analysis_result
        )

    except Exception as e:
        await db.rollback()
        logger.error(f"Error in save_video_answer_and_feedback: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail={
                "message": "화상/음성 답변 및 피드백 저장 실패",
                "error": str(e)
            }
        )










