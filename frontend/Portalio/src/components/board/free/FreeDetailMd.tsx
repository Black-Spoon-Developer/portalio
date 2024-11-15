import React from "react";
import { useParams } from "react-router-dom";
import { boardDetailLike } from "../../../api/BoardAPI";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { Viewer } from "@toast-ui/react-editor";

interface FreeDetailMdProps {
  FreeContent: string;
  isLiked: boolean;
  memberId: number;
  setUpdateDetailTrigger: React.Dispatch<React.SetStateAction<boolean>>;
}

const FreeDetailMd: React.FC<FreeDetailMdProps> = ({
  FreeContent,
  isLiked,
  memberId,
  setUpdateDetailTrigger,
}) => {
  const userID = parseInt(
    useSelector((state: RootState) => state.auth.memberId) ?? "0",
    10
  );

  const { free_id } = useParams<{ free_id: string }>();

  // 좋아요 핸들러 함수
  const handleLike = async () => {
    if (!free_id) {
      alert("포트폴리오 ID가 없습니다.");
      return;
    }

    try {
      await boardDetailLike(free_id);
      setUpdateDetailTrigger(true);
    } catch (error) {
      alert("좋아요 처리 중 오류가 발생했습니다." + error);
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
      </section>
      <header className="flex justify-between items-center">
        <h1>자유 게시판 제목</h1>
      </header>
      <Viewer initialValue={FreeContent} key={FreeContent} />
    </div>
  );
};

export default FreeDetailMd;
