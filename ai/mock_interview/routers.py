from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from utils.dependencies import get_current_member
from services import get_member_records
from database import get_db
from schemas import MemberInfoDTO

router = APIRouter()

@router.post("/pre-interview", response_model=MemberInfoDTO)
async def pre_interview(
    # 토큰을 요청 본문 또는 헤더
    token: str,
    db: AsyncSession = Depends(get_db)
):
    try:
        # 토큰을 기반 현재 사용자 정보 조회
        current_member = await get_current_member(token=token, db=db)

        # member_id를 이용해 records 조회
        return await get_member_records(db=db, member_id=current_member.member_id)
    
    except HTTPException as e:
        raise e  # 이미 발생한 HTTP 예외는 그대로 전달
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="멤버 기록 실패"
        )
