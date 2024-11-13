import React from "react";
import { useParams } from "react-router-dom";
import { boardDetailLike } from "../../../api/BoardAPI";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./QuestionDetailMd.css";

interface QuestionDetailMdProps {
  QuestionContent: string;
  isLiked: boolean;
  memberId: number;
  setUpdateDetailTrigger: React.Dispatch<React.SetStateAction<boolean>>;
}

const QuestionDetailMd: React.FC<QuestionDetailMdProps> = ({
  QuestionContent,
  isLiked,
  memberId,
  setUpdateDetailTrigger,
}) => {
  const userID = parseInt(
    useSelector((state: RootState) => state.auth.memberId) ?? "0",
    10
  );

  const { question_id } = useParams<{ question_id: string }>();

  const handleLike = async () => {
    if (!question_id) {
      alert("포트폴리오 ID가 없습니다.");
      return;
    }

    try {
      await boardDetailLike(question_id);
      setUpdateDetailTrigger(true);
    } catch (error) {
      alert("좋아요 처리 중 오류가 발생했습니다." + error);
    }
  };

  return (
    <div className="markdown-viewer p-6 rounded-lg border-2 relative">
      <header className="flex justify-between items-center">
        <h1>질문 게시판 제목</h1>
        {memberId !== userID && ( // userID와 memberId가 다를 때만 버튼을 표시
          <button
            onClick={handleLike}
            className={`flex items-center justify-center p-2 rounded-full text-xl ${
              isLiked ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"
            }`}
            style={{ width: "40px", height: "40px" }}
          >
            ❤️
          </button>
        )}
      </header>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {QuestionContent}
      </ReactMarkdown>
    </div>
  );
};

export default QuestionDetailMd;
