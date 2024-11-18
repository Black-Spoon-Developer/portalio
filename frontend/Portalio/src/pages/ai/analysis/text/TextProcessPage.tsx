import React, { useState } from "react";
import { useEffect } from "react";
import LoadingSpinner from "../../../../components/spinner/LoadingSpinner";
import { QuestionDTO } from "../../../../interface/aiInterview/AICommonInterface";
import { RootState } from "../../../../store";
import { InterviewActions } from "../../../../store/aiInterview/InterviewSlice";
import { useDispatch, useSelector } from "react-redux";
import InterviewTextChatLog from "../../../../components/ai/analysis/text/InterviewTextChatLog";
import InterviewTextAnswerInput from "../../../../components/ai/analysis/text/InterviewTextAnswerInput";
import { submitTextAnswer } from "../../../../api/TextInterviewAPI";
import { useNavigate } from "react-router-dom";
import { TextAnswerRequest } from "../../../../interface/aiInterview/TextInterviewInterface";

const TextProcessPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 지금 답변하려는 질문 출력을 위한 상태
  const [_, setCurrentQuestion] = useState<QuestionDTO>();
  // 중앙 저장소에서 필요한 상태들을 가져오기
  // 생성된 질문들, 녹음 중 상태, audio URL - useState에서 해결?, / question ID, interviewID - 요청 보낼때 필요함, portfoilId - optional, repositoryId - optional, currentIndex 현재 질문 인덱스
  const {
    questions,
    questionId,
    interviewId,
    portfolioId,
    repositoryId,
    currentIndex,
  } = useSelector((state: RootState) => state.aiInterview);
  // 마지막 답변 제출 상태
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 답변 다루는 상태
  const [textAnswer, setTextAnswer] = useState("");
  const [chatLog, setChatLog] = useState<
    { type: "question" | "answer"; content: string; index?: number }[]
  >([
    {
      type: "question",
      content: questions[0]?.question_text || "질문이 없습니다.", // 안전하게 content 필드 참조
      index: 1,
    },
  ]);

  // 답변 제출 핸들러 함수
  const handleTextAnswerSubmit = async () => {
    // 답변 내용이 없으면 경고!
    if (!textAnswer.trim()) {
      alert("답변 내용을 입력해주세요!");
    }

    // 답변 내용 채팅로그에 추가하기
    setChatLog((prevLog) => [
      ...prevLog,
      { type: "answer", content: textAnswer },
    ]);

    // 만약 현재 마지막 질문이 아니라면
    if (currentIndex < 4) {
      // 답변 제출하기 - requestBody로 요청 보내기
      const request: TextAnswerRequest = {
        interview_id: Number(interviewId),
        question_id: Number(questionId),
        portfolio_id: Number(portfolioId),
        repository_id: Number(repositoryId),
        answer_text: textAnswer,
      };

      // 제출 요청 보내기 - 비동기
      submitTextAnswer(request);

      // 답변 내용 초기화
      setTextAnswer("");

      // 다음 질문으로 변경
      const nextIndex = currentIndex + 1;
      setChatLog((prevLog) => [
        ...prevLog,
        {
          type: "question",
          content:
            questions[nextIndex]?.question_text || "다음 질문이 없습니다.",
          index: nextIndex + 1,
        },
      ]);
      setCurrentQuestion(questions[nextIndex]); // 바로 다음 질문 설정
      dispatch(InterviewActions.incrementCurrentIndex());
      dispatch(
        InterviewActions.setQuestionId(questions[nextIndex].question_id)
      );
    } else {
      // 제출중 상태로 바꾸기
      setIsSubmitting(true);

      // 답변 제출하기 - requestBody로 요청 보내기
      const request: TextAnswerRequest = {
        interview_id: Number(interviewId),
        question_id: Number(questionId),
        portfolio_id: Number(portfolioId),
        repository_id: Number(repositoryId),
        answer_text: textAnswer,
      };

      // 제출 함수 실행
      await submitTextAnswer(request);

      // 제출중 상태로 바꾸기
      setIsSubmitting(false);

      // 분석 페이지로 이동하기
      navigate(`/ai/interview/text/analysis/${interviewId}`);
    }
  };

  useEffect(() => {
    if (questions && questions.length > 0 && questions[currentIndex]) {
      setCurrentQuestion(questions[currentIndex]); // 현재 질문 업데이트
      dispatch(
        InterviewActions.setQuestionId(questions[currentIndex].question_id)
      ); // 첫번째 질문 ID 설정
    }
  }, []);

  if (isSubmitting) {
    return <LoadingSpinner mode="Submitting" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <section className="col-span-1"></section>
      <section className="col-span-4 w-1/2">
        <div className="flex flex-col items-center justify-center">
          <header className="mb-5 font-bold text-5xl text-gray-500 text-center">
            💬 텍스트 면접
          </header>
          <InterviewTextChatLog chatLog={chatLog} />
          <InterviewTextAnswerInput
            textAnswer={textAnswer}
            setTextAnswer={setTextAnswer}
            handleTextAnswerSubmit={handleTextAnswerSubmit}
          />
        </div>
      </section>
      <section className="col-span-1"></section>
    </div>
  );
};

export default TextProcessPage;
