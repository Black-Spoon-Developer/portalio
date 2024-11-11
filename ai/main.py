from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

from question.service import router as question_router
from question.services import router as questions_router
from question.feedback import router as feedback_router
from spelling.grammar import router as grammar_router
from question.interview import router as interview_router
from spelling.test import router as spelling_router

app = FastAPI()

# app.add_middleware(SessionMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# app.include_router(questions_router, prefix="/api/v1", tags=["ai"])
app.include_router(interview_router, prefix="/api/v1", tags=["ai"])
# app.include_router(spelling_router, prefix="/api/v1", tags=["ai"])

@app.get("/")
async def read_root(request: Request):
    return {"message": "Hello"}