# sqlalchemy, etc, ... setting
from sqlalchemy import Column, String, Integer, BigInteger, Enum, DateTime, ForeignKey, Float, Boolean, Text
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
    hope_jobs = relationship("UserHopeJob", back_populates="member")
    user_detail = relationship("UserDetail", back_populates="member", uselist=False)


class Portfolio(Base):
    __tablename__ = 'portfolio'
    
    portfolio_id = Column(BigInteger, primary_key=True)
    job_id = Column(BigInteger, ForeignKey('job_sub_category.job_id'))
    member_id = Column(BigInteger, ForeignKey('member.member_id'))
    portfolio_title = Column(String(50))
    portfolio_content = Column(Text)

    # 관계 설정
    member = relationship("Member", back_populates="portfolios")
    job = relationship("JobSubCategory", back_populates="portfolios")


class Repository(Base):
    __tablename__ = 'repository'
    
    repository_id = Column(BigInteger, primary_key=True)
    member_id = Column(BigInteger, ForeignKey('member.member_id'))
    repository_title = Column(String(50))
    repository_content = Column(Text)

    # 관계 설정
    member = relationship("Member", back_populates="repositories")


class UserDetail(Base):
    __tablename__ = 'user_detail'
    
    member_id = Column(BigInteger, ForeignKey('member.member_id'), primary_key=True)
    user_ticket = Column(Integer)

    # 관계 설정
    member = relationship("Member", back_populates="user_detail")


class UserHopeJob(Base):
    __tablename__ = 'user_hope_job'
    
    job_id = Column(BigInteger, ForeignKey('job_sub_category.job_id'), primary_key=True)
    member_id = Column(BigInteger, ForeignKey('member.member_id'), primary_key=True)

    # 관계 설정
    member = relationship("Member", back_populates="hope_jobs")
    job = relationship("JobSubCategory", back_populates="hope_jobs")


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
    hope_jobs = relationship("UserHopeJob", back_populates="job")


class RefreshToken(Base):
    __tablename__ = 'refresh_token'
    
    refresh_token_id = Column(BigInteger, primary_key=True)
    value = Column(Text)

    # 관계 설정
    members = relationship("Member", back_populates="refresh_token")
