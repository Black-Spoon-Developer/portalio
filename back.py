# database.py
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession

from utils.config import ai_settings

DATABASE_URL = f"mysql+pymysql://{ai_settings.AI_DATABASE_USER}:{ai_settings.AI_DATABASE_PASSWORD}@{ai_settings.AI_DATABASE_HOST}:{ai_settings.AI_DATABASE_PORT}/{ai_settings.AI_DATABASE_NAME}"

engine = create_engine(DATABASE_URL, echo=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def get_async_db():
    async with AsyncSession(engine) as session:
        try:
            yield session
        finally:
            await session.close()


def init_db():
    Base.metadata.create_all(bind=engine)