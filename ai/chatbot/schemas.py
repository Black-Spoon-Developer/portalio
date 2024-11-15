from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class ChatbotRequestDTO(BaseModel):
    member_id: int
    chatbot_prompt: str

class ChatbotResponseDTO(BaseModel):
    chatbot_id: int
    created: datetime
    updated: datetime
    member_id: int
    chatbot_prompt: str
    chatbot_response: Optional[str] = None

class ChatbotHistoryDTO(BaseModel):
    history: List[ChatbotResponseDTO]