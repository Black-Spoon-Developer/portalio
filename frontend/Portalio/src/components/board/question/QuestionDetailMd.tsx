import React from "react";
import { useParams } from "react-router-dom";
import { boardDetailLike, patchSolveBoard } from "../../../api/BoardAPI";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  IoCheckmarkCircleOutline,
  IoCheckmarkCircleSharp,
} from "react-icons/io5";
import "./QuestionDetailMd.css";

interface QuestionDetailMdProps {
  QuestionContent: string;
  isLiked: boolean;
  memberId: number;
  solved: boolean;
  setUpdateDetailTrigger: React.Dispatch<React.SetStateAction<boolean>>;
}

const QuestionDetailMd: React.FC<QuestionDetailMdProps> = ({
  QuestionContent,
  isLiked,
  memberId,
  solved,
  setUpdateDetailTrigger,
}) => {
  const userID = parseInt(
    useSelector((state: RootState) => state.auth.memberId) ?? "0",
    10
  );

  const { question_id } = useParams<{ question_id: string }>();

  // 질문 게시글 좋아요 핸들러 함수
  const handleLike = async () => {
    if (!question_id) {
      alert("좋아요 처리 중 오류가 발생했습니다.");
      return;
    }

    try {
      await boardDetailLike(question_id);
      setUpdateDetailTrigger(true);
    } catch (error) {
      alert("좋아요 처리 중 오류가 발생했습니다." + error);
    }
  };

  // 질문 게시글 해결 처리 핸들러 함수
  const handleSolve = async () => {
    if (!question_id) {
      alert("질문 게시글 해결 처리 중 오류가 발생했습니다.");
      return;
    }
    try {
      await patchSolveBoard(question_id);
      setUpdateDetailTrigger(true);
    } catch (error) {
      alert("질문 게시글 해결 처리 중 오류가 발생했습니다." + error);
    }
  };

  return (
    <div className="markdown-viewer p-6 rounded-lg border-2 relative">
      <section className="flex justify-end">
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
        {/* userID와 memberId가 같을 때 해결 여부에 따라 버튼을 조건부로 표시 */}
        {memberId === userID &&
          (solved ? (
            <button onClick={handleSolve} className="flex items-center">
              <IoCheckmarkCircleSharp className="text-conceptSkyBlue mr-1 size-6" />
              <div className="font-bold">해 결</div>
            </button>
          ) : (
            <button onClick={handleSolve} className="flex items-center">
              <IoCheckmarkCircleOutline className="text-conceptGrey size-6 mr-1" />
              <div className="text-conceptGrey font-bold tracking-widest">
                미해결
              </div>
            </button>
          ))}
      </section>

      <header className="flex items-center">
        <h1>질문 게시판 제목</h1>
      </header>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {QuestionContent}
      </ReactMarkdown>
    </div>
  );
};

export default QuestionDetailMd;
