import json
from typing import List
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
import openai
import os
from dotenv import load_dotenv

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

router = APIRouter()

# OpenAI API를 사용하여 맞춤법 및 문법 검사 및 교정 함수
def check_spelling_and_grammar(text: str) -> List[str]:
    # 교정 프롬프트 설정
    prompt = (
        f"다음 텍스트의 맞춤법과 문법을 검토하고, 필요한 부분만 교정해 주세요.\n\n"
        "조건:\n"
        "1. 텍스트에서 표현된 원래 의미와 직무, 기술 용어를 최대한 유지합니다.\n"
        "2. 직무나 기술 용어로 보이는 표현은 넘어가고 교정하지 않습니다.\n"
        "3. 문법과 맞춤법 교정이 필요한 문장만 교정된 버전으로 반환합니다.\n\n"
        f"텍스트: {text}\n\n"
        "결과를 다음 형식으로 반환하세요:\n"
        '{"교정 추천": ["문장 1", "문장 2", ...]}'
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

    # 교정된 텍스트 추출 및 JSON 파싱
    corrected_text = response.choices[0].message['content'].strip()
    try:
        corrected_dict = json.loads(corrected_text)  # JSON 파싱
        return corrected_dict.get("교정 추천", [])  # 리스트로 반환
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Failed to parse correction suggestions.")