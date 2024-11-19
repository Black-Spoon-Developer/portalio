from pydantic import BaseModel, ConfigDict
from typing import Any, Dict, Optional, List
from datetime import datetime

# 수정 schemas

class BaseDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class PortfolioDTO(BaseDTO):
    portfolio_id: int
    portfolio_title: str
    portfolio_description: str | None = None
    portfolio_is_primary: bool = False

class RepositoryDTO(BaseDTO):
    repository_id: int
    repository_title: str
    repository_description: str | None = None
    repository_is_primary: bool = False
    
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
    question_id: int
    question_tag: str
    question_intent: str
    question_text: str
    audio_s3_url: Optional[str] = None
    # -> 일단 안 쓰는 중

class QuestionRequestDTO(BaseDTO):
    # interview_id: int
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

class VideoResponseDTO(BaseDTO):
    answer_id: int
    feedback: str
    feedback_json: Optional[Dict[str, Any]] = None

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


# class TimeSeriesData(BaseModel):
#     time: int
#     emotion: str
#     movement_focus: float
#     gaze_focus: float

class AnalysisResult(BaseModel):
    current_emotion: str
    movement_focus: float
    gaze_focus: float
    time_series_data: List[Dict[str, Any]]
    
    class Config:
        from_attributes = True

# 화상 관련
class SpeechAnalysis(BaseDTO):  # 새로 추가
    transcript: str
    pronunciation_issues: List[Dict[str, Any]]
    word_timestamps: List[Dict[str, Any]]

# class VideoAnalysisResult(BaseDTO):
#     current_emotion: str
#     movement_focus: float
#     gaze_focus: float
#     time_series_data: List[Dict[str, Any]]

class VideoAnswerRequest(BaseAnswerRequest):
    pass


# class VideoAnswerResponse(VideoResponseDTO):
#     video_analysis: VideoAnalysisResult
#     audio_analysis: AudioAnalysisResult

class AudioMetrics(BaseDTO):
    speech_rate: float
    volume_variation: float
    silence_ratio: float
    fluency_score: float

class TimeSeriesData(BaseDTO):
    time: int
    emotion: str
    movement_focus: float
    gaze_focus: float

class AudioAnalysisResult(BaseDTO):
    speech_analysis: Dict[str, Any]
    audio_metrics: Dict[str, Any]

class VideoAnalysisResult(BaseDTO):
    current_emotion: str
    movement_focus: float
    gaze_focus: float
    time_series_data: List[TimeSeriesData]

class VideoAnswerResponse(BaseDTO):
    answer_id: int
    feedback: str
    feedback_json: Dict[str, Any]
    video_analysis: VideoAnalysisResult
    audio_analysis: AudioAnalysisResult
