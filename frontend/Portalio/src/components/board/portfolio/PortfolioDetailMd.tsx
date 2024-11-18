import React from "react";
import { useParams } from "react-router-dom";
import { portfolioDetailLike } from "../../../api/PortfolioAPI";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { Viewer } from "@toast-ui/react-editor";
import { useNavigate } from "react-router-dom";

interface PortfolioDetailMdProps {
  portfolioTitle: string;
  portfolioContent: string;
  isLiked: boolean;
  memberId: number;
  memberNickname: string;
  memberPicture: string;
  setUpdateDetailTrigger: React.Dispatch<React.SetStateAction<boolean>>;
}

const PortfolioDetailMd: React.FC<PortfolioDetailMdProps> = ({
  portfolioTitle,
  portfolioContent,
  memberNickname,
  memberPicture,
  isLiked,
  memberId,
  setUpdateDetailTrigger,
}) => {
  const navigate = useNavigate();
  const userID = parseInt(
    useSelector((state: RootState) => state.auth.memberId) ?? "0",
    10
  );
  const { portfolio_id } = useParams<{ portfolio_id: string }>();

  const handleLike = async () => {
    if (!portfolio_id) {
      alert("포트폴리오 ID가 없습니다.");
      return;
    }

    try {
      await portfolioDetailLike(portfolio_id);
      setUpdateDetailTrigger(true);
    } catch (error) {
      alert("좋아요 처리 중 오류가 발생했습니다." + error);
    }
  };

  // 작성자 사진 누르면 작성자의 프로필 페이지로 이동
  const handleAuthorProfile = () => {
    navigate(`/users/profile/${userID}`);
  };

  // 글 수정 버튼을 누르면 수정 페이지로 이동
  const handleEditPost = () => {
    navigate(`/portfolio/edit/${portfolio_id}`);
  };

  return (
    <div className="markdown-viewer p-6 rounded-lg border-2 relative">
      <section className="flex justify-between">
        <div className="flex items-center">
          <button onClick={handleAuthorProfile}>
            <img src={memberPicture} alt="" className="w-10 h-10 size-12 rounded-full" />
          </button>
          <div className="ml-4 font-bold">{memberNickname}</div>
        </div>
        {memberId === userID && (
          <button
            onClick={handleEditPost}
            className="font-bold text-lg hover:text-conceptSkyBlue"
          >
            ✏️ 수정
          </button>
        )}
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
        <h1>{portfolioTitle}</h1>
      </header>
      <Viewer initialValue={portfolioContent} key={portfolioContent} />
    </div>
  );
};

export default PortfolioDetailMd;
