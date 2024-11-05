from dotenv import load_dotenv
from urllib.parse import quote_plus
import os

load_dotenv()

class AI_Settings:
    AI_DATABASE_USER: str = os.getenv("AI_DATABASE_USER")
    AI_DATABASE_PASSWORD: str = quote_plus(os.getenv("AI_DATABASE_PASSWORD"))
    AI_DATABASE_HOST: str = os.getenv('AI_DATABASE_HOST')
    AI_DATABASE_PORT: str = os.getenv('AI_DATABASE_PORT')
    AI_DATABASE_NAME: str = os.getenv('AI_DATABASE_NAME')
    AWS_ACCESS_KEY_ID: str = os.getenv('AWS_ACCESS_KEY_ID')
    AWS_SECRET_ACCESS_KEY: str = os.getenv('AWS_SECRET_ACCESS_KEY')
    AWS_REGION: str = os.getenv('AWS_REGION')
    S3_BUCKET_NAME: str = os.getenv('S3_BUCKET_NAME')
    EMOTION_MODEL_PATH: str = os.getenv('EMOTION_MODEL_PATH')
    FONT_PATH: str = os.getenv('FONT_PATH')

ai_settings = AI_Settings()