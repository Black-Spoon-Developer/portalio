import json
from typing import Dict, List
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
import openai
import os
from dotenv import load_dotenv

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

router = APIRouter()

import json
from typing import List, Dict
from fastapi import HTTPException
import openai

async def check_spelling_and_grammar(text: str) -> List[Dict[str, str]]:
    # 텍스트를 1000자 단위로 나눔
    segments = [text[i:i+1000] for i in range(0, len(text), 1000)]
    corrections = []

    for segment in segments:
        prompt = (
            f"다음 텍스트의 맞춤법과 문법을 검토하고, 필요한 부분만 교정해 주세요.\n\n"
            "조건:\n"
            "1. 텍스트에서 표현된 원래 의미와 직무, 기술 용어를 최대한 유지합니다.\n"
            "2. 직무나 기술 용어로 보이는 표현은 넘어가고 교정하지 않습니다.\n"
            "3. 문법과 맞춤법 교정이 필요한 문장만 교정된 버전으로 반환합니다.\n"
            "4. 교정이 필요한 부분이 없으면 '교정이 필요하지 않습니다'라는 메시지를 반환합니다.\n\n"
            f"텍스트: {segment}\n\n"
            "결과를 정확히 다음 형식으로 반환하세요:\n"
            '{"교정 추천": [{"기존 문장": "original sentence", "교정된 문장": "corrected sentence"}]}'
        )

        response = await openai.ChatCompletion.acreate(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are an assistant that checks and corrects spelling and grammar."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=300,
            temperature=0.2
        )

        # 교정된 텍스트 추출 및 JSON 파싱 시도
        corrected_text = response.choices[0].message['content'].strip()
        try:
            corrected_dict = json.loads(corrected_text)  # JSON 파싱 시도
            corrections.extend(corrected_dict.get("교정 추천", []))  # 결과를 리스트에 추가
        except json.JSONDecodeError:
            # JSON 형식이 아닐 경우, 교정 항목이 없다는 기본 응답 추가
            if corrected_text == "교정이 필요하지 않습니다":
                corrections.append({"기존 문장": "N/A", "교정된 문장": "교정이 필요하지 않습니다"})
            else:
                # JSON 파싱 실패 시 오류 발생
                raise HTTPException(status_code=500, detail="Failed to parse correction suggestions. Received text: " + corrected_text)

    return corrections
