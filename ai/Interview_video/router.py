from fastapi import APIRouter, File, UploadFile
from .service import upload_and_analyze_video, get_analysis, get_question_analysis

router = APIRouter()

@router.post("/upload-video/{interview_id}/{question_id}")
async def upload_video(interview_id: int, question_id: int, file: UploadFile = File(...)):
    return await upload_and_analyze_video(interview_id, question_id, file)

@router.get("/analysis/{interview_id}")
async def get_interview_analysis(interview_id: int):
    return await get_analysis(interview_id)

@router.get("/analysis/{interview_id}/{question_id}")
async def get_question_analysis_route(interview_id: int, question_id: int):
    return await get_question_analysis(interview_id, question_id)