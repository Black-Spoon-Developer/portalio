from database import get_async_db
from fastapi import APIRouter, Depends, HTTPException
from models import Answer, Interview, InterviewLog, InterviewType, Member, Question, Report, QuestionTag
from sqlalchemy import and_, select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload
from typing import List, Optional, Dict, Any
from datetime import datetime
import json
from pydantic import BaseModel
import openai
from utils.dependencies import get_current_member
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

class VideoMetricsDTO(BaseModel):
    gaze: Dict[str, Any]
    movement: Dict[str, Any]
    emotion: Dict[str, Any]
    expert_analysis: Dict[str, Any]
    time_series: List[Dict[str, Any]]

class VideoAnswerDTO(BaseModel):
    content: str
    video_url: Optional[str]
    audio_url: Optional[str]
    feedback: Dict[str, Any]
    analysis: Dict[str, Any]

##########
class QuestionDTO(BaseModel):
    content: str
    question_intent: str
    question_tag: str

class TextAnswerDTO(BaseModel):
    content: str
    feedback: Dict[str, Any]

class AudioAnswerDTO(BaseModel):
    content: str
    audio_url: str
    feedback: Dict[str, Any]
    analysis: Dict[str, Any]

class ReportDTO(BaseModel):
    interview_id: int
    interview_type: str
    created_at: datetime
    questions: List[Dict[str, Any]]

async def analyze_video_behavior(time_series_data: str | List[Dict]) -> Dict[str, Any]:
    """상세 비디오 행동 분석"""
    try:
        # JSON 문자열 처리
        if isinstance(time_series_data, str):
            parsed_data = json.loads(time_series_data)
        else:
            parsed_data = time_series_data

        def decode_emotion(emotion_str: str) -> str:
            emotion_map = {
                "\\uc911\\ub9bd": "중립",
                "\\uae30\\uc068": "기쁨",
                "\\uc2ac\\ud514": "슬픔",
                "\\ud654\\ub0a8": "화남",
                "\\ub180\\ub78c": "놀람"
            }
            return emotion_map.get(emotion_str, emotion_str) if isinstance(emotion_str, str) else "중립"

        # 데이터 추출 및 검증
        gaze_data = []
        movement_data = []
        emotions = []
        processed_time_series = []

        for data in parsed_data:
            try:
                current_time = data.get('time', 0)
                gaze = float(data.get('gaze_focus', 0))
                movement = float(data.get('movement_focus', 0))
                emotion = decode_emotion(data.get('emotion', '중립'))

                gaze_data.append(gaze)
                movement_data.append(movement)
                emotions.append(emotion)

                # JSONL 형식을 위한 데이터 구조화
                processed_time_series.append(json.dumps({
                    "time": current_time,
                    "gaze_focus": gaze,
                    "movement_focus": movement,
                    "emotion": emotion
                }, ensure_ascii=False))

            except (ValueError, TypeError) as e:
                logger.error(f"Data processing error: {str(e)}")
                continue

        if not gaze_data or not movement_data or not emotions:
            raise ValueError("유효한 데이터가 없습니다")

        # 기준값 설정
        baseline = {
            "emotion": "중립",
            "movement": 50.0,
            "gaze": 50.0
        }

        # 분석 데이터 생성
        analysis_data = {
            "gaze": {
                "average": sum(gaze_data) / len(gaze_data),
                "stability": calculate_stability(gaze_data),
                "pattern": analyze_pattern(gaze_data, "gaze")
            },
            "movement": {
                "average": sum(movement_data) / len(movement_data),
                "stability": calculate_stability(movement_data),
                "pattern": analyze_pattern(movement_data, "movement")
            },
            "emotion": {
                "dominant": max(set(emotions), key=emotions.count),
                "changes": len(set(emotions)),
                "pattern": analyze_emotion_pattern(emotions)
            }
        }

        # GPT 분석
        prompt = f"""
        면접자의 비언어적 행동을 분석해주세요. 기준값과 비교하여 평가해주세요.

        기준값:
        - 시선 집중도: {baseline['gaze']}
        - 움직임 안정성: {baseline['movement']}
        - 기본 감정: {baseline['emotion']}

        현재 데이터:
        1. 시선 처리:
           - 평균: {analysis_data['gaze']['average']:.1f}
           - 안정성: {analysis_data['gaze']['stability']}/100
           - 패턴: {analysis_data['gaze']['pattern']}

        2. 자세/움직임:
           - 평균: {analysis_data['movement']['average']:.1f}
           - 안정성: {analysis_data['movement']['stability']}/100
           - 패턴: {analysis_data['movement']['pattern']}

        3. 감정 표현:
           - 주된 감정: {analysis_data['emotion']['dominant']}
           - 변화 횟수: {analysis_data['emotion']['changes']}
           - 패턴: {analysis_data['emotion']['pattern']}

        다음 네 가지 항목에 대해 각각 2-3문장으로 간단히 분석해주세요:
        1. 시선 처리 평가 (기준값 대비 평가 포함)
        2. 자세/움직임 평가 (기준값 대비 평가 포함)
        3. 감정 표현 평가
        4. 개선을 위한 구체적인 제안 2가지
        """

        try:
            response = await openai.ChatCompletion.acreate(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "면접 행동 분석 전문가입니다. 각 항목을 간단명료하게 분석합니다."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=300
            )
            analysis_sections = response.choices[0].message.content.split('\n\n')
        except Exception as e:
            logger.error(f"GPT API error: {str(e)}")
            analysis_sections = [
                "시선 처리 분석을 할 수 없습니다.",
                "자세/움직임 분석을 할 수 없습니다.",
                "감정 표현 분석을 할 수 없습니다.",
                "개선점을 제시할 수 없습니다."
            ]

        return {
            "metrics": {
                "gaze": {
                    "average": round(analysis_data['gaze']['average'], 2),
                    "stability": analysis_data['gaze']['stability'],
                    "pattern": analysis_data['gaze']['pattern'],
                    "baseline_comparison": round((analysis_data['gaze']['average'] - baseline['gaze']) / baseline['gaze'] * 100, 2)
                },
                "movement": {
                    "average": round(analysis_data['movement']['average'], 2),
                    "stability": analysis_data['movement']['stability'],
                    "pattern": analysis_data['movement']['pattern'],
                    "baseline_comparison": round((analysis_data['movement']['average'] - baseline['movement']) / baseline['movement'] * 100, 2)
                },
                "emotion": {
                    "dominant": analysis_data['emotion']['dominant'],
                    "changes": analysis_data['emotion']['changes'],
                    "pattern": analysis_data['emotion']['pattern'],
                    "matches_baseline": analysis_data['emotion']['dominant'] == baseline['emotion']
                }
            },
            "expert_analysis": {
                "gaze_feedback": analysis_sections[0].strip(),
                "movement_feedback": analysis_sections[1].strip(),
                "emotion_feedback": analysis_sections[2].strip(),
                "improvement_suggestions": analysis_sections[3].strip()
            },
            "time_series": processed_time_series  # JSONL 형식의 데이터
        }

    except Exception as e:
        logger.error(f"Video behavior analysis error: {str(e)}")
        return {
            "metrics": {
                "gaze": {"average": 0, "stability": 0, "pattern": "분석 불가", "baseline_comparison": 0},
                "movement": {"average": 0, "stability": 0, "pattern": "분석 불가", "baseline_comparison": 0},
                "emotion": {"dominant": "분석 불가", "changes": 0, "pattern": "분석 불가", "matches_baseline": False}
            },
            "expert_analysis": {
                "gaze_feedback": "분석 중 오류가 발생했습니다",
                "movement_feedback": "분석 중 오류가 발생했습니다",
                "emotion_feedback": "분석 중 오류가 발생했습니다",
                "improvement_suggestions": "시스템 오류로 인해 분석이 불가능합니다"
            },
            "time_series": []
        }

def calculate_stability(values: List[float]) -> float:
    """안정성 점수 계산"""
    if not values:
        return 0
    mean = sum(values) / len(values)
    variance = sum((x - mean) ** 2 for x in values) / len(values)
    std_dev = (variance ** 0.5)
    stability = max(0, min(100, 100 - (std_dev * 10)))
    return round(stability, 2)

def analyze_pattern(values: List[float], metric_type: str) -> str:
    """시계열 패턴 분석"""
    if not values:
        return "데이터 부족"
    
    variations = [abs(values[i] - values[i-1]) for i in range(1, len(values))]
    avg_variation = sum(variations) / len(variations) if variations else 0
    
    thresholds = {
        "gaze": {"stable": 3, "moderate": 7},
        "movement": {"stable": 5, "moderate": 10}
    }
    
    t = thresholds[metric_type]
    if avg_variation < t["stable"]:
        return "매우 안정적"
    elif avg_variation < t["moderate"]:
        return "안정적"
    else:
        return "불안정"

def analyze_emotion_pattern(emotions: List[str]) -> str:
    """감정 변화 패턴 분석"""
    if not emotions:
        return "데이터 부족"
        
    changes = sum(1 for i in range(1, len(emotions)) if emotions[i] != emotions[i-1])
    if changes == 0:
        return "일관된 감정"
    elif changes <= 2:
        return "안정적 감정"
    else:
        return "감정 변화 많음"

########
async def analyze_pronunciation_with_gpt(
    pronunciation_issues: str,
    word_timestamps: str
) -> Dict[str, Any]:
    """GPT를 활용한 간소화된 발음 분석"""
    try:
        issues = json.loads(pronunciation_issues) if pronunciation_issues else []
        timestamps = json.loads(word_timestamps) if word_timestamps else []
        
        if not issues or not timestamps:
            return {
                "expert_advice": [
                    "1. 분석할 발음 데이터가 불충분합니다.",
                    "2. 말하기 패턴을 파악할 수 없습니다.",
                    "3. 충분한 음성 데이터를 제공해주세요."
                ],
                "speaking_pattern": {"패턴": "분석 불가"}
            }

        # 중요 발음 문제 필터링
        significant_issues = []
        for issue in issues:
            if float(issue.get("confidence", 1.0)) < 0.3:  # 낮은 신뢰도의 발음만 선택
                significant_issues.append({
                    "word": issue.get("word", ""),
                    "suggestion": issue.get("suggestion", "")
                })

        # 말하기 패턴 분석
        speaking_patterns = analyze_speaking_pattern(timestamps)

        if not significant_issues:
            return {
                "expert_advice": [
                    "1. 전반적으로 발음이 명확하고 정확합니다.",
                    f"2. 말하기 패턴은 {speaking_patterns.get('seperation_speed', '보통')} 속도를 보입니다.",
                    "3. 현재의 발음 수준을 유지하면서 자신감 있게 답변하시면 좋겠습니다."
                ],
                "speaking_pattern": speaking_patterns
            }

        # GPT 분석 요청
        prompt = f"""
        다음 면접 답변의 발음을 분석하여 정확히 아래 형식의 3가지 항목으로 답변해주세요:

        분석할 데이터:
        1. 주요 발음 문제:
        {json.dumps(significant_issues[:3], ensure_ascii=False)}
        
        2. 말하기 패턴:
        {json.dumps(speaking_patterns, ensure_ascii=False)}

        다음 형식으로 정확히 3개의 문장으로 응답해주세요:
        [
            "1. [발음 교정] 가장 개선이 필요한 1-2개 단어와 그 이유",
            "2. [패턴 분석] 말하기 속도와 패턴의 특징",
            "3. [개선 제안] 발음과 말하기 개선을 위한 구체적인 방법"
        ]
        """

        try:
            response = await openai.ChatCompletion.acreate(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "발음 교정 전문가입니다. 정확히 3개의 문장으로 구성된 배열 형식으로 답변합니다."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=150
            )
            
            try:
                # 응답을 배열로 파싱 시도
                expert_advice = json.loads(response.choices[0].message.content)
                if not isinstance(expert_advice, list) or len(expert_advice) != 3:
                    raise ValueError("Invalid format")
            except:
                # 파싱 실패 시 텍스트를 줄바꿈으로 분리하여 배열 생성
                expert_advice = [
                    line.strip()
                    for line in response.choices[0].message.content.split('\n')
                    if line.strip() and line.strip().startswith(('1.', '2.', '3.'))
                ][:3]
                
                # 3개 항목 보장
                while len(expert_advice) < 3:
                    expert_advice.append(f"{len(expert_advice) + 1}. 추가 분석이 필요합니다.")

        except Exception as e:
            logger.error(f"GPT API error: {str(e)}")
            expert_advice = [
                "1. 발음 분석을 생성할 수 없습니다.",
                "2. 기본적인 말하기 패턴만 참고해주세요.",
                "3. 시스템 오류로 상세 분석을 제공할 수 없습니다."
            ]

        return {
            "expert_advice": expert_advice,
            "key_issues_count": len(significant_issues),
            "speaking_pattern": speaking_patterns
        }

    except Exception as e:
        logger.error(f"Pronunciation analysis error: {str(e)}")
        return {
            "expert_advice": [
                "1. 발음 분석 중 오류가 발생했습니다.",
                "2. 시스템 문제로 분석이 불가능합니다.",
                "3. 잠시 후 다시 시도해주세요."
            ],
            "speaking_pattern": {"패턴": "분석 불가"}
        }

def analyze_speaking_pattern(timestamps: List[Dict]) -> Dict:
    """말하기 패턴 간소화 분석"""
    if not timestamps:
        return {"패턴": "분석 불가"}

    total_words = len(timestamps)
    total_duration = sum(float(t.get('duration', 0)) for t in timestamps)
    avg_duration = total_duration / total_words if total_words > 0 else 0

    # 패턴 분석
    long_pauses = sum(1 for t in timestamps if float(t.get('duration', 0)) > 1.0)
    rapid_speech = sum(1 for t in timestamps if float(t.get('duration', 0)) < 0.1)
    
    pattern = {
        "seperation_speed": "보통",
        "point": []
    }

    if avg_duration > 0.5:
        pattern["seperation_speed"] = "느림"
        pattern["point"].append("전반적으로 천천히 말하는 편")
    elif avg_duration < 0.2:
        pattern["seperation_speed"] = "빠름"
        pattern["point"].append("전반적으로 빠르게 말하는 편")

    if long_pauses > total_words * 0.1:
        pattern["point"].append("긴 휴식이 다소 많음")
    if rapid_speech > total_words * 0.3:
        pattern["point"].append("빠른 발화 구간이 많음")

    return pattern

def calculate_interview_grade(questions_data: List[Dict]) -> str:
    """
    피드백 점수를 기반으로 인터뷰 등급을 계산합니다.
    미흡 (0-65), 개선 필요 (66-75), 보통 (76-85), 우수 (86-93), 탁월 (94-100)
    """
    total_score = 0
    valid_scores = 0

    for question in questions_data:
        for answer in question.get("answers", []):
            feedback = answer.get("feedback", {})
            scores = feedback.get("scores", {})
            
            # overall 점수와 세부 점수들의 평균 계산
            overall = scores.get("overall", 0)
            detail_scores = [
                value for key, value in scores.items() 
                if key != "overall" and isinstance(value, (int, float))
            ]
            
            if overall > 0:
                question_score = overall * 0.4  # overall 점수 비중 40%
                if detail_scores:
                    question_score += (sum(detail_scores) / len(detail_scores)) * 0.6  # 세부 점수 평균 비중 60%
                total_score += question_score
                valid_scores += 1

    if valid_scores == 0:
        return "미흡"  # 유효한 점수가 없는 경우

    average_score = total_score / valid_scores

    if average_score >= 94:
        return "탁월"
    elif average_score >= 86:
        return "우수"
    elif average_score >= 76:
        return "보통"
    elif average_score >= 66:
        return "개선 필요"
    else:
        return "미흡"



@router.post("/report/{interview_id}")
async def get_interview_report(
    interview_id: int,
    db: AsyncSession = Depends(get_async_db),
    member: Member = Depends(get_current_member)
):
    query = (
        select(Interview)
        .options(
            joinedload(Interview.questions)
            .joinedload(Question.answers)
            .joinedload(Answer.feedbacks),
            joinedload(Interview.questions)
            .joinedload(Question.answers)
            .joinedload(Answer.video_analyze),
            joinedload(Interview.questions)
            .joinedload(Question.answers)
            .joinedload(Answer.analyze_audio)
        )
        .where(and_(Interview.interview_id == interview_id, Interview.member_id == member.member_id))
    )
    
    result = await db.execute(query)
    interview = result.unique().scalar_one_or_none()
    
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")
        
    report_data = {
        "interview_id": interview_id,
        "interview_type": interview.interview_type.value,
        "created_at": datetime.utcnow().isoformat(),
        "questions": []
    }
    
    for question in interview.questions:
        if question.question_tag == QuestionTag.ready or not question.answers:
            continue

        question_data = {
            "content": question.content,
            "intent": question.question_intent,
            "tag": question.question_tag,
            "answers": []
        }
        
        for answer in question.answers:
            try:
                if interview.interview_type == InterviewType.video:
                    analysis = answer.video_analyze
                    video_behavior_analysis = None
                    pronunciation_analysis = None
                    
                    if analysis and analysis.time_series_data:
                        video_behavior_analysis = await analyze_video_behavior(
                            json.loads(analysis.time_series_data)
                        )
                        
                        if analysis.pronunciation_issues and analysis.word_timestamps:
                            pronunciation_analysis = await analyze_pronunciation_with_gpt(
                                analysis.pronunciation_issues,
                                analysis.word_timestamps
                            )
                    
                    answer_data = {
                        "content": answer.content,
                        "video_url": answer.video_s3_key,
                        "audio_url": answer.audio_s3_key,
                        "feedback": answer.feedbacks.feedback_data if answer.feedbacks else {},
                        "analysis": {
                            "transcript": analysis.transcript if analysis else None,
                            "video_metrics": video_behavior_analysis or {"error": "분석 불가"},
                            "speech_metrics": {
                                "speech_rate": analysis.speech_rate,
                                "volume_variation": analysis.volume_variation,
                                "silence_ratio": analysis.silence_ratio,
                                "fluency_score": analysis.fluency_score
                            } if analysis else {},
                            "pronunciation_analysis": pronunciation_analysis or {}
                        }
                    }
                
                elif interview.interview_type == InterviewType.text:
                    answer_data = {
                        "content": answer.content,
                        "feedback": answer.feedbacks.feedback_data if answer.feedbacks else {}
                    }
                
                elif interview.interview_type == InterviewType.audio:
                    analysis = answer.analyze_audio
                    pronunciation_analysis = None
                    
                    if analysis and analysis.pronunciation_issues and analysis.word_timestamps:
                        pronunciation_analysis = await analyze_pronunciation_with_gpt(
                            analysis.pronunciation_issues,
                            analysis.word_timestamps
                        )
                    
                    answer_data = {
                        "content": answer.content,
                        "audio_url": answer.audio_s3_key,
                        "feedback": answer.feedbacks.feedback_data if answer.feedbacks else {},
                        "analysis": {
                            "transcript": analysis.transcript,
                            "speech_metrics": {
                                "speech_rate": analysis.speech_rate,
                                "volume_variation": analysis.volume_variation,
                                "silence_ratio": analysis.silence_ratio,
                                "fluency_score": analysis.fluency_score
                            },
                            "pronunciation_analysis": pronunciation_analysis or {}
                        } if analysis else {}
                    }
                
                question_data["answers"].append(answer_data)
                
            except Exception as e:
                logger.error(f"Answer analysis error: {str(e)}")
                question_data["answers"].append({
                    "content": answer.content,
                    "error": "답변 분석 중 오류가 발생했습니다"
                })
        
        report_data["questions"].append(question_data)
    
    interview_grade = calculate_interview_grade(report_data["questions"])
    report_data["interview_grade"] = interview_grade
    
    try:
        report = Report(
            interview_id=interview_id,
            member_id=member.member_id,
            title=f"Interview Report - {datetime.utcnow().strftime('%Y-%m-%d')}",
            content=json.dumps(report_data, ensure_ascii=False)
        )
        
        db.add(report)
        await db.execute(
            update(InterviewLog)
            .where(InterviewLog.interview_id == interview_id)
            .values(interview_type=interview.interview_type.value, interview_grade=interview_grade)
        )
        await db.commit()
    
    except Exception as e:
        logger.error(f"Failed to save report: {str(e)}")
        await db.rollback()
        raise HTTPException(status_code=500, detail="Failed to save report")
    
    return report_data

@router.get("/report/{interview_id}")
async def get_report_log(
    interview_id: int,
    db: AsyncSession = Depends(get_async_db),
    member: Member = Depends(get_current_member)
):
    """특정 인터뷰의 최신 리포트 조회 API"""
    try:
        # 가장 최신 리포트 조회
        query = (
            select(Report)
            .where(
                and_(
                    Report.interview_id == interview_id,
                    Report.member_id == member.member_id
                )
            )
            .order_by(Report.created_at.desc())
            .limit(1)  # 최신 리포트 1개만 조회
        )
        
        result = await db.execute(query)
        report = result.scalar_one_or_none()
        
        if not report:
            raise HTTPException(
                status_code=404,
                detail="Report not found"
            )
            
        try:
            content = json.loads(report.content)
            return {
                "report_id": report.report_id,
                "interview_id": report.interview_id,
                "title": report.title,
                "content": content,
                "created_at": report.created_at
            }
        except json.JSONDecodeError as e:
            logger.error(f"Failed to decode report content for interview_id: {interview_id}. Error: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail="Failed to decode report content"
            )
        
    except Exception as e:
        logger.error(f"Error retrieving report: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to retrieve report"
        )
    
