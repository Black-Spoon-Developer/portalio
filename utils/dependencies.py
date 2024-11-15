from typing import Any, Dict

from fastapi.security import APIKeyHeader
from database import get_db
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from utils.config import security_settings
from models import Member, UserDetail
from jose import jwt, JWTError

class DependencyError(Exception):
    pass


api_key_header = APIKeyHeader(name="Authorization", auto_error=False)

def get_current_member(
    token: str = Depends(api_key_header),  # APIKeyHeader를 통해 Authorization 헤더에서 토큰을 가져옵니다
    db: Session = Depends(get_db)
) -> Dict[str, Any]:  # Member 대신 Dict 반환
    if token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header missing"
        )
    
    try:
        payload = jwt.decode(
            token,
            security_settings.SECRET_KEY,
            algorithms=[security_settings.ALGORITHM]
        )
        member_id = payload.get("member_id")
        print(f"Decoded member_id: {member_id}")
        
        if member_id is None:
            raise HTTPException(status_code=401, detail="멤버가 없습니다.")
    
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="토큰 검증 오류"
        )
    
    member = db.query(Member).filter(Member.member_id == member_id).first()

    if member is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="멤버 없음"
        )
    
    return {
        "member_id": member.member_id,
        # 필요한 다른 필드들도 추가
    }
    
def verify_user_ticket(
    member_id: int, 
    min_ticket: int = 1, 
    db: Session = Depends(get_db)
) -> Dict[str, Any]:  # UserDetail 대신 Dict 반환
    user_detail = db.query(UserDetail).filter(UserDetail.member_id == member_id).first()

    if not user_detail or user_detail.user_ticket <= min_ticket:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"티켓이 부족하여 면접을 진행할 수 없습니다. 최소 {min_ticket}개의 티켓이 필요합니다."
        )
    
    return {
        "member_id": user_detail.member_id,
        "user_ticket": user_detail.user_ticket
    }