from sqlalchemy.orm import Session
from models import Member, Portfolio, Repository
from schemas import PortfolioSelectDTO, MemberSelcetJobDTO


def get_member_activity(db: Session, member_id: int):
    pass