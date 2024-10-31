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


ai_settings = AI_Settings()