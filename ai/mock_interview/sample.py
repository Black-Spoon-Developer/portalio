
# async def save_audio_answer_and_feedback(db: AsyncSession, question_id: int, member_id: int, audio_data: bytes):
#     # S3에 오디오 파일 저장
#     s3_key = f"audio_answers/{question_id}_{member_id}.wav"
#     s3_client.put_object(Bucket=os.getenv("S3_BUCKET_NAME"), Key=s3_key, Body=audio_data)

#     # STT로 텍스트 변환
#     client = speech.SpeechClient()
#     audio = speech.RecognitionAudio(content=audio_data)
#     config = speech.RecognitionConfig(language_code="ko-KR")
#     response = client.recognize(config=config, audio=audio)
#     transcript = response.results[0].alternatives[0].transcript

#     # 답변 저장
#     answer = Answer(
#         question_id=question_id,
#         member_id=member_id,
#         content=transcript,
#         interview_type="audio",
#         audio_s3_key=s3_key
#     )
#     db.add(answer)
#     await db.flush()

#     # 피드백 생성 및 저장
#     feedback_text = generate_feedback(transcript)
#     feedback = Feedback(answer_id=answer.answer_id, feedback_text=feedback_text)
#     db.add(feedback)
#     await db.commit()

#     return answer, feedback

# async def save_video_answer_and_feedback(db: AsyncSession, question_id: int, member_id: int, video_data: bytes):
#     # S3에 비디오 파일 저장
#     s3_key = f"video_answers/{question_id}_{member_id}.mp4"
#     s3_client.put_object(Bucket=os.getenv("S3_BUCKET_NAME"), Key=s3_key, Body=video_data)

#     # 추후 화상 분석 기능을 위한 공간
#     # 현재는 텍스트로 답변 생성이 없으므로 기본 답변 설정
#     transcript = "영상 인터뷰 답변입니다."

#     # 답변 저장
#     answer = Answer(
#         question_id=question_id,
#         member_id=member_id,
#         content=transcript,
#         interview_type="video",
#         video_s3_key=s3_key
#     )
#     db.add(answer)
#     await db.flush()

#     # 피드백 생성 및 저장
#     feedback_text = generate_feedback(transcript)
#     feedback = Feedback(answer_id=answer.answer_id, feedback_text=feedback_text)
#     db.add(feedback)
#     await db.commit()

#     return answer, feedback



async def save_text_answer_and_feedback(
    db: AsyncSession, 
    question_id: int, 
    member_id: int, 
    answer_text: str,
    question: str,
    question_intent: str,
    context_text: str
):
    """답변 저장 및 피드백 생성 후 저장"""
    
    # Answer 저장
    answer = Answer(
        question_id=question_id,
        member_id=member_id,
        content=answer_text,
        interview_type="text",
        created_at=datetime.utcnow()
    )
    db.add(answer)

    try:
        await db.flush()  # answer_id 생성 시도
        answer_id = answer.answer_id

        # 피드백 생성
        feedback_data = await generate_feedback(
            question=question,
            question_intent=question_intent,
            context_text=context_text,
            answer_text=answer_text
        )
        
        # Feedback 저장
        feedback = Feedback(
            answer_id=answer_id,
            feedback_text=feedback_data.get("overall_comment", ""),
            feedback_data=feedback_data  # JSON 형식으로 저장
        )
        db.add(feedback)
        await db.commit()
        
    except Exception as e:
        await db.rollback()  # 오류 발생 시 롤백
        # answer_id가 생성되지 않았을 경우 피드백 기본 값 설정
        feedback_data = {
            "overall_comment": "답변 저장이 중단되었습니다.",
            "feedback_data": {
                "content_relevance": 0,
                "question_understanding": 0,
                "logic": 0,
                "delivery": 0,
                "strengths": [],
                "improvements": [],
                "suggestions": [],
            }
        }
        
        # answer_id 없이 피드백 저장
        feedback = Feedback(
            answer_id=None,
            feedback_text=feedback_data["overall_comment"],
            feedback_data=feedback_data
        )
        db.add(feedback)
        await db.commit()
    
    return answer, feedback
