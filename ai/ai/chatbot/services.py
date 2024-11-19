from typing import List, Optional
from sqlalchemy import select
import openai
from sqlalchemy.ext.asyncio import AsyncSession
from models import Chatbot
from datetime import datetime
from ai.chatbot.schemas import ChatbotRequestDTO, ChatbotResponseDTO
import os

openai.api_key = os.getenv("OPENAI_API_KEY")

async def generate_chatbot_response(db: AsyncSession, request: ChatbotRequestDTO) -> ChatbotResponseDTO:
    # 사용자 질문을 바탕으로 마크다운 문법 관련 안내 요청
    prompt_text = f"마크다운 문법에 대한 질문입니다. '{request.chatbot_prompt}'에 대해 마크다운 문법을 사용하여 설명하고 예시를 제공해 주세요."
    
    # OpenAI API 호출하여 응답 생성
    response = openai.Completion.create(
        model="gpt-4o-mini",
        prompt=prompt_text,
        max_tokens=150,
        temperature=0.7,
    )
    chatbot_response_text = response.choices[0].text.strip()

    # Chatbot 데이터 생성 및 저장
    new_chatbot_entry = Chatbot(
        member_id=request.member_id,
        chatbot_prompt=request.chatbot_prompt,
        chatbot_response=chatbot_response_text,
        created=datetime.utcnow(),
        updated=datetime.utcnow()
    )
    db.add(new_chatbot_entry)
    await db.commit()
    await db.refresh(new_chatbot_entry)

    return ChatbotResponseDTO(
        chatbot_id=new_chatbot_entry.chatbot_id,
        created=new_chatbot_entry.created,
        updated=new_chatbot_entry.updated,
        member_id=new_chatbot_entry.member_id,
        chatbot_prompt=new_chatbot_entry.chatbot_prompt,
        chatbot_response=new_chatbot_entry.chatbot_response
    )

async def get_chatbot_history(db: AsyncSession, member_id: int) -> List[ChatbotResponseDTO]:
    result = await db.execute(select(Chatbot).filter(Chatbot.member_id == member_id).order_by(Chatbot.created))
    history = result.scalars().all()
    return [
        ChatbotResponseDTO(
            chatbot_id=entry.chatbot_id,
            created=entry.created,
            updated=entry.updated,
            member_id=entry.member_id,
            chatbot_prompt=entry.chatbot_prompt,
            chatbot_response=entry.chatbot_response
        ) for entry in history
    ]
