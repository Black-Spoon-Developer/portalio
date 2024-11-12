from sqlalchemy import select
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from utils.dependencies import get_current_member
from services import get_member_records, generate_and_save_questions, save_text_answer_and_feedback
from database import get_db
from schemas import AnswerRequestDTO, MemberInfoDTO, QuestionRequestDTO, QuestionDTO, QuestionResponseDTO
from models import Portfolio, Repository, Interview

router = APIRouter()

@router.post("/pre-interview", response_model=MemberInfoDTO)
async def pre_interview(
    token: str,
    db: AsyncSession = Depends(get_db)
):
    try:
        # 토큰을 기반으로 현재 사용자 정보 조회
        current_member = await get_current_member(token=token, db=db)

        # Interview ID 생성
        new_interview = Interview(member_id=current_member.member_id, interview_type="text")  # 기본 interview_type 설정
        db.add(new_interview)
        await db.flush()  # interview_id를 생성하고 반환하기 위해 flush 사용
        interview_id = new_interview.interview_id

        # member_id를 이용해 기록 조회
        member_records = await get_member_records(db=db, member_id=current_member.member_id)
        member_records.interview_id = interview_id  # 인터뷰 ID 포함

        return member_records
    
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="멤버 기록 실패"
        )

@router.post("/generate-questions", response_model=QuestionResponseDTO)
async def create_interview_questions(
    request: QuestionRequestDTO,
    db: AsyncSession = Depends(get_db),
    member=Depends(get_current_member)
):
    # 포트폴리오, 리포지토리 텍스트 조회
    portfolio_text, repository_text = None, None

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
        
    # 질문 생성 및 저장
    try:
        questions_data = await generate_and_save_questions(db, request.interview_id, portfolio_text, repository_text, request.job_roles)
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


@router.post("/mock-interview/{interview_type}/submit-answer")
async def submit_answer(
    interview_type: str,
    request: AnswerRequestDTO,
    db: AsyncSession = Depends(get_db),
    member=Depends(get_current_member)
):
    # 인터뷰 타입 검증 및 분기 처리
    if interview_type == "text":
        # 텍스트 인터뷰용 답변 저장 및 피드백 로직
        answer, feedback = await save_text_answer_and_feedback(
            db=db,
            question_id=request.question_id,
            member_id=member.member_id,
            answer_text=request.content
        )
    else:
        raise HTTPException(status_code=400, detail="유효하지 않은 인터뷰 타입입니다.")
    
    # 응답 반환
    return {
        "answer_id": answer.answer_id,
        "feedback": feedback.feedback_text
    }






