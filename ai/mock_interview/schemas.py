from pydantic import BaseModel
from typing import Dict, Optional, List
from datetime import datetime

# 수정 schemas

class PortfolioDTO(BaseModel):
    portfolio_id: int
    portfolio_title: str
    portfolio_content: str
    summary_text: Optional[str] = None

class RepositoryDTO(BaseModel):
    repository_id: int
    repository_title: str
    repository_content: str
    summary_text: Optional[str] = None

class MemberJobDTO(BaseModel):
    job_id: int
    job_name: str

class MemberInfoDTO(BaseModel):
    member_id: int
    portfolios: List[PortfolioDTO] = []
    repositories: List[RepositoryDTO] = []
    hope_jobs: List[MemberJobDTO] = []

    class Config:
        from_attributes = True

class QuestionDTO(BaseModel):
    question_tag: str
    question_intent: str
    question_text: str
    audio_s3_url: Optional[str] = None

class QuestionRequestDTO(BaseModel):
    interview_id: int
    portfolio_id: Optional[int] = None
    repository_id: Optional[int] = None
    job_role_ids: List[int]

class QuestionResponseDTO(BaseModel):
    questions: List[QuestionDTO]

class InterviewCreateResponseDTO(BaseModel):
    interview_id: int

class AnswerRequestDTO(BaseModel):
    question_id: int
    answer_text: str  # 사용자가 입력한 답변 텍스트

class AnswerResponseDTO(BaseModel):
    answer_id: int
    feedback: str  # 피드백 텍스트
    feedback_json: Optional[Dict] = None  # JSON 형식의 상세 피드백