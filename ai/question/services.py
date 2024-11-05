from fastapi import APIRouter, File, UploadFile, Form
from fastapi.responses import JSONResponse
import openai
import markdown
from bs4 import BeautifulSoup
import os
from dotenv import load_dotenv
from google.cloud import texttospeech
import boto3
from io import BytesIO
import random

# 환경 변수 로드
load_dotenv()

# OpenAI API 키 설정
openai.api_key = os.getenv("OPENAI_API_KEY")

# AWS S3 클라이언트 설정
s3_client = boto3.client(
    "s3",
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    region_name=os.getenv("AWS_REGION")
)

# Google Text-to-Speech 클라이언트 설정
tts_client = texttospeech.TextToSpeechClient()

# GOOGLE_APPLICATION_CREDENTIALS
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")

# 라우터 설정
router = APIRouter()

# .md 파일에서 텍스트 추출 함수
def extract_text_from_md(file_content: str) -> str:
    html_content = markdown.markdown(file_content)
    soup = BeautifulSoup(html_content, 'html.parser')
    text = soup.get_text()
    return text

# GPT API를 사용하여 주제별 질문 생성 함수
def generate_topic_based_questions(md_content: str, category: str):
    # 각 주제별로 프롬프트 설정
    prompts = {
        "직무": f"Here is some content from a portfolio:\n\n{md_content}\n\nPlease create 2 insightful interview questions related to '{category}' job terms or situational aspects.",
        "경험": f"Here is some content from a portfolio:\n\n{md_content}\n\nPlease create 2 insightful interview questions based on the candidate's past experiences.",
        "인성": f"Here is some content from a portfolio:\n\n{md_content}\n\nPlease create 1 insightful interview question to assess the candidate's personality traits.",
    }
    
    questions = {}
    question_count = 1  # question 번호 초기화
    
    # 주제별 질문 생성
    for topic, prompt in prompts.items():
        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are an AI assistant that generates structured mock interview questions in Korean."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=300,
            temperature=0.7,
        )
        
        # 생성된 질문을 리스트로 저장
        question_text = response.choices[0].message['content'].strip().split("\n")
        for q in question_text:
            if q.strip():
                questions[f"question{question_count}"] = f"{topic}: {q.strip()}"
                question_count += 1
    
    return questions

# TTS
def generate_tts_audio(text: str) -> BytesIO:
    input_text = texttospeech.SynthesisInput(text=text)

    # 남 or 여
    gender_choice = random.choice([texttospeech.SsmlVoiceGender.MALE, texttospeech.SsmlVoiceGender.FEMALE])

    voice = texttospeech.VoiceSelectionParams(
        language_code="ko-KR",
        ssml_gender=gender_choice
    )

    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.LINEAR16
    )

    response = tts_client.synthesize_speech(input=input_text, voice=voice, audio_config=audio_config)

    audio_data = BytesIO(response.audio_content)
    audio_data.seek(0)

    return audio_data

# S3 업로드 함수
def upload_to_s3(file_data: BytesIO, file_name: str):
    s3_bucket_name = os.getenv("S3_BUCKET_NAME")
    s3_client.upload_fileobj(file_data, s3_bucket_name, file_name)
    file_url = f"https://{s3_bucket_name}.s3.amazonaws.com/{file_name}"
    return file_url

# FastAPI 엔드포인트
@router.post("/questions")
async def generate_questions(
    category: str = Form(...),  # 희망 직무 입력
    file: UploadFile = File(...)  # .md 파일 업로드
):
    # .md 파일 읽기
    content = await file.read()
    md_content = extract_text_from_md(content.decode('utf-8'))
    
    # GPT API를 통해 주제별 질문 생성
    questions = generate_topic_based_questions(md_content, category)
    
    # TTS 변환 -> S3 업로드
    audio_urls = {}
    for question_key, question_text in questions.items():
        audio_data = generate_tts_audio(question_text)
        file_name = f"{question_key}.wav"
        audio_url = upload_to_s3(audio_data, file_name)
        audio_urls[question_key] = audio_url

    # 질문을 JSON 형식으로 반환
    return JSONResponse(content={"questions": questions, "audio_urls": audio_urls})
