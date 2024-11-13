// // src/components/AnalysisResults.tsx
// import React from 'react';
// import { AnalysisResultsProps } from '../../type/InterviewType';

// const AnalysisResults: React.FC<AnalysisResultsProps> = ({ results = [] }) => {
//   console.log("Displaying analysis results:", results);  // 확인용 로그

//   if (!Array.isArray(results) || results.length === 0) return <p>분석 결과가 없습니다.</p>;

//   return (
//     <div>
//       <h2>질문별 분석 결과</h2>
//       {results.map((result, index) => (
//         <div key={index}>
//           <h3>질문 {index + 1}</h3>
//           <div>
//             <h4>분석 내용:</h4>
//             <p>현재 감정: {result["current emotion"] || "데이터 없음"}</p>
//             <p>움직임 집중도: {result["movement focus"] || "데이터 없음"}</p>
//             <p>시선 집중도: {result["gaze focus"] || "데이터 없음"}</p>
//             <h4>Time Series Data:</h4>
//             {result["time_series_data"] && result["time_series_data"].length > 0 ? (
//               result["time_series_data"].map((dataPoint, idx) => (
//                 <p key={idx}>
//                   시간: {dataPoint.time}, 감정: {dataPoint.emotion}, 움직임 집중도: {dataPoint.movement_focus}, 시선 집중도: {dataPoint.gaze_focus}
//                 </p>
//               ))
//             ) : (
//               <p>Time Series Data가 없습니다.</p>
//             )}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default AnalysisResults;