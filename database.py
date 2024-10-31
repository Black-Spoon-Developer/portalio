# sqlalchemy setting
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# env setting
from utils.config import ai_settings

DATABASE_URL = f"mysql+pymysql://{ai_settings.AI_DATABASE_USER}:{ai_settings.AI_DATABASE_PASSWORD}@{ai_settings.AI_DATABASE_HOST}:{ai_settings.AI_DATABASE_PORT}/{ai_settings.AI_DATABASE_NAME}"

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()

Base.metadata.create_all(bind=engine)