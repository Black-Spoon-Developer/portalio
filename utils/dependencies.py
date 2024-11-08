from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from utils.config import security_settings
from models import Member
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
    