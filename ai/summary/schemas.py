from pydantic import BaseModel
from typing import Optional

class SummaryRequestDTO(BaseModel):
    content: str  # 요약할 텍스트 내용
    portfolio_id: Optional[int] = None  # 포트폴리오 ID
    repository_id: Optional[int] = None  # 레포지토리 ID

class SummaryResponseDTO(BaseModel):
    summary_text: str  # 생성된 요약 내용
