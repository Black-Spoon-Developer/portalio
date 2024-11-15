from typing import Optional

from fastapi.security import APIKeyHeader, HTTPAuthorizationCredentials
from sqlalchemy import select
from fastapi import APIRouter, Depends, File, HTTPException, Header, Request, Security, UploadFile, security, status
from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession
from utils.dependencies import get_current_member
from ai.mock_interview.services import (
    get_member_records, 
    generate_and_save_questions, 
    save_text_answer_and_feedback, 
    create_interview, 
    save_audio_answer_and_feedback,
    create_interview_set_defaults
)
from database import get_db
from ai.mock_interview.schemas import (
    AnswerRequestDTO, 
    AnswerResponseDTO, 
    MemberInfoDTO, 
    QuestionRequestDTO, 
    QuestionDTO, 
    QuestionResponseDTO
)
from models import Member, Portfolio, Repository, Interview

router = APIRouter()

# @router.post("/pre-interview", response_model=MemberInfoDTO)
# async def pre_interview(
#     db: Session = Depends(get_db),
#     current_member: dict = Security(get_current_member)  # Security로 변경
# ):
#     try:
#         # current_member가 None인지 확인하는 디버깅 코드 추가
#         if not current_member:
#             raise HTTPException(
#                 status_code=status.HTTP_401_UNAUTHORIZED,
#                 detail="Authorization failed: Member not found"
#             )

#         # 정상적인 member_id 확인
#         interview_id = create_interview(current_member["member_id"], db)
#         member_records = get_member_records(db=db, member_id=current_member["member_id"])
        
#         return member_records.dict()
        
#     except Exception as e:
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=str(e)
#         )

@router.post("/pre-interview", response_model=MemberInfoDTO)
async def pre_interview(
    db: Session = Depends(get_db),
    # member=Depends(get_current_member)
):
    try:
        # 테스트를 위해 member_id를 2로 고정
        member_id = 2

        # 고정된 member_id로 인터뷰 생성 및 멤버 기록 조회
        member_records = get_member_records(db=db, member_id=member_id)
        
        # 결과 반환
        return member_records
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.post("/generate-questions", response_model=None)  # response_model을 None으로 유지
async def create_interview_questions(
    request: QuestionRequestDTO,
    db: AsyncSession = Depends(get_db),
    # member: Member = Depends(get_current_member)
    member_id: int = 2
):
    try:
        interview_id = create_interview_set_defaults(member_id, db)

        portfolio_text = None, 
        repository_text = None

        if request.portfolio_id:
            portfolio = db.query(Portfolio).filter(Portfolio.portfolio_id == request.portfolio_id).first()
            portfolio_text = portfolio.portfolio_content if portfolio else None

        if request.repository_id:
            repository = db.query(Repository).filter(Repository.repository_id == request.repository_id).first()
            repository_text = repository.repository_content if repository else None
        
        questions_data = await generate_and_save_questions(
            db=db,
            interview_id=interview_id,
            portfolio_text=portfolio_text,  
            repository_text=repository_text,
            job_roles=request.job_roles
        )
        # 일단은 commit 보류 - 아무리 생각해도 question, answer 분리
        await db.commit()
        # 딕셔너리로 명시적 변환하여 반환
        return QuestionResponseDTO(questions=questions_data)
    
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"질문 생성 중 오류 발생: {str(e)}")

@router.post("/{interview_type}/submit-answer", response_model=None)
async def submit_answer(
   interview_type: str,
   request: AnswerRequestDTO,
   db: Session = Depends(get_db),
#    member : Member = Depends(get_current_member),
):
    try:
        member_id = 2
        interview = db.query(Interview).filter(Interview.interview_id == request.interview_id).first()
        if interview:
            interview.interview_type == interview_type
            db.flush()

        if interview_type == "text":
            response = await save_text_answer_and_feedback(
                db=db,
                question_id=request.question_id,
                member_id=member_id,
                # member_id=member.member_id,
                answer_text=request.answer_text,
                question=request.question,
                question_intent=request.question_intent,
                context_text=request.context_text
            )
            return response.dict()
        # elif interview_type == "audio":
        #     if not file:
        #         raise HTTPException(status_code=400, detail="오디오 파일이 필요합니다.")
        #     audio_content = file.file.read()
            
        #     response = save_audio_answer_and_feedback(
        #         db=db,
        #         question_id=request.question_id,
        #         member_id=member_id,
        #         # member_id=member.member_id,
        #         audio_content=audio_content,
        #         question=request.question,
        #         question_intent=request.question_intent,
        #         context_text=request.context_text
        #     )
        #     return response.dict()
        # else:
        #     raise HTTPException(status_code=400, detail="유효하지 않은 인터뷰 타입입니다.")
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"답변 제출 중 오류 발생: {str(e)}"
        )
    

@router.post("/{interview_type}/submit-answer", response_model=AnswerResponseDTO)
async def submit_answer(
    interview_type: str,
    request: Union[TextAnswerRequest, AudioAnswerRequest] = Depends(),
    audio_file: Optional[UploadFile] = None,
    db: AsyncSession = Depends(get_async_db),
    # member: Member = Depends(get_current_member)
):
    """답변을 제출하고 피드백을 생성합니다."""
    try:
        member_id = 2

        # 인터뷰 타입 업데이트
        interview = await db.execute(
            select(Interview).where(Interview.interview_id == request.interview_id)
        )
        interview = interview.scalar_one_or_none()
        
        if interview:
            interview.interview_type = InterviewType[interview_type].value
            await db.flush()

        if interview_type == "text":
            response = await save_text_answer_and_feedback(
                db=db,
                question_id=request.question_id,
                member_id=member_id,
                answer_text=request.answer_text,
                question=request.question,
                question_intent=request.question_intent,
                context_text=request.context_text
            )
            return response
        elif interview_type == "audio":
            if not request.audio_file:  # audio_file은 스키마에 추가 필요
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST, 
                    detail="오디오 파일이 필요합니다."
                )
            
            response = await save_audio_answer_and_feedback(
                db=db,
                question_id=request.question_id,
                member_id=member_id,
                audio_content=await request.audio_file.read(),
                question=request.question,
                question_intent=request.question_intent,
                context_text=request.context_text
            )
            return response
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="지원하지 않는 인터뷰 타입입니다."
            )

    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"message": "답변 제출 실패", "error": str(e)}
        )