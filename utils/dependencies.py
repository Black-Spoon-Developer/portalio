from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models import Member
from utils.config import security_settings
from jose import JWTError, jwt


def get_current_member(token: str, db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(
            token,
            security_settings.SECRET_KEY,
            algorithms=[security_settings.ALGORITHM]
        )
        member_id = payload.get("member_id")
        
        if member_id is None:
            raise HTTPException(status_code=401, detail="Invalid token - member_id not found")
        member = get_member_by_id(member_id, db)
        return member

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

def get_member_by_id(member_id: int, db: Session):
    member = db.query(Member).filter(Member.member_id == member_id).first()
    if member is None:
        raise HTTPException(status_code=401, detail="User not found")
    return member
