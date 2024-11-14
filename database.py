from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from utils.config import ai_settings

# 동기식 데이터베이스 URL
SYNC_DATABASE_URL = f"mysql+pymysql://{ai_settings.AI_DATABASE_USER}:{ai_settings.AI_DATABASE_PASSWORD}@{ai_settings.AI_DATABASE_HOST}:{ai_settings.AI_DATABASE_PORT}/{ai_settings.AI_DATABASE_NAME}"

# 비동기식 데이터베이스 URL (aiomysql 사용)
ASYNC_DATABASE_URL = f"mysql+aiomysql://{ai_settings.AI_DATABASE_USER}:{ai_settings.AI_DATABASE_PASSWORD}@{ai_settings.AI_DATABASE_HOST}:{ai_settings.AI_DATABASE_PORT}/{ai_settings.AI_DATABASE_NAME}"

# 동기식 엔진
sync_engine = create_engine(
    SYNC_DATABASE_URL,
    echo=True,
    pool_size=5,
    max_overflow=10
)

# 비동기식 엔진
async_engine = create_async_engine(
    ASYNC_DATABASE_URL,
    echo=True,
    pool_size=5,
    max_overflow=10
)

# 동기식 세션 팩토리
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=sync_engine
)

# 비동기식 세션 팩토리
AsyncSessionLocal = async_sessionmaker(
    async_engine,
    class_=AsyncSession,
    expire_on_commit=False
)

Base = declarative_base()

def get_db():
    """동기식 데이터베이스 세션을 제공합니다."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def get_async_db():
    """비동기식 데이터베이스 세션을 제공합니다."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

def init_db():
    """데이터베이스 테이블을 초기화합니다."""
    Base.metadata.create_all(bind=sync_engine)