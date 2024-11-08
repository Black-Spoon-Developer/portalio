# sqlalchemy setting
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# env setting
from utils.config import ai_settings

DATABASE_URL = f"mysql+pymysql://{ai_settings.AI_DATABASE_USER}:{ai_settings.AI_DATABASE_PASSWORD}@{ai_settings.AI_DATABASE_HOST}:{ai_settings.AI_DATABASE_PORT}/{ai_settings.AI_DATABASE_NAME}"

engine = create_async_engine(DATABASE_URL, echo=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine, class_=AsyncSession)

Base = declarative_base()

async def get_db():
    async with SessionLocal() as session:
        yield session

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)