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

# GPT API를 사용하여 주제별 질문 생성 함수
def generate_topic_based_questions(md_content: str, category: str):
    # 각 주제별로 프롬프트 설정
    prompts = {
        "직무": f"Here is some content from a portfolio:\n\n{md_content}\n\nPlease create 2 insightful interview questions related to '{category}' job terms or situational aspects.",
        "경험": f"Here is some content from a portfolio:\n\n{md_content}\n\nPlease create 2 insightful interview questions based on the candidate's past experiences.",
        "인성": f"Here is some content from a portfolio:\n\n{md_content}\n\nPlease create 1 insightful interview question to assess the candidate's personality traits.",
    }
    
    questions = {"직무": [], "경험": [], "인성": []}
    
    # 주제별 질문 생성
    for topic, prompt in prompts.items():
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an AI assistant that generates structured mock interview questions in Korean."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=300,
            temperature=0.7,
        )
        
        # 생성된 질문을 리스트로 저장
        question_text = response.choices[0].message['content'].strip().split("\n")
        questions[topic].extend([q.strip() for q in question_text if q.strip()])
        
    return questions

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
    
    # 질문을 JSON 형식으로 반환
    return JSONResponse(content=questions)
