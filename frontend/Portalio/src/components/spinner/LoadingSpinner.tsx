import * as React from "react";
import { CircularProgress } from "@mui/material";

interface LoadingSpinnerProps {
  mode: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ mode }) => {
  // mode에 따라 텍스트를 결정
  const loadingText =
    mode === "Question"
      ? "질문 생성 중..."
      : mode === "Analysis"
      ? "분석 중..."
      : mode === "Submitting"
      ? "답변 제출 중..."
      : mode === "Getting"
      ? "정보 요청 중"
      : "로딩 중...";

  return (
    <div className="flex justify-center items-center h-screen">
      <React.Fragment>
        <svg width={0} height={0}>
          <defs>
            <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#57D4E2" />
              <stop offset="100%" stopColor="#03F6B4" />
            </linearGradient>
          </defs>
        </svg>
        <CircularProgress
          size={150} // 크기를 150px로 설정
          sx={{ "svg circle": { stroke: "url(#my_gradient)" } }}
        />
      </React.Fragment>
      <div className="ml-10 text-5xl font-bold">{loadingText}</div>
    </div>
  );
};

export default LoadingSpinner;
