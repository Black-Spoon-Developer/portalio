// src/pages/interview/InterviewProcess.tsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setQuestions,
  startAnswering,
  stopAnswering,
  uploadComplete,
  setLoading,
} from "../../../store/interview/InterviewSlice";
import { RootState } from "../../../store"; // 직접 정의한 타입을 import
import QuestionTimer from "../../../components/interview/QuestionTimer";
import WebcamCapture from "../../../components/interview/WebcamCapture";
import AnalysisResults from "../../../components/interview/AnalysisResults";
import { fetchQuestionsApi, uploadAnalysisResultApi } from "../../../api/InterviewAPI";

const InterviewProcess: React.FC = () => {
  const dispatch = useDispatch();

  // InterviewState 타입을 사용하여 필요한 상태를 직접 가져오기
  const {
    questions,
    currentQuestionIndex,
    isRecording,
    isAnswering,
    isLoading,
    isFinished,
    isUploading,
    preparationTime,
    answerTime,
    analysisResults, // analysisResults 추가
  } = useSelector((state: RootState) => state.interview);

  useEffect(() => {
    const fetchQuestions = async () => {
      dispatch(setLoading(true));
      const questions = await fetchQuestionsApi();
      if (questions) {
        dispatch(setQuestions(questions));
      } else {
        dispatch(setLoading(false));
      }
    };

    fetchQuestions();
  }, [dispatch]);

  const handleStartAnswering = () => {
    dispatch(startAnswering());
  };

  const handleStopAnswering = () => {
    dispatch(stopAnswering());
  };

  const handleAnalysisResult = async (questionId: number, blob: Blob) => {
    const result = await uploadAnalysisResultApi(questionId, blob);
    if (result !== null) {
      dispatch(uploadComplete({ questionIndex: currentQuestionIndex, result }));
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {!isFinished ? (
        <>
          <h2>질문 {currentQuestionIndex + 1}: {questions[currentQuestionIndex]}</h2>
          <WebcamCapture
            isRecording={isRecording}
            questionId={currentQuestionIndex + 1}
            onUploadComplete={(blob) => handleAnalysisResult(currentQuestionIndex + 1, blob)}
          />
          {!isAnswering ? (
            <QuestionTimer
              time={preparationTime}
              onTimeEnd={handleStartAnswering}
              label="준비 시간"
            />
          ) : (
            <QuestionTimer
              time={answerTime}
              onTimeEnd={handleStopAnswering}
              label="답변 시간"
            />
          )}
          {!isAnswering && !isUploading && (
            <button onClick={handleStartAnswering}>답변 시작</button>
          )}
          {isAnswering && !isUploading && (
            <button onClick={handleStopAnswering}>답변 종료</button>
          )}
        </>
      ) : (
        <AnalysisResults results={Object.values(analysisResults)} />
      )}
    </div>
  );
};

export default InterviewProcess;
