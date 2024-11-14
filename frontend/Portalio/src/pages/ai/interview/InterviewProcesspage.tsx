// InterviewProcessPage.tsx
import React, { useEffect, useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store";
import { interviewActions } from "../../../store/interview/InterviewSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { uploadVideoApi } from "../../../api/InterviewAPI";
import ProgressStepper from "../../../components/ai/interview/InterviewProgressStep";
import QuestionDisplay from "../../../components/ai/question/QuestionDisplay";
import InterviewControlPanel from "../../../components/ai/interview/InterviewControlPanel";
import LoadingOverlay from "../../../components/ai/interview/InterviewLoadingOverlay";

const InterviewProcessPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { interviewId, questions, currentQuestionIndex, isPreparationTime, isFinished, isRecording, pendingUploads } = useSelector(
    (state: RootState) => state.interview
  );

  const interviewType = location.state?.interviewType || "video";
  const [isLastUploadInProgress, setIsLastUploadInProgress] = useState(false);

  useEffect(() => {
    if (isFinished) {
      dispatch(interviewActions.resetInterview());
    } else if (questions.length > 0 && currentQuestionIndex === 0) {
      dispatch(interviewActions.startPreparation());
    }
  }, [dispatch, questions.length, isFinished, currentQuestionIndex]);

  const handlePreparationEnd = useCallback(() => {
    dispatch(interviewActions.startAnswering());
  }, [dispatch]);

  const handleRecordingComplete = useCallback(
    async (blob: Blob) => {
      const questionId = currentQuestionIndex;
      dispatch(interviewActions.addPendingUpload(questionId));
      if (questionId === questions.length - 1) {
        setIsLastUploadInProgress(true);
      }
      try {
        if (interviewId !== null) {
          const result = await uploadVideoApi(interviewId, questionId, blob);
          if (result) {
            dispatch(interviewActions.saveAnalysisResult({ questionId, result }));
          }
        }
      } catch (error) {
        console.error("Failed to upload video:", error);
      } finally {
        dispatch(interviewActions.removePendingUpload(questionId));
        if (questionId === questions.length - 1) {
          setIsLastUploadInProgress(false);
          navigate("/ai/analyze/1/");
        }
      }
    },
    [currentQuestionIndex, dispatch, interviewId, navigate, questions.length]
  );

  const handleAnswerEnd = useCallback(() => {
    dispatch(interviewActions.stopAnswering());
    if (currentQuestionIndex < questions.length - 1) {
      dispatch(interviewActions.incrementQuestionIndex());
      dispatch(interviewActions.startPreparation());
    }
  }, [currentQuestionIndex, dispatch, questions.length]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <header className="mb-12 text-center">
        <ProgressStepper questions={questions} currentQuestionIndex={currentQuestionIndex} />
      </header>

      <section className="flex justify-center items-start space-x-16">
        <InterviewControlPanel
          interviewType={interviewType}
          isRecording={isRecording}
          isPreparationTime={isPreparationTime}
          onRecordingComplete={handleRecordingComplete}
          onPreparationEnd={handlePreparationEnd}
          onAnswerEnd={handleAnswerEnd}
        />

        <div className="w-1/3 flex flex-col relative" style={{ height: "448px" }}>
          <QuestionDisplay
            question={questions[currentQuestionIndex]}
            questionNumber={currentQuestionIndex + 1}
          />
          <button
            onClick={isPreparationTime ? handlePreparationEnd : handleAnswerEnd}
            className={`w-full py-3 text-white rounded-lg text-lg absolute bottom-0 transition ${
              isPreparationTime ? "bg-teal-500 hover:bg-[#57D4E2]" : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {isPreparationTime ? "답변하기" : "답변 완료"}
          </button>
        </div>
      </section>

      {isLastUploadInProgress && <LoadingOverlay />}
    </div>
  );
};

export default InterviewProcessPage;
