from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class TicketBallotDTO(BaseModel):
    member_id: int
    user_ticket: Optional[int] = None

class TicketUseDTO(BaseModel):
    before_ticket: Optional[int] = None
    after_ticket: Optional[int] = None

class JobSearchDTO(BaseModel):
    industry_id: int
    job_id: int
    job_name: Optional[str] = None

class MemberSelcetJobDTO(BaseModel):
    member_id: int
    job_id: Optional[List[int]] = []
    job_name: Optional[List[str]] = []

    class Config:
        from_attributes = True

class PortfolioSelectDTO(BaseModel):
    member_id: int
    job_id: Optional[List[int]] = []
    portfolio_id: Optional[List[int]] = []
    portfolio_title: Optional[str] = None
    portfolio_content: Optional[str] = None
    repository_id: Optional[List[int]] = []
    repository_title: Optional[List[str]] = []
    repository_content: Optional[List[str]] = []

    class Config:
        from_attributes = True

class QuestionListDTO(BaseModel):
    member_id: int
    interview_id: int
    question_id: Optional[List[int]] = []
    question_list: Optional[List[str]] = []
    
# 일단 텍스트 면접
class AnswerListDTO(BaseModel):
    member_id: int
    interview_id: int
    answer_id: Optional[List[int]] = []
    answer_list: Optional[List[str]] = []

class ReportDTO(BaseModel):
    member_id: int
    interview_id: int
    report_id: int
    answer_id: Optional[List[int]] = []
    answer_list: Optional[List[str]] = []
    answer_review: Optional[List[str]] = []
    answer_edit: Optional[List[str]] = []
    report_title: Optional[str] = None
    report_content: Optional[str] = None


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