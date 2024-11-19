from datetime import datetime
import json
import logging
import os
from pathlib import Path
import subprocess
import tempfile
from typing import Optional, Union
from ai.mock_interview.audio_analyze import AudioAnalyzer
# from ai.mock_interview.v2 import V2VideoAnalyzer
from ai.mock_interview.video_analyze import VideoAnalyzer
from fastapi.security import APIKeyHeader, HTTPAuthorizationCredentials
import numpy as np
from sqlalchemy import and_, select
from fastapi import APIRouter, Depends, File, Form, HTTPException, Header, Request, Security, UploadFile, logger, security, status
from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession
from utils.dependencies import get_current_member, APIKeyHeader
from ai.mock_interview.services import (
    convert_audio_to_text,
    get_member_records, 
    generate_and_save_questions, 
    save_text_answer_and_feedback, 
    create_interview, 
    save_audio_answer_and_feedback,
    create_interview_set_defaults,
    save_video_answer_and_feedback
)
from database import get_async_db  # async 버전의 DB 의존성 사용
from ai.mock_interview.schemas import (
    AnswerResponseDTO, 
    MemberInfoDTO, 
    QuestionRequestDTO, 
    QuestionDTO, 
    QuestionResponseDTO,
    TextAnswerRequest,
    AudioAnswerRequest,
    VideoAnswerRequest,
    VideoAnswerResponse
)
from models import InterviewLog, Member, Portfolio, Question, Repository, Interview, InterviewType

router = APIRouter()

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@router.post("/pre-interview", response_model=MemberInfoDTO)
async def pre_interview(
    db: AsyncSession = Depends(get_async_db),
    member: Member = Depends(get_current_member)
):
    """사전 인터뷰 정보를 조회합니다."""
    try:
        # 테스트를 위해 member_id를 2로 고정
        # member_id = 2

        # 멤버 기록 조회
        member_records = await get_member_records(db=db, member_id=member.member_id)
        
        # 결과 반환
        return member_records
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"message": "사전 인터뷰 정보 조회 실패", "error": str(e)}
        )

@router.post("/generate-questions", response_model=QuestionResponseDTO)
async def create_interview_questions(
    request: QuestionRequestDTO,
    db: AsyncSession = Depends(get_async_db),
    member: Member = Depends(get_current_member)
):
    """인터뷰 질문을 생성합니다."""
    try:
        logger.info(f"Starting question generation for member_id: {member.member_id}")

        interview_id = await create_interview_set_defaults(member.member_id, db)
        logger.info(f"Created new interview with ID: {interview_id}")

        # 포트폴리오/레포지토리 텍스트 조회
        portfolio_text = None
        repository_text = None
        portfolio_title = None
        repository_title = None

        if request.portfolio_id:
            result = await db.execute(
                select(Portfolio.portfolio_content, Portfolio.portfolio_title)
                .where(Portfolio.portfolio_id == request.portfolio_id)
            )
            portfolio_text, portfolio_title = result.one_or_none() or (None, None)
            logger.info(f"Retrieved portfolio content: {'Found' if portfolio_text else 'Not found'}")

        if request.repository_id:
            result = await db.execute(
                select(Repository.repository_content, Repository.repository_title)
                .where(Repository.repository_id == request.repository_id)
            )
            repository_text, repository_title = result.one_or_none()
            logger.info(f"Retrieved repository content: {'Found' if repository_text else 'Not found'}")

        response_data = await generate_and_save_questions(
            db=db,
            interview_id=interview_id,
            portfolio_text=portfolio_text,
            repository_text=repository_text,
            portfolio_id=request.portfolio_id,
            repository_id=request.repository_id,
            job_roles=request.job_roles
        )

        # 응답 데이터 검증
        if not response_data.get('questions'):
            logger.error("No questions generated in response data")
            raise ValueError("No questions were generated")

        for q in response_data['questions']:
            if 'question_id' not in q:
                logger.error(f"Missing question_id in question: {q}")
                raise ValueError("Question ID missing in response")

        interview_log = InterviewLog(
            member_id=member.member_id,
            interview_id=interview_id,
            portfolio_title=portfolio_title,
            repository_title=repository_title,
            select_job=", ".join(request.job_roles),  # job_roles를 문자열로 변환
            created_at=datetime.utcnow()
        )
        
        db.add(interview_log)
        await db.commit()
        logger.info(f"Created interview log for interview_id: {interview_id}")


        logger.info("Successfully generated all questions")
        return response_data

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to create interview questions: {str(e)}", exc_info=True)
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"message": "질문 생성 실패", "error": str(e)}
        )

@router.post("/text/submit-answer", response_model=AnswerResponseDTO)
async def submit_text_answer(
    request: TextAnswerRequest,
    db: AsyncSession = Depends(get_async_db),
    member: Member = Depends(get_current_member)
):
    """텍스트 답변을 제출하고 피드백을 생성합니다."""
    try:
        # member_id = 2

        # 질문과 인터뷰 정보 함께 조회 -> 
        result = await db.execute(
            select(Question, Interview)
            .join(Interview)
            .where(
                and_(
                    Question.question_id == request.question_id,
                    Interview.interview_id == request.interview_id,
                    Interview.member_id == member.member_id
                )
            )
        )
        query_result = result.first()
        
        if not query_result:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="질문을 찾을 수 없거나 권한이 없습니다."
            )
        
        question, interview = query_result

        # 인터뷰 타입 업데이트
        interview.interview_type = InterviewType.text.value
        await db.flush()

        # 컨텍스트 조회
        context_text = ""
        if request.portfolio_id:
            portfolio_result = await db.execute(
                select(Portfolio.portfolio_content)
                .where(
                    and_(
                        Portfolio.portfolio_id == request.portfolio_id,
                        Portfolio.member_id == member.member_id
                    )
                )
            )
            context_text = portfolio_result.scalar_one_or_none() or ""
        elif request.repository_id:
            repository_result = await db.execute(
                select(Repository.repository_content)
                .where(
                    and_(
                        Repository.repository_id == request.repository_id,
                        Repository.member_id == member.member_id
                    )
                )
            )
            context_text = repository_result.scalar_one_or_none() or ""

        response = await save_text_answer_and_feedback(
            db=db,
            question_id=request.question_id,
            member_id=member.member_id,
            answer_text=request.answer_text,
            question=question.content,
            question_tag=question.question_tag,
            question_intent=question.question_intent,
            context_text=context_text
        )
        return response

    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"message": "텍스트 답변 제출 실패", "error": str(e)}
        )
 
@router.post("/audio/submit-answer", response_model=AnswerResponseDTO)
async def submit_audio_answer(
    request: str = Form(...),
    audio_file: UploadFile = File(...),
    db: AsyncSession = Depends(get_async_db),
    member: Member = Depends(get_current_member)
):
    try:
        request_data = AudioAnswerRequest(**json.loads(request))
        
        # 질문 및 인터뷰 데이터베이스 조회
        result = await db.execute(
            select(Question, Interview)
            .join(Interview)
            .where(
                and_(
                    Question.question_id == request_data.question_id,
                    Interview.interview_id == request_data.interview_id,
                    Interview.member_id == member.member_id
                )
            )
        )
        query_result = result.first()

        if not query_result:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="질문을 찾을 수 없거나 권한이 없습니다."
            )

        question, interview = query_result
        interview.interview_type = InterviewType.audio.value
        await db.flush()

        # 컨텍스트 조회
        context_text = ""
        if request_data.portfolio_id:
            portfolio_result = await db.execute(
                select(Portfolio.portfolio_content)
                .where(
                    and_(
                        Portfolio.portfolio_id == request_data.portfolio_id,
                        Portfolio.member_id == member.member_id
                    )
                )
            )
            context_text = portfolio_result.scalar_one_or_none() or ""
        elif request_data.repository_id:
            repository_result = await db.execute(
                select(Repository.repository_content)
                .where(
                    and_(
                        Repository.repository_id == request_data.repository_id,
                        Repository.member_id == member.member_id
                    )
                )
            )
            context_text = repository_result.scalar_one_or_none() or ""

        # 음성 파일 읽기
        audio_content = await audio_file.read()

        # save_audio_answer_and_feedback 호출
        response = await save_audio_answer_and_feedback(
            db=db,
            question_id=request_data.question_id,
            member_id=member.member_id,
            audio_content=audio_content,
            question=question.content,
            question_intent=question.question_intent,
            question_tag=question.question_tag,  # 추가
            context_text=context_text,
        )
        
        return response

    except json.JSONDecodeError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid JSON format in request parameter"
        )
    except HTTPException as e:
        raise e
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"message": "음성 답변 제출 실패", "error": str(e)}
        )

    
@router.post("/video/submit-answer", response_model=VideoAnswerResponse)
async def submit_video_answer(
    request: str = Form(...),
    video_file: UploadFile = File(...),
    audio_file: UploadFile = File(...),
    db: AsyncSession = Depends(get_async_db),
    member: Member = Depends(get_current_member)
):
    try:
        request_data = VideoAnswerRequest(**json.loads(request))
        
        result = await db.execute(
            select(Question, Interview)
            .join(Interview)
            .where(
                and_(
                    Question.question_id == request_data.question_id,
                    Interview.interview_id == request_data.interview_id,
                    Interview.member_id == member.member_id
                )
            )
        )
        query_result = result.first()

        if not query_result:
            raise HTTPException(status_code=404, detail="질문을 찾을 수 없거나 권한이 없습니다.")

        question, interview = query_result
        interview.interview_type = InterviewType.video.value
        await db.flush()

        # 컨텍스트 조회
        context_text = ""
        if request_data.portfolio_id:
            portfolio_result = await db.execute(
                select(Portfolio.portfolio_content)
                .where(
                    and_(
                        Portfolio.portfolio_id == request_data.portfolio_id,
                        Portfolio.member_id == member.member_id
                    )
                )
            )
            context_text = portfolio_result.scalar_one_or_none() or ""
        elif request_data.repository_id:
            repository_result = await db.execute(
                select(Repository.repository_content)
                .where(
                    and_(
                        Repository.repository_id == request_data.repository_id,
                        Repository.member_id == member.member_id
                    )
                )
            )
            context_text = repository_result.scalar_one_or_none() or ""

        video_content = await video_file.read()
        audio_content = await audio_file.read()
        
        return await save_video_answer_and_feedback(
            db=db,
            question_id=request_data.question_id,
            member_id=member.member_id,
            video_content=video_content,
            audio_content=audio_content,
            question=question.content,
            question_intent=question.question_intent,
            question_tag=question.question_tag,
            context_text=context_text
        )

    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
