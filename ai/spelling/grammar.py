from fastapi import APIRouter, Form
from fastapi.responses import JSONResponse
import openai
import os
from dotenv import load_dotenv

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

router = APIRouter()

# OpenAI API를 사용하여 맞춤법 및 문법 검사 및 교정 함수
def check_spelling_and_grammar(text: str):
    # 교정 프롬프트 설정
    prompt = (
        f"다음 텍스트의 맞춤법과 문법을 검토하고, 필요한 부분을 교정해 주세요.\n\n"
        f"텍스트: {text}\n\n"
        "교정된 텍스트를 제공해 주세요."
    )

    response = openai.ChatCompletion.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are an assistant that checks and corrects spelling and grammar."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=300,
        temperature=0.2
    )

    corrected_text = response.choices[0].message['content'].strip()
    return {"original_text": text, "corrected_text": corrected_text}

# FastAPI 엔드포인트
@router.post("/correct_text")
async def correct_text(
    text: str = Form(...)  # 교정을 원하는 텍스트
):
    correction_result = check_spelling_and_grammar(text)
    return JSONResponse(content=correction_result)
