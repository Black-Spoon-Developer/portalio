import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { postPortfolioDetailComment } from "../../../api/PortfolioAPI";

interface PortfolioDetailCommentsInputProps {
  setUpdateCommentTrigger: React.Dispatch<React.SetStateAction<boolean>>;
}

const PortfolioDetailCommentsInput: React.FC<
  PortfolioDetailCommentsInputProps
> = ({ setUpdateCommentTrigger }) => {
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const { portfolio_id } = useParams<{ portfolio_id: string }>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() && portfolio_id) {
      try {
        // 댓글 작성 API 호출
        await postPortfolioDetailComment(portfolio_id, content);
        setContent(""); // 제출 후 입력창 초기화
        setUpdateCommentTrigger(true);
      } catch (error) {
        console.error("댓글 작성에 실패했습니다:", error);
        alert("댓글 작성에 실패했습니다.");
        navigate(0);
      }
    } else {
      alert("댓글 내용을 입력해주세요.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="my-4 border-2 rounded-lg shadow-md p-4"
    >
      <header className="mb-4 text-xl font-bold">댓글 작성창</header>
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="댓글을 작성하세요."
        className="flex-grow p-2 border rounded-lg mr-2"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600"
      >
        작성
      </button>
    </form>
  );
};

export default PortfolioDetailCommentsInput;
