// LoadingOverlay.tsx
// 마지막 질문 업로드 중일때 로딩 메시지
import React from "react";

const LoadingOverlay: React.FC = () => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <p className="text-white text-2xl">로딩중...</p>
  </div>
);

export default LoadingOverlay;
