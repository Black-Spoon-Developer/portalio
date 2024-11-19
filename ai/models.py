# sqlalchemy, etc, ... setting
import enum
from sqlalchemy import Enum as SQLAlchemyEnum
from sqlalchemy import JSON, Column, Double, String, Integer, BigInteger, Enum, DateTime, ForeignKey, Float, Boolean, Text
from sqlalchemy.orm import relationship, Session
from datetime import datetime

# module setting
from database import Base

class Member(Base):
    __tablename__ = 'member'
    
    member_id = Column(BigInteger, primary_key=True)
    member_picture = Column(String(255), nullable=False)
    refresh_token_id = Column(BigInteger, ForeignKey('refresh_token.refresh_token_id'))
    
    # 관계 설정
    refresh_token = relationship("RefreshToken", back_populates="members")
    portfolios = relationship("Portfolio", back_populates="member")
    repositories = relationship("Repository", back_populates="member")
    user_detail = relationship("UserDetail", back_populates="member", uselist=False)
    member_jobs = relationship("MemberJob", back_populates="member", cascade="all, delete-orphan")
    interviews = relationship("Interview", back_populates="member", cascade="all, delete-orphan")
    answers = relationship("Answer", back_populates="member", cascade="all, delete-orphan")
    reports = relationship("Report", back_populates="member", cascade="all, delete-orphan")
    chatbot_entries = relationship("Chatbot", back_populates="member")


class Portfolio(Base):
    __tablename__ = 'portfolio'
    
    portfolio_is_primary = Column(Boolean, default=False, server_default='0')
    portfolio_id = Column(BigInteger, primary_key=True)
    job_id = Column(BigInteger, ForeignKey('job_sub_category.job_id'))
    member_id = Column(BigInteger, ForeignKey('member.member_id'))
    portfolio_title = Column(String(50))
    portfolio_content = Column(Text)
    portfolio_description = Column(Text)
    created = Column(DateTime, default=datetime.utcnow)
    updated = Column(DateTime, default=datetime.utcnow)

    # 관계 설정
    member = relationship("Member", back_populates="portfolios")
    job = relationship("JobSubCategory", back_populates="portfolios")
    summary = relationship("PortfolioSummary", back_populates="portfolio", uselist=False, cascade="all, delete-orphan")

class Repository(Base):
    __tablename__ = 'repository'
    
    repository_is_primary = Column(Boolean, default=False, server_default='0')
    repository_id = Column(BigInteger, primary_key=True)
    member_id = Column(BigInteger, ForeignKey('member.member_id'))
    repository_title = Column(String(50))
    repository_content = Column(Text)
    repository_description = Column(Text)
    created = Column(DateTime, default=datetime.utcnow)
    updated = Column(DateTime, default=datetime.utcnow)

    # 관계 설정
    member = relationship("Member", back_populates="repositories")
    summary = relationship("RepositorySummary", back_populates="repository", uselist=False, cascade="all, delete-orphan")

class UserDetail(Base):
    __tablename__ = 'user_detail'
    
    member_id = Column(BigInteger, ForeignKey('member.member_id'), primary_key=True)
    user_nickname = Column(String(255))
    user_ticket = Column(Integer)

    # 관계 설정
    member = relationship("Member", back_populates="user_detail")


class JobMajorCategory(Base):
    __tablename__ = 'job_major_category'
    
    industry_id = Column(BigInteger, primary_key=True)
    industry_name = Column(String(50))

    # 관계 설정
    sub_categories = relationship("JobSubCategory", back_populates="industry")


class JobSubCategory(Base):
    __tablename__ = 'job_sub_category'
    
    job_id = Column(BigInteger, primary_key=True)
    industry_id = Column(BigInteger, ForeignKey('job_major_category.industry_id'))
    job_name = Column(String(50))

    # 관계 설정
    industry = relationship("JobMajorCategory", back_populates="sub_categories")
    portfolios = relationship("Portfolio", back_populates="job")
    member_job = relationship("MemberJob", back_populates="job")


class RefreshToken(Base):
    __tablename__ = 'refresh_token'
    
    refresh_token_id = Column(BigInteger, primary_key=True)
    value = Column(Text)

    # 관계 설정
    members = relationship("Member", back_populates="refresh_token")


class MemberJob(Base):
    __tablename__ = 'member_job'

    job_id = Column(BigInteger, ForeignKey('job_sub_category.job_id'), primary_key=True)
    member_id = Column(BigInteger, ForeignKey('member.member_id'), primary_key=True)

    member = relationship("Member", back_populates="member_jobs")
    job = relationship("JobSubCategory", back_populates="member_job")

class InterviewType(enum.Enum):
    video = "video"
    audio = "audio"
    text = "text"
    undefined = "undefined"  # 디폴트 상태로 추가

class QuestionTag(str, enum.Enum):
    role = "직무"
    exp = "경험"
    fit = "인성"
    ready = "준비"  # 디폴트 상태로 추가

class Interview(Base):
    __tablename__ = 'interview'

    interview_id = Column(BigInteger, primary_key=True, autoincrement=True)
    member_id = Column(BigInteger, ForeignKey('member.member_id'), nullable=False)
    interview_type = Column(Enum(InterviewType), default=InterviewType.undefined.value, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # 관계 설정
    member = relationship("Member", back_populates="interviews")
    questions = relationship("Question", back_populates="interview", cascade="all, delete-orphan")
    reports = relationship("Report", back_populates="interview", cascade="all, delete-orphan")

class Question(Base):
    __tablename__ = 'question'

    question_id = Column(BigInteger, primary_key=True, autoincrement=True)
    interview_id = Column(BigInteger, ForeignKey('interview.interview_id'), nullable=False)
    # SQLAlchemyEnum으로 변경
    question_tag = Column(SQLAlchemyEnum(QuestionTag, values_callable=lambda obj: [e.value for e in obj]), nullable=False)
    question_intent = Column(Text, nullable=False)
    content = Column(Text, nullable=False)
    audio_s3_key = Column(String(255), default='ready')
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # 관계 설정
    interview = relationship("Interview", back_populates="questions")
    answers = relationship("Answer", back_populates="question", cascade="all, delete-orphan")

class Answer(Base):
    __tablename__ = 'answer'

    answer_id = Column(BigInteger, primary_key=True, autoincrement=True)
    question_id = Column(BigInteger, ForeignKey('question.question_id'), nullable=False)
    member_id = Column(BigInteger, ForeignKey('member.member_id'), nullable=False)
    content = Column(Text)
    interview_type = Column(Enum(InterviewType), default=InterviewType.undefined.value, nullable=False)  # 인터뷰 타입
    video_s3_key = Column(String(255), default='ready')  # 비디오 파일 키 저장
    audio_s3_key = Column(String(255), default='ready')  # 오디오 파일 키 저장
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # 관계 설정
    question = relationship("Question", back_populates="answers")
    member = relationship("Member", back_populates="answers")
    feedbacks = relationship("Feedback", back_populates="answer", uselist=False, cascade="all, delete-orphan")
    analyze_audio = relationship("Analyze", back_populates="answer", uselist=False)
    video_analyze = relationship("VideoAnalyze", back_populates="answer", uselist=False)
    
class Report(Base):
    __tablename__ = 'report'

    report_id = Column(BigInteger, primary_key=True, autoincrement=True)
    interview_id = Column(BigInteger, ForeignKey('interview.interview_id'), nullable=False)
    member_id = Column(BigInteger, ForeignKey('member.member_id'), nullable=False)
    title = Column(String(100))
    content = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # 관계 설정
    interview = relationship("Interview", back_populates="reports")
    member = relationship("Member", back_populates="reports")

class PortfolioSummary(Base):
    __tablename__ = 'portfolio_summary'
    
    summary_id = Column(BigInteger, primary_key=True, autoincrement=True)
    portfolio_id = Column(BigInteger, ForeignKey('portfolio.portfolio_id', ondelete="CASCADE"), unique=True)
    summary_text = Column(Text)

    # 관계 설정
    portfolio = relationship("Portfolio", back_populates="summary")


class RepositorySummary(Base):
    __tablename__ = 'repository_summary'
    
    summary_id = Column(BigInteger, primary_key=True, autoincrement=True)
    repository_id = Column(BigInteger, ForeignKey('repository.repository_id', ondelete="CASCADE"), unique=True)
    summary_text = Column(Text)

    # 관계 설정
    repository = relationship("Repository", back_populates="summary")

class Chatbot(Base):
    __tablename__ = 'chatbot'

    chatbot_id = Column(BigInteger, primary_key=True, autoincrement=True)
    created = Column(DateTime, default=datetime.utcnow)
    updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    member_id = Column(BigInteger, ForeignKey('member.member_id'))
    chatbot_prompt = Column(Text, nullable=False)
    chatbot_response = Column(Text)

    # 관계 설정
    member = relationship("Member", back_populates="chatbot_entries")

class Feedback(Base):
    __tablename__ = 'feedback'
    
    feedback_id = Column(BigInteger, primary_key=True, autoincrement=True)
    answer_id = Column(BigInteger, ForeignKey('answer.answer_id'), nullable=False)
    feedback_text = Column(Text, nullable=False)
    feedback_data = Column(JSON)  # JSON 타입으로 설정
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # 관계 설정
    answer = relationship("Answer", back_populates="feedbacks")

class Analyze(Base):
    __tablename__ = 'analyze_audio'

    analyze_id = Column(BigInteger, primary_key=True, autoincrement=True)
    answer_id = Column(BigInteger, ForeignKey('answer.answer_id', ondelete="CASCADE"), nullable=False)
    transcript = Column(Text, nullable=True)                  # 변환된 텍스트
    speech_rate = Column(Double, nullable=True)               # 말하는 속도 (BPM)
    volume_variation = Column(Double, nullable=True)          # 볼륨 떨림 정도 (RMS 표준편차)
    silence_ratio = Column(Double, nullable=True)             # 무음 비율
    fluency_score = Column(Double, nullable=True)             # 유창성 점수
    pronunciation_issues = Column(JSON, nullable=True)        # 발음 문제 JSON
    word_timestamps = Column(JSON, nullable=True)             # 단어별 타임스탬프 JSON
    created_at = Column(DateTime, default=datetime.utcnow)

    # 관계 설정
    answer = relationship("Answer", back_populates="analyze_audio")

class InterviewAnalysis(Base):
    __tablename__ = "interview_analysis"

    interview_analysis_id = Column(Integer, primary_key=True, index=True)
    interview_id = Column(Integer, index=True)
    question_id = Column(Integer)
    current_emotion = Column(String(50), default="중립")
    movement_focus = Column(Float, default=100)
    gaze_focus = Column(Float, default=100)

class TimeSeriesData(Base):
    __tablename__ = "time_series_data"
    
    time_series_data_id = Column(Integer, primary_key=True, index=True)
    analysis_id = Column(Integer, ForeignKey('interview_analysis.interview_analysis_id'))
    time_data = Column(Text)  # JSON 데이터를 문자열로 저장

    analysis = relationship("InterviewAnalysis", back_populates="time_series")

InterviewAnalysis.time_series = relationship("TimeSeriesData", back_populates="analysis")

class VideoAnalyze(Base):
    __tablename__ = "video_analyze"

    video_analyze_id = Column(Integer, primary_key=True, index=True)
    answer_id = Column(Integer, ForeignKey("answer.answer_id"))
    
    # 음성 분석 필드
    transcript = Column(Text)
    speech_rate = Column(Float)
    volume_variation = Column(Float)
    silence_ratio = Column(Float)
    fluency_score = Column(Float)
    pronunciation_issues = Column(Text)  # JSON string
    word_timestamps = Column(Text)  # JSON string
    
    # 화상 분석 필드
    emotion = Column(String(50))
    movement_focus = Column(Float)
    gaze_focus = Column(Float)
    time_series_data = Column(Text)  # JSON string
    
    created_at = Column(DateTime, default=datetime.utcnow)

    # 관계 설정
    answer = relationship("Answer", back_populates="video_analyze")

class InterviewLog(Base):
    __tablename__ = 'interview_log'
    
    interview_log_id = Column(BigInteger, primary_key=True, autoincrement=True)
    member_id = Column(BigInteger, ForeignKey('member.member_id'), nullable=False)
    interview_id = Column(BigInteger, ForeignKey('interview.interview_id'), nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    portfolio_title = Column(String(50), nullable=True)
    repository_title = Column(String(50), nullable=True)
    select_job = Column(String(100), nullable=False)
    interview_type = Column(String(50), nullable=True)
    interview_grade = Column(String(50), nullable=True)

    # 관계 설정
    member = relationship("Member", back_populates="interview_logs")
    interview = relationship("Interview", back_populates="interview_log")

Member.interview_logs = relationship("InterviewLog", back_populates="member")
Interview.interview_log = relationship("InterviewLog", back_populates="interview", uselist=False)