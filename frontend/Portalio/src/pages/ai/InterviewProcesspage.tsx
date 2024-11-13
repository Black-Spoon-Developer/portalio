// // src/pages/interview/InterviewProcessPage.tsx
// import React, { useEffect, useCallback } from "react";
// import WebcamCapture from "../../components/ai/WebcamCapture";
// import { useSelector, useDispatch } from "react-redux";
// import { RootState } from "../../store";
// import { interviewActions } from "../../store/interview/InterviewSlice";
// import QuestionTimer from "../../components/ai/QuestionTimer";
// import { useNavigate, useLocation } from "react-router-dom";
// import { uploadVideoApi, uploadAudioApi } from "../../api/InterviewAPI";

// const InterviewProcessPage: React.FC = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const { interviewId, questions, currentQuestionIndex, isPreparationTime, isFinished, isRecording, pendingUploads } = useSelector((state: RootState) => state.interview);

//   const interviewType = location.state?.interviewType || "video"; // 기본값을 "video"로 설정

//   // 면접이 시작될 때 준비 상태로 설정
//   useEffect(() => {
//     if (isFinished) {
//       dispatch(interviewActions.resetInterview()); // 면접 상태 초기화
//     } else if (questions.length > 0 && currentQuestionIndex === 0) {
//       dispatch(interviewActions.startPreparation()); // 첫 질문에서 준비 상태로 설정
//     }
//   }, [dispatch, questions.length, isFinished, currentQuestionIndex]);

//   useEffect(() => {
//     console.log("Updated pendingUploads state:", pendingUploads);
//   }, [pendingUploads]);

//   // 준비시간이 끝나면 답변시간 시작
//   const handlePreparationEnd = useCallback(() => {
//     dispatch(interviewActions.startAnswering())
//   }, [dispatch]);

//   // 답변시간 끝나면 현재 문제 번호가 마지막번호가 아니라면 현재 번호 +1, 마지막 번호면 분석페이지로 이동

//   const handleRecordingComplete = useCallback(
//     async (blob: Blob) => {
//       const questionId = currentQuestionIndex;
//       console.log("Adding to pendingUploads:", questionId);  // 로그 추가
//       dispatch(interviewActions.addPendingUpload(questionId));
      

//       try {
//         if (interviewId !== null) {
//           // interviewType이 video인 경우 video 및 audio API 모두 호출
//           if (interviewType === "video") {
//             const videoResult = await uploadVideoApi(interviewId, questionId, blob);
//             if (videoResult) {
//               dispatch(interviewActions.saveAnalysisResult({ questionId, result: videoResult }));
//             }
//           }

//           // audio API 호출 (video와 audio 모두 이 호출은 공통적으로 필요)
//           const audioResult = await uploadAudioApi(interviewId, questionId, blob);
//           if (audioResult) {
//             dispatch(interviewActions.saveAnalysisResult({ questionId, result: audioResult }));
//           }
//         }
//       } catch (error) {
//         console.error("Failed to upload video:", error);
//       } finally {
//         dispatch(interviewActions.removePendingUpload(questionId));
//       }
//     },
//     [currentQuestionIndex, dispatch, interviewId]
//   );

//   // 답변 시간이 끝나면 녹화를 종료하고 다음 질문으로 이동
//   const handleAnswerEnd = useCallback(() => {
//     dispatch(interviewActions.stopAnswering()); // 녹화 중지 상태로 전환

//     if (currentQuestionIndex < questions.length - 1) {
//       dispatch(interviewActions.incrementQuestionIndex());
//       dispatch(interviewActions.startPreparation());
//     } else {
//       dispatch(interviewActions.resetInterview()); // 모든 질문 완료 시 초기화
//       navigate("/ai/analyze");
//     }
//   }, [currentQuestionIndex, dispatch, navigate, questions.length]);


//   return (
//     <div className="min-h-screen bg-gray-100 p-8">
//       <header className="mb-12 text-center">
//         {/* Step 표시 */}
//         <div className="flex justify-evenly mb-6">
//           {questions.map((_, index) => (
//             <div
//               key={index}
//               className={`w-12 h-12 flex items-center justify-center font-bold text-white rounded transform rotate-45 ${
//                 index <= currentQuestionIndex ? "bg-blue-600" : "bg-gray-300"
//               }`}
//             >
//               <span className="transform -rotate-45">{index + 1}</span>
//             </div>
//           ))}
//         </div>
//       </header>

//       <section className="flex justify-center items-start space-x-16">
//         {/* 인터뷰 타입에 따라 다른 화면 표시 */}
//         <div className="w-1/2 max-w-lg bg-white rounded-lg shadow-md p-4 relative">
//           <div className="flex justify-between items-center mb-4">
//             <span className="bg-gray-200 text-gray-800 font-bold text-center rounded-lg px-4 py-2">
//               {interviewType === "video" ? "화상 면접" : interviewType === "audio" ? "음성 면접" : "텍스트 면접"}
//             </span>
//             <QuestionTimer
//               isPreparationTime={isPreparationTime}
//               preparationTime={30}
//               answerTime={60}
//               onPreparationEnd={handlePreparationEnd}
//               onAnswerEnd={handleAnswerEnd}
//             />
//           </div>

//           {/* 면접 화면 표시 */}
//           <div className="bg-gray-200 w-full mb-4 rounded-lg flex items-center justify-cente overflow-hidden">
//             {interviewType === "video" && <WebcamCapture
//                 isRecording={isRecording}
//                 onRecordingComplete={handleRecordingComplete}
//               />}
//             {interviewType === "audio" && <img src="/path/to/default-image.png" alt="음성 면접 이미지" />}
//             {interviewType === "text" && (
//               <p className="text-gray-500">텍스트 면접에서는 질문에 텍스트로 답변하세요.</p>
//             )}
//           </div>
//         </div>

//         {/* 질문 및 답변 버튼 영역 */}
//         <div className="w-1/3 flex flex-col relative" style={{ height: "448px" }}>
//           <section className="mb-12">
//             <h2 className="text-xl font-semibold text-gray-900 mb-4">
//               {`질문 ${currentQuestionIndex + 1}`}
//             </h2>
//             <p className="text-2xl font-bold text-gray-800">{questions[currentQuestionIndex]}</p>
//           </section>

//           <button
//             onClick={isPreparationTime ? handlePreparationEnd : handleAnswerEnd}
//             className={`w-full py-3 text-white rounded-lg text-lg absolute bottom-0 transition ${
//               isPreparationTime ? "bg-teal-500 hover:bg-teal-600" : "bg-red-500 hover:bg-red-600"
//             }`}
//           >
//             {isPreparationTime ? "답변하기" : "답변 완료"}
//           </button>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default InterviewProcessPage;
// src/pages/interview/InterviewProcessPage.tsx
import React, { useEffect, useCallback } from "react";
import WebcamCapture from "../../components/ai/WebcamCapture";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { interviewActions } from "../../store/interview/InterviewSlice";
import QuestionTimer from "../../components/ai/QuestionTimer";
import { useNavigate, useLocation } from "react-router-dom";
import { uploadVideoApi/*, getAnalysisResultApi*/ } from "../../api/InterviewAPI";

const InterviewProcessPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { interviewId, questions, currentQuestionIndex, isPreparationTime, isFinished, isRecording, pendingUploads } = useSelector((state: RootState) => state.interview);

  const interviewType = location.state?.interviewType || "video"; // 기본값을 "video"로 설정

  // 면접이 시작될 때 준비 상태로 설정
  useEffect(() => {
    if (isFinished) {
      dispatch(interviewActions.resetInterview()); // 면접 상태 초기화
    } else if (questions.length > 0 && currentQuestionIndex === 0) {
      dispatch(interviewActions.startPreparation()); // 첫 질문에서 준비 상태로 설정
    }
  }, [dispatch, questions.length, isFinished, currentQuestionIndex]);

  useEffect(() => {
    console.log("Updated pendingUploads state:", pendingUploads);
  }, [pendingUploads]);

  // 준비시간이 끝나면 답변시간 시작
  const handlePreparationEnd = useCallback(() => {
    dispatch(interviewActions.startAnswering())
  }, [dispatch]);

  // 답변시간 끝나면 현재 문제 번호가 마지막번호가 아니라면 현재 번호 +1, 마지막 번호면 분석페이지로 이동

  const handleRecordingComplete = useCallback(
    async (blob: Blob) => {
      const questionId = currentQuestionIndex;
      console.log("Adding to pendingUploads:", questionId);  // 로그 추가
      dispatch(interviewActions.addPendingUpload(questionId));
      

      try {
        if (interviewId !== null) {  // interviewId가 존재하는 경우에만 업로드
          const result = await uploadVideoApi(interviewId, questionId, blob, 3);
          if (result) {
            dispatch(interviewActions.saveAnalysisResult({ questionId, result }));
          }
        }
      } catch (error) {
        console.error("Failed to upload video:", error);
      } finally {
        dispatch(interviewActions.removePendingUpload(questionId));
      }
    },
    [currentQuestionIndex, dispatch, interviewId]
  );

  // 답변 시간이 끝나면 녹화를 종료하고 다음 질문으로 이동
  const handleAnswerEnd = useCallback(() => {
    dispatch(interviewActions.stopAnswering()); // 녹화 중지 상태로 전환

    if (currentQuestionIndex < questions.length - 1) {
      dispatch(interviewActions.incrementQuestionIndex());
      dispatch(interviewActions.startPreparation());
    } else {
      dispatch(interviewActions.resetInterview()); // 모든 질문 완료 시 초기화
      navigate("/ai/analyze");
    }
  }, [currentQuestionIndex, dispatch, navigate, questions.length]);


  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <header className="mb-12 text-center">
        {/* Step 표시 */}
        <div className="flex justify-evenly mb-6">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`w-12 h-12 flex items-center justify-center font-bold text-white rounded transform rotate-45 ${
                index <= currentQuestionIndex ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <span className="transform -rotate-45">{index + 1}</span>
            </div>
          ))}
        </div>
      </header>

      <section className="flex justify-center items-start space-x-16">
        {/* 인터뷰 타입에 따라 다른 화면 표시 */}
        <div className="w-1/2 max-w-lg bg-white rounded-lg shadow-md p-4 relative">
          <div className="flex justify-between items-center mb-4">
            <span className="bg-gray-200 text-gray-800 font-bold text-center rounded-lg px-4 py-2">
              {interviewType === "video" ? "화상 면접" : interviewType === "audio" ? "음성 면접" : "텍스트 면접"}
            </span>
            <QuestionTimer
              isPreparationTime={isPreparationTime}
              preparationTime={30}
              answerTime={60}
              onPreparationEnd={handlePreparationEnd}
              onAnswerEnd={handleAnswerEnd}
            />
          </div>

          {/* 면접 화면 표시 */}
          <div className="bg-gray-200 w-full mb-4 rounded-lg flex items-center justify-cente overflow-hidden">
            {interviewType === "video" && <WebcamCapture
                isRecording={isRecording}
                onRecordingComplete={handleRecordingComplete}
              />}
            {interviewType === "audio" && <img src="/path/to/default-image.png" alt="음성 면접 이미지" />}
            {interviewType === "text" && (
              <p className="text-gray-500">텍스트 면접에서는 질문에 텍스트로 답변하세요.</p>
            )}
          </div>
        </div>

        {/* 질문 및 답변 버튼 영역 */}
        <div className="w-1/3 flex flex-col relative" style={{ height: "448px" }}>
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {`질문 ${currentQuestionIndex + 1}`}
            </h2>
            <p className="text-2xl font-bold text-gray-800">{questions[currentQuestionIndex]}</p>
          </section>

          <button
            onClick={isPreparationTime ? handlePreparationEnd : handleAnswerEnd}
            className={`w-full py-3 text-white rounded-lg text-lg absolute bottom-0 transition ${
              isPreparationTime ? "bg-teal-500 hover:bg-teal-600" : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {isPreparationTime ? "답변하기" : "답변 완료"}
          </button>
        </div>
      </section>
    </div>
  );
};

export default InterviewProcessPage;
