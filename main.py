from fastapi import FastAPI

from ai.question.service import router as question_router
from ai.question.services import router as questions_router
from ai.question.feedback import router as feedback_router
from ai.spelling.grammar import router as grammar_router
from ai.question.interview import router as interview_router

app = FastAPI()

app.include_router(questions_router, prefix="/api/v1", tags=["ai"])
app.include_router(interview_router, prefix="/api/v1", tags=["ai"])