from fastapi import APIRouter, Form
from fastapi.responses import JSONResponse
import openai
import os
from dotenv import load_dotenv

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

router = APIRouter()

# GPT API를 통해 답변 평가 및 첨삭 생성 함수
def evaluate_and_correct_answer(role: str, question: str, question_topic: str, answer: str, portfolio: str):
    # 평가 및 첨삭 프롬프트 생성
    prompt = (
        f"희망 직무: {role}\n"
        f"포트폴리오 내용:\n{portfolio}\n\n"
        f"질문: {question} (주제: {question_topic})\n"
        f"답변: {answer}\n\n"
        "위 답변에 대해 평가와 첨삭을 제공해 주세요. 간단한 평가와 첨삭된 답변을 제공합니다."
    )

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a feedback assistant for mock interviews."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=300,
        temperature=0.7
    )

    feedback_content = response.choices[0].message['content'].split('\n')
    return {
        "평가": feedback_content[0],
        "첨삭": feedback_content[1]
    }

# FastAPI 엔드포인트
@router.post("/evaluate")
async def evaluate_answer(
    role: str = Form(...),
    question: str = Form(...),
    question_topic: str = Form(...),
    answer: str = Form(...),
    portfolio: str = Form(...)  # 추가된 포트폴리오 내용
):
    feedback = evaluate_and_correct_answer(role, question, question_topic, answer, portfolio)
    return JSONResponse(content=feedback)
