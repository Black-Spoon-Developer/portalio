from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

# from ai.chatbot.routers import router as chatbot_router
from ai.checker.routers import router as checker_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(checker_router, prefix="/api/v1", tags=["ai"])

@app.get("/")
async def read_root(request: Request):
    return {"message": "Hello"}