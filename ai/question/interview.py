from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from fastapi.responses import JSONResponse
import openai
import markdown
from bs4 import BeautifulSoup
import os
from dotenv import load_dotenv
from google.cloud import texttospeech, speech
import boto3
from io import BytesIO
import random

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

s3_client = boto3.client(
    "s3",
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    region_name=os.getenv("AWS_REGION")
)

tts_client = texttospeech.TextToSpeechClient()
stt_client = speech.SpeechClient()

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")

router = APIRouter()

def extract_text_from_md(file_content: str) -> str:
    html_content = markdown.markdown(file_content)
    soup = BeautifulSoup(html_content, 'html.parser')
    text = soup.get_text()
    return text

def generate_topic_based_questions(md_content: str, category: str):
    prompts = {
        "직무": f"Here is some content from a portfolio:\n\n{md_content}\n\nPlease create 2 interview questions for '{category}'.",
        "경험": f"Here is some content from a portfolio:\n\n{md_content}\n\nPlease create 2 experience-based interview questions.",
        "인성": f"Here is some content from a portfolio:\n\n{md_content}\n\nPlease create 1 personality assessment question."
    }
    questions = {}
    question_count = 1

    for topic, prompt in prompts.items():
        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[{"role": "system", "content": "You are a Korean interview question assistant."}, {"role": "user", "content": prompt}],
            max_tokens=300,
            temperature=0.7
        )
        question_text = response.choices[0].message['content'].strip().split("\n")
        for q in question_text:
            if q.strip():
                questions[f"question{question_count}"] = f"{topic}: {q.strip()}"
                question_count += 1

    return questions

def generate_tts_audio(text: str) -> BytesIO:
    input_text = texttospeech.SynthesisInput(text=text)
    gender_choice = random.choice([texttospeech.SsmlVoiceGender.MALE, texttospeech.SsmlVoiceGender.FEMALE])
    voice = texttospeech.VoiceSelectionParams(language_code="ko-KR", ssml_gender=gender_choice)
    audio_config = texttospeech.AudioConfig(audio_encoding=texttospeech.AudioEncoding.LINEAR16)
    response = tts_client.synthesize_speech(input=input_text, voice=voice, audio_config=audio_config)
    audio_data = BytesIO(response.audio_content)
    audio_data.seek(0)
    return audio_data

def upload_to_s3(file_data: BytesIO, file_name: str):
    s3_bucket_name = os.getenv("S3_BUCKET_NAME")
    s3_client.upload_fileobj(file_data, s3_bucket_name, file_name)
    return f"https://{s3_bucket_name}.s3.amazonaws.com/{file_name}"

def transcribe_audio(file: UploadFile) -> str:
    audio_content = file.file.read()
    audio = speech.RecognitionAudio(content=audio_content)

    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
        sample_rate_hertz=48000,  # 일반적인 녹음 파일 샘플 속도
        language_code="ko-KR",
        enable_automatic_punctuation=True
    )

    try:
        response = stt_client.recognize(config=config, audio=audio)
        return " ".join(result.alternatives[0].transcript for result in response.results)
    except Exception as e:
        print(f"STT 실패: {e}")
        raise HTTPException(status_code=500, detail="음성 인식 실패")

def evaluate_answer(question, answer, role, portfolio):
    prompt = (
        f"직무: {role}\n"
        f"포트폴리오: {portfolio}\n"
        f"질문: {question}\n"
        f"답변: {answer}\n\n"
        "위 답변에 대해 평가와 첨삭을 제공합니다."
    )
    response = openai.ChatCompletion.create(
        model="gpt-4o-mini",
        messages=[{"role": "system", "content": "Provide feedback and corrections."}, {"role": "user", "content": prompt}],
        max_tokens=300,
        temperature=0.7
    )
    feedback_content = response.choices[0].message['content'].split('\n')
    return {"평가": feedback_content[0], "첨삭": feedback_content[1]}

@router.post("/generate_questions")
async def generate_questions(
    category: str = Form(...),
    file: UploadFile = File(...)
):
    content = await file.read()
    md_content = extract_text_from_md(content.decode('utf-8'))
    questions = generate_topic_based_questions(md_content, category)
    
    audio_urls = {}
    for question_key, question_text in questions.items():
        audio_data = generate_tts_audio(question_text)
        file_name = f"{question_key}.wav"
        audio_url = upload_to_s3(audio_data, file_name)
        audio_urls[question_key] = audio_url

    return JSONResponse(content={"questions": questions, "audio_urls": audio_urls})

@router.post("/submit_answers")
async def submit_answers(
    role: str = Form(...),
    portfolio: str = Form(...),
    answers: dict = Form(...)
):
    questions = answers.keys()
    feedbacks = {}

    for question_key, answer in answers.items():
        question_text = answers[question_key]["question"]
        answer_text = answers[question_key]["answer"]
        feedback = evaluate_answer(question_text, answer_text, role, portfolio)
        feedbacks[question_key] = feedback

    return JSONResponse(content={"answers": answers, "feedbacks": feedbacks})

@router.post("/transcribe_audio")
async def transcribe_audio_endpoint(file: UploadFile = File(...)):
    transcript = transcribe_audio(file)
    return JSONResponse(content={"transcript": transcript})