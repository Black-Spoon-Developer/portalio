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

class Security_Settings:
    SECRET_KEY: str = os.getenv('SECRET_KEY')
    ALGORITHM: str = 'HS256'

ai_settings = AI_Settings()
security_settings = Security_Settings()