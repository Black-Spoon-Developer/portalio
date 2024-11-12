from datetime import datetime
from io import BytesIO
from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import Dict, List, Optional
import openai
import boto3
import os
from dotenv import load_dotenv
from google.cloud import texttospeech
from tempfile import NamedTemporaryFile
import random

# 모델
from models import Answer, Feedback, Member, Portfolio, Repository, MemberJob, JobSubCategory, Question, Interview
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

async def create_interview(member_id: int, db: AsyncSession) -> int:
    new_interview = Interview(member_id=member_id, interview_type="text", created_at=datetime.utcnow())
    db.add(new_interview)
    await db.flush()  # `interview_id`를 생성하여 flush
    return new_interview.interview_id

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

async def create_question(prompt_text: str, question_tag: str, file_prefix: str) -> dict:
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
    audio_url = upload_to_s3(audio_data, f"tts_audio/{file_prefix}_{int(datetime.utcnow().timestamp())}.wav")

    return {
        "question_tag": question_tag,
        "question_intent": intent.strip(),
        "question_text": question_text.strip(),
        "audio_s3_url": audio_url
    }

async def generate_and_save_questions(
    db: AsyncSession,
    interview_id: int,
    portfolio_text: Optional[str],
    repository_text: Optional[str],
    job_roles: List[str]
) -> List[dict]:
    questions_data = []

    # 포트폴리오와 리포지토리 중 하나라도 텍스트가 제공되었는지 확인
    base_text = portfolio_text if portfolio_text else repository_text
    if not base_text:
        raise ValueError("포트폴리오 또는 리포지토리 중 하나는 반드시 선택되어야 합니다.")

    # 직무별 질문 (용어 관련 1개, 상황 관련 1개)
    for role in job_roles[:1]:  # 직무 1개만 선택
        prompts = [
            (f"{role}와 관련된 용어를 기반으로 '의도: ... | 질문: ...' 형식으로 질문을 작성하세요. 텍스트는 다음과 같습니다: {base_text}", "직무"),
            (f"{role} 직무 상황과 관련된 '의도: ... | 질문: ...' 형식으로 질문을 작성하세요. 텍스트는 다음과 같습니다: {base_text}", "직무")
        ]
        
        for prompt_text, tag in prompts:
            question_data = await create_question(prompt_text, tag, f"{role}_{tag}")
            questions_data.append(question_data)

    # 경험 관련 질문 2개 생성
    experience_prompt = f"다음 텍스트를 기반으로 경험 관련 질문을 '의도: ... | 질문: ...' 형식으로 질문을 작성하세요: {base_text}"
    for i in range(2):
        question_data = await create_question(experience_prompt, "경험", f"experience_{i}")
        questions_data.append(question_data)

    # 인성 관련 질문 생성
    personality_prompt = "인성 평가를 위한 질문을 '의도: ... | 질문: ...' 형식으로 질문을 작성하세요."
    personality_question = await create_question(personality_prompt, "인성", "personality")
    questions_data.append(personality_question)

    # 질문 데이터를 DB에 저장
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
    
    # 모든 질문 추가 후 한 번의 flush 실행
    await db.flush()

    return questions_data

async def generate_feedback(
    question: str,
    question_intent: str,
    context_text: str,
    answer_text: str
) -> Dict:
    """면접 답변에 대한 종합 피드백 생성"""
    
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
            temperature=0.7
        )
        
        # OpenAI의 응답을 JSON으로 파싱
        feedback_data = response.choices[0].message.content
        return feedback_data
        
    except Exception as e:
        print(f"피드백 생성 중 오류 발생: {str(e)}")
        return None


async def save_text_answer_and_feedback(
    db: AsyncSession, 
    question_id: int, 
    member_id: int, 
    answer_text: str,
    question: str,
    question_intent: str,
    context_text: str
):
    
    # Answer 저장
    answer = Answer(
        question_id=question_id,
        member_id=member_id,
        content=answer_text,
        interview_type="text",
        created_at=datetime.utcnow()
    )
    db.add(answer)
    await db.flush()  # answer_id 생성

    # 피드백 생성
    feedback_data = await generate_feedback(
        question=question,
        question_intent=question_intent,
        context_text=context_text,
        answer_text=answer_text
    )
    
    # Feedback 저장
    feedback = Feedback(
        answer_id=answer.answer_id,
        feedback_text=feedback_data.get("overall_comment", ""),
        feedback_data=feedback_data  # JSON 형식으로 저장
    )
    db.add(feedback)
    await db.commit()

    return answer, feedback










