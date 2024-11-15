from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_db
from ai.chatbot.schemas import ChatbotRequestDTO, ChatbotResponseDTO, ChatbotHistoryDTO
from ai.chatbot.services import generate_chatbot_response, get_chatbot_history
from utils.dependencies import get_current_member

router = APIRouter()

# 새 챗봇 대화 생성 및 응답 반환
@router.post("/chatbot", response_model=ChatbotResponseDTO)
async def create_chatbot_entry(
    request: ChatbotRequestDTO,
    db: AsyncSession = Depends(get_db),
    member=Depends(get_current_member)  # 토큰으로부터 member_id 추출
):
    request.member_id = member.member_id  # 토큰에서 가져온 member_id 설정
    return await generate_chatbot_response(db, request)

# 특정 사용자의 챗봇 대화 히스토리 조회
@router.get("/chatbot/history", response_model=ChatbotHistoryDTO)
async def get_chatbot_history_endpoint(
    db: AsyncSession = Depends(get_db),
    member=Depends(get_current_member)
):
    history = await get_chatbot_history(db, member.member_id)  # 토큰에서 가져온 member_id 사용
    return ChatbotHistoryDTO(history=history)