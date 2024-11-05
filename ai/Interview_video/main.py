from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from router import router as video_router

app = FastAPI()

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(video_router, prefix="/api/v1", tags=["video"])