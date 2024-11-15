from io import BytesIO
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from models import PortfolioSummary, RepositorySummary, Portfolio, Repository
import openai
import os
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

# 텍스트 요약 생성 함수
async def generate_summary(content: str) -> str:
    prompt = f"""
    다음 텍스트는 사용자의 포트폴리오(또는 레포지토리)입니다. 이 내용을 요약할 때 아래 사항을 고려하여 요약해 주세요.
    
    1. 항목 번호가 있을 경우 이를 유지합니다.
    2. 직무와 관련된 핵심 용어나 기술 용어를 유지하며, 가능하면 전문성을 드러낼 수 있도록 합니다.
    3. 사용자의 중요한 프로젝트나 성과, 이력에서 두드러지는 경험을 중심으로 요약합니다.
    4. 기술 역량, 도전 과제 해결 사례, 성취한 목표 등을 포함해 주세요.
    5. 많이 언급된 중요한 단어나 핵심 키워드를 요약 마지막에 추가하여 별도로 나열해 주세요.

    내용:
    {content}
    """

    response = openai.Completion.create(
        model="gpt-4o-mini",
        prompt=prompt,
        max_tokens=150,
        temperature=0.3,
    )
    return response.choices[0].text.strip()

# 포트폴리오 요약 저장 함수
async def save_portfolio_summary(db: AsyncSession, portfolio_id: int, summary_text: str):
    result = await db.execute(select(Portfolio).filter(Portfolio.portfolio_id == portfolio_id))
    portfolio = result.scalars().first()

    if not portfolio:
        raise ValueError("해당 포트폴리오가 존재하지 않습니다.")

    # 요약 저장
    if portfolio.summary:
        portfolio.summary.summary_text = summary_text
    else:
        portfolio.summary = PortfolioSummary(
            portfolio_id=portfolio_id,
            summary_text=summary_text
        )
    await db.commit()

# 레포지토리 요약 저장 함수
async def save_repository_summary(db: AsyncSession, repository_id: int, summary_text: str):
    result = await db.execute(select(Repository).filter(Repository.repository_id == repository_id))
    repository = result.scalars().first()

    if not repository:
        raise ValueError("해당 레포지토리가 존재하지 않습니다.")

    # 요약 저장
    if repository.summary:
        repository.summary.summary_text = summary_text
    else:
        repository.summary = RepositorySummary(
            repository_id=repository_id,
            summary_text=summary_text
        )
    await db.commit()