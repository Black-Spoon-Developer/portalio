from pydantic import BaseModel
from typing import List

class TextCorrectionRequestDTO(BaseModel):
    content: str  # 입력 텍스트 필드

class TextCorrectionResponseDTO(BaseModel):
    recom: List[dict]  # 교정된 문장을 담은 리스트
