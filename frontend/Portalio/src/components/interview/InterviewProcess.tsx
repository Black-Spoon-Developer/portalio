// src/components/interview/InterviewProcess.tsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setQuestions,
  startAnswering,
  stopAnswering,
  uploadComplete,
  setLoading,
} from "../../store/interview/InterviewSlice";
import { RootState } from "../../store";
import QuestionTimer from "../ai/QuestionTimer";
import WebcamCapture from "../ai/WebcamCapture";
import AnalysisResults from "../ai/AnalysisResults";
import { fetchQuestionsApi, uploadAnalysisResultApi } from "../../api/InterviewAPI";

interface InterviewProcessProps {
  interviewType: "video" | "audio" | "text";
  interviewId: number;
}

const InterviewProcess: React.FC<InterviewProcessProps> = ({ interviewType, interviewId }) => {
  const dispatch = useDispatch();

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
    analysisResults,
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

  const handleAnalysisResult = async (blob: Blob) => {
    const questionId = currentQuestionIndex + 1;
    const result = await uploadAnalysisResultApi(interviewId, questionId, blob);
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
          <h2>
            질문 {currentQuestionIndex + 1}: {questions[currentQuestionIndex]}
          </h2>
          {interviewType === "video" && (
            <WebcamCapture
              isRecording={isRecording}
              interviewId={interviewId}
              questionId={currentQuestionIndex + 1}
              onUploadComplete={handleAnalysisResult}
            />
          )}
          {!isAnswering ? (
            <QuestionTimer time={preparationTime} onTimeEnd={handleStartAnswering} label="준비 시간" />
          ) : (
            <QuestionTimer time={answerTime} onTimeEnd={handleStopAnswering} label="답변 시간" />
          )}
          {!isAnswering && !isUploading && <button onClick={handleStartAnswering}>답변 시작</button>}
          {isAnswering && !isUploading && <button onClick={handleStopAnswering}>답변 종료</button>}
        </>
      ) : (
        <AnalysisResults results={Object.values(analysisResults)} />
      )}
    </div>
  );
};

export default InterviewProcess;
