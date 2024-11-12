# sqlalchemy, etc, ... setting
from sqlalchemy import JSON, Column, String, Integer, BigInteger, Enum, DateTime, ForeignKey, Float, Boolean, Text
from sqlalchemy.orm import relationship, Session
from datetime import datetime

# module setting
from database import Base

class Member(Base):
    __tablename__ = 'member'
    
    member_id = Column(BigInteger, primary_key=True)
    refresh_token_id = Column(BigInteger, ForeignKey('refresh_token.refresh_token_id'))
    
    # 관계 설정
    refresh_token = relationship("RefreshToken", back_populates="members")
    portfolios = relationship("Portfolio", back_populates="member")
    repositories = relationship("Repository", back_populates="member")
    user_detail = relationship("UserDetail", back_populates="member", uselist=False)
    member_job = relationship("MemberJob", back_populates="member")
    interviews = relationship("Interview", back_populates="member", cascade="all, delete-orphan")
    answers = relationship("Answer", back_populates="member", cascade="all, delete-orphan")
    reports = relationship("Report", back_populates="member", cascade="all, delete-orphan")
    chatbot_entries = relationship("ChatBot", back_populates="member")


class Portfolio(Base):
    __tablename__ = 'portfolio'
    
    portfolio_id = Column(BigInteger, primary_key=True)
    job_id = Column(BigInteger, ForeignKey('job_sub_category.job_id'))
    member_id = Column(BigInteger, ForeignKey('member.member_id'))
    portfolio_title = Column(String(50))
    portfolio_content = Column(Text)
    created = Column(DateTime, default=datetime.utcnow)
    updated = Column(DateTime, default=datetime.utcnow)

    # 관계 설정
    member = relationship("Member", back_populates="portfolios")
    job = relationship("JobSubCategory", back_populates="portfolios")
    summary = relationship("PortfolioSummary", back_populates="portfolio", uselist=False, cascade="all, delete-orphan")

class Repository(Base):
    __tablename__ = 'repository'
    
    repository_id = Column(BigInteger, primary_key=True)
    member_id = Column(BigInteger, ForeignKey('member.member_id'))
    repository_title = Column(String(50))
    repository_content = Column(Text)
    created = Column(DateTime, default=datetime.utcnow)
    updated = Column(DateTime, default=datetime.utcnow)

    # 관계 설정
    member = relationship("Member", back_populates="repositories")
    summary = relationship("RepositorySummary", back_populates="repository", uselist=False, cascade="all, delete-orphan")

class UserDetail(Base):
    __tablename__ = 'user_detail'
    
    member_id = Column(BigInteger, ForeignKey('member.member_id'), primary_key=True)
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

    member = relationship("Member", back_populates="member_job")
    job = relationship("JobSubCategory", back_populates="member_job")


class Interview(Base):
    __tablename__ = 'interview'

    interview_id = Column(BigInteger, primary_key=True, autoincrement=True)
    member_id = Column(BigInteger, ForeignKey('member.member_id'), nullable=False)
    interview_type = Column(Enum('video', 'audio', 'text'), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # 관계 설정
    member = relationship("Member", back_populates="interviews")
    questions = relationship("Question", back_populates="interview", cascade="all, delete-orphan")


class Question(Base):
    __tablename__ = 'question'

    question_id = Column(BigInteger, primary_key=True, autoincrement=True)
    interview_id = Column(BigInteger, ForeignKey('interview.interview_id'), nullable=False)
    question_tag = Column(Enum('직무', '경험', '인성'), nullable=False)
    question_intent = Column(Text, nullable=False)
    content = Column(Text, nullable=False)
    audio_s3_key = Column(String(255))  # 오디오 파일 키 저장
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
    interview_type = Column(Enum('video', 'audio', 'text'), nullable=False)  # 인터뷰 타입
    video_s3_key = Column(String(255))  # 비디오 파일 키 저장
    audio_s3_key = Column(String(255))  # 오디오 파일 키 저장
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # 관계 설정
    question = relationship("Question", back_populates="answers")
    member = relationship("Member", back_populates="answers")
    feedback = relationship("Feedback", back_populates="answer", uselist=False, cascade="all, delete-orphan")
    
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