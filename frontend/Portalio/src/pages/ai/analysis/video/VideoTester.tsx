// VideoTester.tsx
import React, { useState, useRef } from "react";

const API_BASE_URL = "http://localhost:8000";
const TEST_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJtZW1iZXJJZCI6NCwibmFtZSI6IuycpOuvvOyerCIsInVzZXJuYW1lIjoiTHJuVFJYazlscy1DSFRwNXMyQzVPMEJHMmpic3NZd3VNeWpxZXEwYkJGYyIsInBpY3R1cmUiOiJkZWZhdWx0X3BpY3R1cmVfdXJsIiwiY2F0ZWdvcnkiOiJhY2Nlc3MiLCJlbWFpbCI6InN0eWxpc2h5MjUyOUBuYXZlci5jb20iLCJyb2xlIjoiVVNFUiIsImlhdCI6MTczMTgzMzcxNCwiZXhwIjoxNzM0NDI1NzE0fQ.PjA4wOtuEQeaXcUFxuQmr3iwXH5dBi3hNWtquFPEKx4";

interface VideoAnswerRequest {
  question_id: number;
  interview_id: number;
  portfolio_id?: number;
  repository_id?: number;
}

interface VideoAnswerResponse {
  answer_id: number;
  feedback: string;
  feedback_json: any;
}

const VideoTester: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [usedMimeType, setUsedMimeType] = useState<string>("");

  // 폼 입력값
  const [questionId, setQuestionId] = useState("1");
  const [interviewId, setInterviewId] = useState("1");
  const [portfolioId, setPortfolioId] = useState("");
  const [repositoryId, setRepositoryId] = useState("");

  // 비디오 레코더 참조
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // 녹화 시작
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: true,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // 지원하는 MIME 타입 확인
      const supportedMimeTypes = [
        "video/mp4",
        "video/webm;codecs=h264",
        "video/webm;codecs=vp8,opus",
      ];

      const mimeType = supportedMimeTypes.find((type) =>
        MediaRecorder.isTypeSupported(type)
      );

      if (!mimeType) {
        throw new Error("지원되는 비디오 형식이 없습니다.");
      }

      console.log("Using MIME Type:", mimeType);
      setUsedMimeType(mimeType);

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: mimeType,
        videoBitsPerSecond: 2500000,
      });

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.start(1000); // 1초마다 청크 생성
      setIsRecording(true);
      setError(null);
    } catch (err) {
      setError(
        "카메라/마이크 접근 권한이 필요하거나 녹화 형식이 지원되지 않습니다."
      );
      console.error("Error starting recording:", err);
    }
  };

  // 녹화 중지
  const stopRecording = () => {
    if (!mediaRecorderRef.current) return;

    mediaRecorderRef.current.onstop = () => {
      const videoBlob = new Blob(chunksRef.current, {
        type: usedMimeType,
      });
      setVideoBlob(videoBlob);
      setVideoUrl(URL.createObjectURL(videoBlob));

      // 스트림 정리
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }

      console.log("Recording completed with MIME type:", usedMimeType);
    };

    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  // 폼 제출 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoBlob) {
      setError("녹화된 비디오가 없습니다.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      const requestData: VideoAnswerRequest = {
        question_id: parseInt(questionId),
        interview_id: parseInt(interviewId),
        ...(portfolioId && { portfolio_id: parseInt(portfolioId) }),
        ...(repositoryId && { repository_id: parseInt(repositoryId) }),
      };

      // 비디오 Blob을 File 객체로 변환
      const videoFile = new File([videoBlob], "recording.mp4", {
        type: usedMimeType || "video/mp4",
      });

      // FormData에 추가
      formData.append("video_file", videoFile);
      formData.append("request", JSON.stringify(requestData));

      console.log("Video file type:", videoFile.type);
      console.log("Video file size:", videoFile.size);

      const response = await fetch(
        `${API_BASE_URL}/api/v1/mock-interview/video/submit-answer`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${TEST_TOKEN}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();
      setResponse(result);
      console.log("API Response:", result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
      );
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>
        Video API Tester
      </h1>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "15px" }}
      >
        {/* 입력 필드들 */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <label>
            Question ID:
            <input
              type="number"
              value={questionId}
              onChange={(e) => setQuestionId(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                marginTop: "5px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
              required
            />
          </label>

          <label>
            Interview ID:
            <input
              type="number"
              value={interviewId}
              onChange={(e) => setInterviewId(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                marginTop: "5px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
              required
            />
          </label>

          <label>
            Portfolio ID (optional):
            <input
              type="number"
              value={portfolioId}
              onChange={(e) => setPortfolioId(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                marginTop: "5px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
          </label>

          <label>
            Repository ID (optional):
            <input
              type="number"
              value={repositoryId}
              onChange={(e) => setRepositoryId(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                marginTop: "5px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
          </label>
        </div>

        {/* 비디오 프리뷰 */}
        <div
          style={{
            marginTop: "20px",
            width: "100%",
            aspectRatio: "16/9",
            backgroundColor: "#000",
          }}
        >
          <video
            ref={videoRef}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            autoPlay
            playsInline
            muted
          />
        </div>

        {/* 녹화된 비디오 재생 */}
        {videoUrl && (
          <div style={{ marginTop: "20px" }}>
            <video src={videoUrl} controls style={{ width: "100%" }} />
          </div>
        )}

        {/* 녹화 컨트롤 */}
        <div style={{ marginTop: "20px" }}>
          <button
            type="button"
            onClick={isRecording ? stopRecording : startRecording}
            style={{
              padding: "10px 20px",
              backgroundColor: isRecording ? "#dc2626" : "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "4px",
              marginRight: "10px",
              cursor: "pointer",
            }}
          >
            {isRecording ? "녹화 중지" : "녹화 시작"}
          </button>

          {videoUrl && (
            <button
              type="submit"
              disabled={isLoading}
              style={{
                padding: "10px 20px",
                backgroundColor: "#059669",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                opacity: isLoading ? 0.5 : 1,
              }}
            >
              {isLoading ? "처리중..." : "제출"}
            </button>
          )}
        </div>
      </form>

      {/* 에러 메시지 */}
      {error && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            backgroundColor: "#fee2e2",
            border: "1px solid #ef4444",
            borderRadius: "4px",
            color: "#b91c1c",
          }}
        >
          {error}
        </div>
      )}

      {/* API 응답 결과 */}
      {response && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            backgroundColor: "#f3f4f6",
            borderRadius: "4px",
          }}
        >
          <h2 style={{ marginBottom: "10px", fontWeight: "bold" }}>응답:</h2>
          <pre style={{ whiteSpace: "pre-wrap" }}>
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default VideoTester;
