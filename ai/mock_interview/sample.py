
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



# async def save_text_answer_and_feedback(
#     db: AsyncSession, 
#     question_id: int, 
#     member_id: int, 
#     answer_text: str,
#     question: str,
#     question_intent: str,
#     context_text: str
# ):
#     """답변 저장 및 피드백 생성 후 저장"""
    
#     # Answer 저장
#     answer = Answer(
#         question_id=question_id,
#         member_id=member_id,
#         content=answer_text,
#         interview_type="text",
#         created_at=datetime.utcnow()
#     )
#     db.add(answer)

#     try:
#         await db.flush()  # answer_id 생성 시도
#         answer_id = answer.answer_id

#         # 피드백 생성
#         feedback_data = await generate_feedback(
#             question=question,
#             question_intent=question_intent,
#             context_text=context_text,
#             answer_text=answer_text
#         )
        
#         # Feedback 저장
#         feedback = Feedback(
#             answer_id=answer_id,
#             feedback_text=feedback_data.get("overall_comment", ""),
#             feedback_data=feedback_data  # JSON 형식으로 저장
#         )
#         db.add(feedback)
#         await db.commit()
        
#     except Exception as e:
#         await db.rollback()  # 오류 발생 시 롤백
#         # answer_id가 생성되지 않았을 경우 피드백 기본 값 설정
#         feedback_data = {
#             "overall_comment": "답변 저장이 중단되었습니다.",
#             "feedback_data": {
#                 "content_relevance": 0,
#                 "question_understanding": 0,
#                 "logic": 0,
#                 "delivery": 0,
#                 "strengths": [],
#                 "improvements": [],
#                 "suggestions": [],
#             }
#         }
        
#         # answer_id 없이 피드백 저장
#         feedback = Feedback(
#             answer_id=None,
#             feedback_text=feedback_data["overall_comment"],
#             feedback_data=feedback_data
#         )
#         db.add(feedback)
#         await db.commit()
    
#     return answer, feedback


# @router.post("/pre-interview", response_model=MemberInfoDTO)
# async def pre_interview(
#     token: str,
#     db: AsyncSession = Depends(get_db)
# ):
#     try:
#         # 토큰을 기반으로 현재 사용자 정보 조회
#         current_member = await get_current_member(token=token, db=db)

#         # Interview ID 생성
#         new_interview = Interview(member_id=current_member.member_id, interview_type="text")  # 기본 interview_type 설정
#         db.add(new_interview)
#         await db.flush()  # interview_id를 생성하고 반환하기 위해 flush 사용
#         interview_id = new_interview.interview_id

#         # member_id를 이용해 기록 조회
#         member_records = await get_member_records(db=db, member_id=current_member.member_id)
#         member_records.interview_id = interview_id  # 인터뷰 ID 포함

#         return member_records
    
#     except HTTPException as e:
#         raise e
#     except Exception as e:
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail="멤버 기록 실패"
#         )


# @router.post("/generate-questions", response_model=QuestionResponseDTO)
# async def create_interview_questions(
#     request: QuestionRequestDTO,
#     db: AsyncSession = Depends(get_db),
#     member=Depends(get_current_member)
# ):
#     # 포트폴리오, 리포지토리 텍스트 조회
#     portfolio_text, repository_text = None, None

#     if request.portfolio_id:
#         result = await db.execute(select(Portfolio).filter(Portfolio.portfolio_id == request.portfolio_id))
#         portfolio = result.scalars().first()
#         if portfolio:
#             portfolio_text = portfolio.portfolio_content
#         else:
#             raise HTTPException(status_code=404, detail="해당 포트폴리오를 찾을 수 없습니다.")
        
#     if request.repository_id:
#         result = await db.execute(select(Repository).filter(Repository.repository_id == request.repository_id))
#         repository = result.scalars().first()
#         if repository:
#             repository_text = repository.repository_content
#         else:
#             raise HTTPException(status_code=404, detail="해당 리포지토리를 찾을 수 없습니다.")
        
#     # 질문 생성 및 저장
#     try:
#         questions_data = await generate_and_save_questions(db, request.interview_id, portfolio_text, repository_text, request.job_roles)
#     except ValueError as e:
#         raise HTTPException(status_code=400, detail=str(e))
#     except Exception as e:
#         raise HTTPException(status_code=500, detail="질문 생성 중 오류가 발생했습니다.")

#     # 응답 형식으로 변환
#     response_questions = [
#         QuestionDTO(
#             question_tag=q["question_tag"],
#             question_intent=q["question_intent"],
#             question_text=q["question_text"],
#             audio_s3_url=q["audio_s3_url"]
#         ) for q in questions_data
#     ]

#     return QuestionResponseDTO(questions=response_questions)
