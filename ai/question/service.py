from fastapi import APIRouter, File, UploadFile, Form
from fastapi.responses import JSONResponse
import openai
import markdown
from bs4 import BeautifulSoup
import os
from dotenv import load_dotenv

# 환경 변수 로드
load_dotenv()

# OpenAI API 키 설정
openai.api_key = os.getenv("OPENAI_API_KEY")

router = APIRouter()

# .md 파일에서 텍스트 추출 함수
def extract_text_from_md(file_content: str) -> str:
    html_content = markdown.markdown(file_content)
    soup = BeautifulSoup(html_content, 'html.parser')
    text = soup.get_text()
    return text

# GPT API를 사용하여 질문 생성 함수 (최신 API 호출 방식 사용)
def generate_interview_questions(md_content: str, category: str, num_questions: int):
    # 질문 생성 프롬프트
    prompt = (
        f"Here is some content from a portfolio:\n\n{md_content}\n\n"
        f"Please create {num_questions} insightful interview questions related to '{category}'. "
        "The questions should be numbered and returned as a JSON object where keys are 'question1', 'question2', etc."
    )

    # 최신 API 호출 방식
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are an AI assistant that creates structured mock interview questions."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=500,
        temperature=0.7,
    )

    # GPT 응답에서 질문 리스트 추출
    questions = response.choices[0].message['content']
    
    # GPT가 반환하는 JSON 형식의 응답을 바로 반환
    return questions

# FastAPI 엔드포인트
@router.post("/questions")
async def generate_questions(
    category: str = Form(...),  # 카테고리 입력
    num_questions: int = Form(...),  # 질문 개수 입력
    file: UploadFile = File(...)  # 파일 업로드
):
    # .md 파일 읽기
    content = await file.read()
    md_content = extract_text_from_md(content.decode('utf-8'))
    
    # GPT API를 통해 질문 생성
    questions = generate_interview_questions(md_content, category, num_questions)
    
    # 질문을 JSON 형식으로 반환
    return JSONResponse(content={"questions": questions})

