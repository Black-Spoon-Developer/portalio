from datetime import datetime
from typing import List, Optional
import math
import logging

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy import literal, select, and_, func
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_async_db
from models import InterviewLog, Member, UserDetail, Interview
from utils.dependencies import get_current_member

# 로거 설정
logger = logging.getLogger(__name__)

# Response DTOs
class InterviewLogResponse(BaseModel):
    interview_log_id: int
    interview_id: int
    user_nickname: Optional[str] = None
    member_picture: Optional[str] = None
    interview_count: Optional[int] = None
    ticket_count: Optional[int] = None
    created_at: datetime
    portfolio_title: Optional[str] = None
    repository_title: Optional[str] = None
    select_job: str
    interview_type: Optional[str] = None
    interview_grade: Optional[str] = None

    class Config:
        from_attributes = True

# Request 스키마
class PaginationRequest(BaseModel):
    skip: int = Field(ge=0, default=0)
    limit: int = Field(ge=1, le=50, default=10)

class PaginatedResponse(BaseModel):
    total: int
    items: List[InterviewLogResponse]

router = APIRouter()
# 향후 리팩토링으로 schemas, router, services로 분기
@router.post("/reports", response_model=PaginatedResponse)
async def get_interview_logs(
    pagination: PaginationRequest,
    db: AsyncSession = Depends(get_async_db),
    member: Member = Depends(get_current_member)
):
    """회원의 인터뷰 기록을 조회합니다."""
    try:
        # 전체 개수 조회
        total = await db.execute(
            select(func.count())
            .select_from(InterviewLog)
            .where(InterviewLog.member_id == member.member_id)
        )
        total_count = total.scalar_one()

        # interview_count 계산
        interview_count = await db.scalar(
            select(func.count(Interview.interview_id))
            .where(
                and_(
                    Interview.member_id == member.member_id,
                    Interview.interview_type != 'undefined'
                )
            )
        ) or 0

        # 메인 쿼리
        query = (
            select(
                InterviewLog.interview_log_id,
                InterviewLog.interview_id,
                InterviewLog.created_at,
                InterviewLog.portfolio_title,
                InterviewLog.repository_title,
                InterviewLog.select_job,
                InterviewLog.interview_type,
                InterviewLog.interview_grade,
                func.coalesce(UserDetail.user_nickname, '사용자').label('user_nickname'),
                Member.member_picture,
                func.coalesce(UserDetail.user_ticket, 0).label('ticket_count'),
                literal(interview_count).label('interview_count')
            )
            .select_from(InterviewLog)
            .join(Member, InterviewLog.member_id == Member.member_id)
            .outerjoin(UserDetail, Member.member_id == UserDetail.member_id)
            .where(InterviewLog.member_id == member.member_id)
            .order_by(InterviewLog.created_at.desc())
            .offset(pagination.skip)
            .limit(pagination.limit)
        )

        result = await db.execute(query)
        rows = result.mappings().all()
        
        logger.info(f"Found {len(rows)} rows")
        if rows:
            logger.info(f"Sample row: {dict(rows[0])}")

        items = [
            InterviewLogResponse(
                interview_log_id=row['interview_log_id'],
                interview_id=row['interview_id'],
                user_nickname=row['user_nickname'],
                member_picture=row['member_picture'],
                interview_count=row['interview_count'],
                ticket_count=row['ticket_count'],
                created_at=row['created_at'],
                portfolio_title=row['portfolio_title'],
                repository_title=row['repository_title'],
                select_job=row['select_job'],
                interview_type=row['interview_type'],
                interview_grade=row['interview_grade']
            )
            for row in rows
        ]

        return PaginatedResponse(
            total=total_count,
            items=items
        )

    except Exception as e:
        logger.error(f"Failed to fetch interview logs: {str(e)}")
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
    
