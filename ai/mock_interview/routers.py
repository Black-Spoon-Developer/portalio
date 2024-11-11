from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from utils.dependencies import get_current_member
from services import get_member_records
from database import get_db
from schemas import MemberInfoDTO
from services import analyze_video, analyze_audio
from services import upload_file_to_s3
from schemas import AnalysisResult

router = APIRouter()

## 분석결과
analysis_results = {}

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

## 면접부분 router

@router.post("/start-interview")
async def start_interview():
    return {"interview_id": 1, "questions": [
        "자기소개를 해주세요.",
        "지원 동기는 무엇인가요?",
        "본인의 장점과 단점은 무엇인가요?",
        "5년 후 자신의 모습을 어떻게 그리고 있나요?",
        "마지막으로 하고 싶은 말씀이 있다면?"
    ]}

@router.post("/upload-video/{interview_id}/{question_id}")
async def upload_video(interview_id: int, question_id: int, file: UploadFile = File(...)):
    video_path = f"temp_{interview_id}_{question_id}.mp4"
    audio_path = f"temp_{interview_id}_{question_id}.wav"

    with open(video_path, "wb") as buffer:
        buffer.write(await file.read())

    analysis_result = await analyze_video(video_path)
    s3_key = f'{interview_id}/{question_id}.mp4'
    upload_file_to_s3(video_path, s3_key)

    audio_analysis_result = await analyze_audio(video_path, audio_path)

    if interview_id not in analysis_results:
        analysis_results[interview_id] = {}
    analysis_results[interview_id][question_id] = analysis_result

    return {
        "message": "Video uploaded and analyzed successfully",
        "s3_key": s3_key,
        "analysis_result": analysis_result,
        "audio_analysis_result": audio_analysis_result
    }

@router.get("/analysis/{interview_id}", response_model=AnalysisResult)
async def get_analysis(interview_id: int):
    if interview_id not in analysis_results:
        raise HTTPException(status_code=404, detail="Analysis not found for this interview")
    return analysis_results[interview_id]