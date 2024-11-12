from database import get_db
from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from utils.config import security_settings
from models import Member, UserDetail
from jose import jwt, JWTError

async def get_current_member(token: str, db: AsyncSession):
    try:
        payload = jwt.decode(
            token,
            security_settings.SECRET_KEY,
            algorithms=[security_settings.ALGORITHM]
        )
        member_id = payload.get("member_id")
        
        if member_id is None:
            raise HTTPException(status_code=401, detail="멤버가 없습니다.")
    
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="토큰 검증 오류"
        )
    
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="서버 오류"
        )
    
    result = await db.execute(select(Member).filter(Member.member_id == member_id))
    member = result.scalars().first()

    if member is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="멤버 없음"
        )
    
    return member
    
async def verify_user_ticket(member_id: int, min_ticket: int = 1, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(UserDetail).filter(UserDetail.member_id == member_id))
    user_detail = result.scalars().first()

    if not user_detail or user_detail.user_ticket <= min_ticket:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"티켓이 부족하여 면접을 진행할 수 없습니다. 최소 {min_ticket}개의 티켓이 필요합니다."
        )
    return user_detail