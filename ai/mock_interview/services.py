from datetime import datetime
from io import BytesIO
from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional
import openai
import boto3
import os
from dotenv import load_dotenv
from google.cloud import texttospeech
from tempfile import NamedTemporaryFile
import random

# 모델
from models import Member, Portfolio, Repository, MemberJob, JobSubCategory, Question
from schemas import MemberInfoDTO

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
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")

# S3 업로드 함수
def upload_to_s3(file_data: BytesIO, file_name: str) -> str:
    s3_bucket_name = os.getenv("S3_BUCKET_NAME")
    s3_client.upload_fileobj(file_data, s3_bucket_name, file_name)
    return f"https://{s3_bucket_name}.s3.amazonaws.com/{file_name}"

# TTS 오디오 생성 함수
def generate_tts_audio(text: str) -> BytesIO:
    input_text = texttospeech.SynthesisInput(text=text)
    gender_choice = random.choice([texttospeech.SsmlVoiceGender.MALE, texttospeech.SsmlVoiceGender.FEMALE])
    voice = texttospeech.VoiceSelectionParams(language_code="ko-KR", ssml_gender=gender_choice)
    audio_config = texttospeech.AudioConfig(audio_encoding=texttospeech.AudioEncoding.LINEAR16)
    response = tts_client.synthesize_speech(input=input_text, voice=voice, audio_config=audio_config)
    audio_data = BytesIO(response.audio_content)
    audio_data.seek(0)
    return audio_data

# 사용자 정보 조회
async def get_member_records(db: AsyncSession, member_id: int) -> MemberInfoDTO:
    result = await db.execute(select(Member).filter(Member.member_id == member_id))
    member = result.scalars().first()
    if not member:
        raise HTTPException(status_code=404, detail="유저 정보 없음")
    
    # 포트폴리오와 요약 정보 매핑
    portfolios = [
        {
            "portfolio_id": portfolio.portfolio_id,
            "portfolio_title": portfolio.portfolio_title,
            "portfolio_content": portfolio.portfolio_content,
            "portfolio_summary": portfolio.summary.summary_text if portfolio.summary else None
        }
        for portfolio in member.portfolios
    ]

    # 리포지토리와 요약 정보 매핑
    repositories = [
        {
            "repository_id": repo.repository_id,
            "repository_title": repo.repository_title,
            "repository_content": repo.repository_content,
            "repository_summary": repo.summary.summary_text if repo.summary else None
        }
        for repo in member.repositories
    ]

    # 희망 직무 정보 조회 및 매핑
    hope_jobs = [
        {
            "job_id": job.job_id,
            "job_name": job.job.job_name
        }
        for job in member.member_jobs
    ]

    return MemberInfoDTO(
        member_id=member.member_id,
        portfolios=portfolios,
        repositories=repositories,
        hope_jobs=hope_jobs
    )

# 질문 생성
async def generate_questions(portfolio_text: Optional[str], repository_text: Optional[str], job_roles: List[str]) -> List[dict]:
    questions = []

    # 포트폴리오와 리포지토리 중 하나라도 텍스트가 제공되었는지 확인
    base_text = portfolio_text if portfolio_text else repository_text
    if not base_text:
        raise ValueError("포트폴리오 또는 레포지토리 중 하나는 반드시 선택되어야 합니다.")

    # 직무별 질문 (용어 관련 1개, 상황 관련 1개)
    for role in job_roles[:1]:  # 직무 1개만 선택
        prompts = [
            (f"{role}와 관련된 용어를 기반으로 '의도: ... | 질문: ...' 형식으로 질문을 작성하세요. 텍스트는 다음과 같습니다: {base_text}", "용어"),
            (f"{role} 직무 상황과 관련된 '의도: ... | 질문: ...' 형식으로 질문을 작성하세요. 텍스트는 다음과 같습니다: {base_text}", "상황")
        ]
        
        for prompt_text, tag in prompts:
            response = openai.Completion.create(
                model="gpt-4o-mini",
                prompt=prompt_text,
                max_tokens=150,
                temperature=0.7,
            )
            response_text = response.choices[0].text.strip()
            # 의도와 질문 분리
            if "|" in response_text:
                intent, question_text = response_text.split("|", 1)
            else:
                intent, question_text = "의도를 알 수 없음", response_text

            # TTS 오디오 생성 및 S3 업로드
            audio_data = generate_tts_audio(question_text.strip())
            audio_url = upload_to_s3(audio_data, f"tts_audio/{role}_{tag}_{int(datetime.utcnow().timestamp())}.wav")

            questions.append({
                "question_tag": tag,
                "question_intent": intent.strip(),  # GPT 응답에서 의도 추출
                "question_text": question_text.strip(),
                "audio_s3_url": audio_url
            })

    # 경험 관련 질문 2개
    experience_prompt = f"다음 텍스트를 기반으로 경험 관련 질문을 '의도: ... | 질문: ...' 형식으로 질문을 작성하세요: {base_text}"
    for i in range(2):
        response = openai.Completion.create(
            model="gpt-4o-mini",
            prompt=experience_prompt,
            max_tokens=150,
            temperature=0.7,
        )
        response_text = response.choices[0].text.strip()
        # 의도와 질문 분리
        if "|" in response_text:
            intent, question_text = response_text.split("|", 1)
        else:
            intent, question_text = "의도를 알 수 없음", response_text

        # TTS 오디오 생성 및 S3 업로드
        audio_data = generate_tts_audio(question_text.strip())
        audio_url = upload_to_s3(audio_data, f"tts_audio/experience_{i}_{int(datetime.utcnow().timestamp())}.wav")

        questions.append({
            "question_tag": "경험",
            "question_intent": intent.strip(),
            "question_text": question_text.strip(),
            "audio_s3_url": audio_url
        })

    # 인성 관련 질문 1개
    personality_prompt = "인성 평가를 위한 질문을 '의도: ... | 질문: ...' 형식으로 질문을 작성하세요."
    response = openai.Completion.create(
        model="gpt-4o-mini",
        prompt=personality_prompt,
        max_tokens=150,
        temperature=0.7,
    )
    response_text = response.choices[0].text.strip()
    # 의도와 질문 분리
    if "|" in response_text:
        intent, question_text = response_text.split("|", 1)
    else:
        intent, question_text = "의도를 알 수 없음", response_text

    # TTS 오디오 생성 및 S3 업로드
    audio_data = generate_tts_audio(question_text.strip())
    audio_url = upload_to_s3(audio_data, f"tts_audio/personality_{int(datetime.utcnow().timestamp())}.wav")

    questions.append({
        "question_tag": "인성",
        "question_intent": intent.strip(),
        "question_text": question_text.strip(),
        "audio_s3_url": audio_url
    })

    return questions