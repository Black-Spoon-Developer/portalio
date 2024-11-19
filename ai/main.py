from typing import List
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from ai.chatbot.routers import router as chatbot_router
from ai.checker.routers import router as checker_router
from ai.mock_interview.routers import router as mock_interview_router
from ai.report.report import router as report_router
from ai.report.interview_log import router as interview_log_router
from ai.report.job import router as job_router

app = FastAPI()

ALLOWED_ORIGINS: List[str] = [
    "https://k11d202.p.ssafy.io"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(checker_router, prefix="/api/v1", tags=["ai"])
app.include_router(chatbot_router, prefix="/api/v1", tags=["ai"])
app.include_router(mock_interview_router, prefix="/api/v1/mock-interview", tags=["ai-mock-interview"])
app.include_router(report_router, prefix="/api/v1/mock-interview", tags=["ai-mock-interview"])
app.include_router(interview_log_router, prefix="/api/v1/mock-interview", tags=["ai-mock-interview"])
app.include_router(job_router, prefix="/api/v1/job-opening", tags=["ai"])


@app.get("/")
async def read_root(request: Request):
    return {"message": "Hello"}