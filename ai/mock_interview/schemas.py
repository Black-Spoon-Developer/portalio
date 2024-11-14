from pydantic import BaseModel, ConfigDict
from typing import Dict, Optional, List
from datetime import datetime

# 수정 schemas

class BaseDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class PortfolioDTO(BaseDTO):
    portfolio_id: int
    portfolio_title: str

class RepositoryDTO(BaseDTO):
    repository_id: int
    repository_title: str

class MemberJobDTO(BaseDTO):
    job_id: int
    job_name: str

class MemberInfoDTO(BaseDTO):
    member_id: int
    portfolios: List[PortfolioDTO] = []
    repositories: List[RepositoryDTO] = []
    hope_jobs: List[MemberJobDTO] = []
    # interview_id: Optional[int] = None

class QuestionDTO(BaseDTO):
    question_tag: str
    question_intent: str
    question_text: str
    audio_s3_url: Optional[str] = None

class QuestionRequestDTO(BaseDTO):
    portfolio_id: Optional[int] = None
    repository_id: Optional[int] = None
    job_roles: List[str]

class QuestionResponseDTO(BaseDTO):
    interview_id: int  # 추가
    portfolio_id: Optional[int]  # 추가
    repository_id: Optional[int]  # 추가
    questions: List[QuestionDTO]

class InterviewCreateResponseDTO(BaseDTO):
    interview_id: int

# class AnswerRequestDTO(BaseDTO):
#     interview_id: int
#     question_id: int
#     answer_text: Optional[str] = None
#     question: str
#     question_intent: str
#     context_text: str
    # interview_type: str

class AnswerResponseDTO(BaseDTO):
    answer_id: int
    feedback: str  # 피드백 텍스트
    feedback_json: Optional[Dict] = None  # JSON 형식의 상세 피드백

class BaseAnswerRequest(BaseDTO):
    interview_id: int
    question_id: int
    portfolio_id: Optional[int] = None
    repository_id: Optional[int] = None

class TextAnswerRequest(BaseAnswerRequest):
    answer_text: str

class AudioAnswerRequest(BaseDTO):
    interview_id: int
    question_id: int
    portfolio_id: Optional[int] = None
    repository_id: Optional[int] = None