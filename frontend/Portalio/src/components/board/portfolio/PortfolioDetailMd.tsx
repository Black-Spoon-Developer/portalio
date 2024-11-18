import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  portfolioDetailLike,
  setPrimaryPortfolio,
} from "../../../api/PortfolioAPI";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { Viewer } from "@toast-ui/react-editor";
import { useNavigate } from "react-router-dom";

interface PortfolioDetailMdProps {
  portfolioTitle: string;
  portfolioContent: string;
  isLiked: boolean;
  memberId: number;
  memberUsername: string;
  memberNickname: string;
  memberPicture: string;
  setUpdateDetailTrigger: React.Dispatch<React.SetStateAction<boolean>>;
  portfolioIsPrimary: boolean;
}

const PortfolioDetailMd: React.FC<PortfolioDetailMdProps> = ({
  portfolioTitle,
  portfolioContent,
  memberUsername,
  memberNickname,
  memberPicture,
  isLiked,
  memberId,
  setUpdateDetailTrigger,
  portfolioIsPrimary,
}) => {
  const navigate = useNavigate();
  const userID = parseInt(
    useSelector((state: RootState) => state.auth.memberId) ?? "0",
    10
  );
  const { portfolio_id } = useParams<{ portfolio_id: string }>();

  const [isSettingPrimary, setIsSettingPrimary] = useState(false); // 로딩 상태
  const [isPrimary, setIsPrimary] = useState(portfolioIsPrimary); // 초기 상태 설정
  console.log("PortfolioDetailMd.tsx: ", isPrimary);

  // 좋아요 처리 함수
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

  // 대표 설정 상태 토글 함수
  const handleTogglePrimaryPortfolio = async () => {
    if (!portfolio_id) {
      alert("포트폴리오 ID가 없습니다.");
      return;
    }

    setIsSettingPrimary(true); // 로딩 상태 활성화
    try {
      await setPrimaryPortfolio(Number(portfolio_id)); // API 호출로 상태 토글
      setIsPrimary((prev) => !prev); // 상태 반전
      setUpdateDetailTrigger(true); // 상세 정보 트리거 업데이트
    } catch (error) {
      console.error("대표 포트폴리오 설정 실패:", error);
      alert("대표 포트폴리오 설정에 실패했습니다.");
    } finally {
      setIsSettingPrimary(false); // 로딩 상태 비활성화
    }
  };

  const handleAuthorProfile = () => {
    navigate(`/users/profile/${memberUsername}`);
  };

  const handleEditPost = () => {
    navigate(`/portfolio/edit/${portfolio_id}`);
  };

  return (
    <div className="markdown-viewer p-6 rounded-lg border-2 relative">
      <section className="flex justify-between">
        <div className="flex items-center">
          <button onClick={handleAuthorProfile}>
            <img src={memberPicture} alt="" className="w-10 h-10 rounded-full" />
          </button>
          <div className="ml-4 font-bold">{memberNickname}</div>
        </div>
        {memberId === userID && (
          <div className="flex space-x-4 items-center">
            {/* 수정 버튼 */}
            <button
              onClick={handleEditPost}
              className="flex items-center px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-blue-100 font-bold"
            >
              ✏️ <span className="ml-2">수정</span>
            </button>

            {/* 대표 포트폴리오 버튼 */}
            <button
              onClick={handleTogglePrimaryPortfolio}
              className={`flex items-center px-4 py-2 rounded-lg font-bold ${
                isSettingPrimary
                  ? "bg-gray-400 cursor-not-allowed text-gray-600"
                  : isPrimary
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-gray-200 text-gray-800 hover:bg-blue-100"
              }`}
              disabled={isSettingPrimary}
              title={
                isPrimary
                  ? "현재 대표 포트폴리오입니다."
                  : "대표 포트폴리오로 설정"
              }
            >
              <span className="text-xl mr-2">{isPrimary ? "★" : "☆"}</span>
              {isPrimary ? "대표 포트폴리오" : "대표로 설정"}
            </button>
          </div>
        )}
        {memberId !== userID && (
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
