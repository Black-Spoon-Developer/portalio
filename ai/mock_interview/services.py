from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from models import Member, Portfolio, Repository, MemberJob, JobSubCategory
from schemas import MemberInfoDTO

async def get_member_records(db: AsyncSession, member_id: int) -> MemberInfoDTO:
    # 사용자 정보 조회
    result = await db.execute(select(Member).filter(Member.member_id == member_id))
    member = result.scalars().first()
    if not member:
        raise HTTPException(status_code=404, detail="유저 정보 없음")
    
    # 포트폴리오와 요약 정보 매핑
    portfolios = [
        {
            "portfolio_id": portfolio.portfolio_id,
            "portfolio_title": portfolio.portfolio_title,
            "portfolio_content": portfolio.portfolio_content,
            "portfolio_summary": portfolio.summary.summary_text if portfolio.summary else None
        }
        for portfolio in member.portfolios
    ]

    # 리포지토리와 요약 정보 매핑
    repositories = [
        {
            "repository_id": repo.repository_id,
            "repository_title": repo.repository_title,
            "repository_content": repo.repository_content,
            "repository_summary": repo.summary.summary_text if repo.summary else None
        }
        for repo in member.repositories
    ]

    # 희망 직무 정보 조회 및 매핑
    hope_jobs = [
        {
            "job_id": job.job_id,
            "job_name": job.job.job_name
        }
        for job in member.member_jobs
    ]

    return MemberInfoDTO(
        member_id=member.member_id,
        portfolios=portfolios,
        repositories=repositories,
        hope_jobs=hope_jobs
    )

