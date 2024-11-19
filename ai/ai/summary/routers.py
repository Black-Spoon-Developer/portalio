from models import Portfolio, Repository
from sqlalchemy import select
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_db
from schemas import SummaryRequestDTO, SummaryResponseDTO
from services import generate_summary, save_portfolio_summary, save_repository_summary
from utils.dependencies import get_current_member  # 사용자 인증 함수

router = APIRouter()

@router.post("/generate-summary", response_model=SummaryResponseDTO)
async def create_summary(
    request: SummaryRequestDTO,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_member)
):
    try:
        # 텍스트 요약 생성
        summary_text = await generate_summary(request.content)

        # 유저가 소유한 포트폴리오 또는 레포지토리에 요약 저장
        if request.portfolio_id:
            portfolio = await db.execute(select(Portfolio).filter(Portfolio.portfolio_id == request.portfolio_id, Portfolio.member_id == current_user.member_id))
            if not portfolio:
                raise HTTPException(status_code=403, detail="해당 포트폴리오에 접근 권한이 없습니다.")
            await save_portfolio_summary(db, portfolio_id=request.portfolio_id, summary_text=summary_text)
        elif request.repository_id:
            repository = await db.execute(select(Repository).filter(Repository.repository_id == request.repository_id, Repository.member_id == current_user.member_id))
            if not repository:
                raise HTTPException(status_code=403, detail="해당 레포지토리에 접근 권한이 없습니다.")
            await save_repository_summary(db, repository_id=request.repository_id, summary_text=summary_text)
        else:
            raise HTTPException(status_code=400, detail="포트폴리오 ID 또는 레포지토리 ID가 필요합니다.")
        
        # 응답 반환
        return SummaryResponseDTO(summary_text=summary_text)

    except ValueError as ve:
        raise HTTPException(status_code=404, detail=str(ve))
    except Exception:
        raise HTTPException(status_code=500, detail="요약 생성 중 오류 발생")
