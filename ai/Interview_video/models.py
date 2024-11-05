from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class AnalysisResult(Base):
    __tablename__ = "analysis_results"

    id = Column(Integer, primary_key=True, index=True)
    interview_id = Column(Integer)
    question_id = Column(Integer)
    emotion = Column(String)
    movement_focus_score = Column(Float)
    gaze_focus_score = Column(Float)
    s3_key = Column(String)