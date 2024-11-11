from sqlalchemy import select
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from utils.dependencies import get_current_member
from services import get_member_records, generate_questions
from database import get_db
from schemas import MemberInfoDTO, QuestionRequestDTO, QuestionDTO, QuestionResponseDTO
from models import Portfolio, Repository

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
    
@router.post("/genenrate-questions", response_model=QuestionResponseDTO)
async def create_interview_questions(
    request: QuestionRequestDTO,
    db: AsyncSession = Depends(get_db),
    member=Depends(get_current_member)
):
    # 포트폴리오, 레포지토리 요약 텍스트 조회
    portfolio_text = None
    repository_text = None

    if request.portfolio_id:
        result = await db.execute(select(Portfolio).filter(Portfolio.portfolio_id == request.portfolio_id))
        portfolio = result.scalars().first()
        if portfolio:
            portfolio_text = portfolio.portfolio_content
        else:
            raise HTTPException(status_code=404, detail="해당 포트폴리오를 찾을 수 없습니다.")
        
    if request.repository_id:
        result = await db.execute(select(Repository).filter(Repository.repository_id == request.repository_id))
        repository = result.scalars().first()
        if repository:
            repository_text = repository.repository_content
        else:
            raise HTTPException(status_code=404, detail="해당 리포지토리를 찾을 수 없습니다.")
        
    # 희망 직무 역할 이름 조회
    job_roles = [job.job.job_name for job in member.member_jobs if job.job_id in request.job_role_ids]
    if not job_roles:
        raise HTTPException(status_code=400, detail="유효한 직무 역할 ID가 필요합니다.")
    
    # 질문 생성 및 저장
    try:
        questions_data = await generate_questions(portfolio_text, repository_text, job_roles)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="질문 생성 중 오류가 발생했습니다.")

    # 응답 형식으로 변환
    response_questions = [
        QuestionDTO(
            question_tag=q["question_tag"],
            question_intent=q["question_intent"],
            question_text=q["question_text"],
            audio_s3_url=q["audio_s3_url"]
        ) for q in questions_data
    ]

    return QuestionResponseDTO(questions=response_questions)