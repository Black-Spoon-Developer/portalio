import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import SettingsIcon from "../../assets/Setting.svg";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { getMyPortfolios } from "../../api/PortfolioAPI";
import { getProfilePicture } from "../../api/MemberAPI";

interface Portfolio {
  created: Date;
  portfolioId: number;
  portfolioTitle: string;
  portfolioDescription: string;
  portfolioIsPrimary: boolean;
  portfolioCommentCount: number;
  portfolioThumbnailImg: string;
  memberId: number;
  memberNickname: string;
}

const PrimaryPortfolio: React.FC = () => {
  const [picture, setPicture] = useState();

  const { username } = useParams<{ username: string }>();


  // 설정 버튼 제어 변수
  const memberUsername = useSelector((state: RootState) => state.auth.memberUsername);
  const isOwner = username && memberUsername ? username === memberUsername : false;

  const [portfolio, setPortfolio] = useState<Portfolio>();

  useEffect(() => {
    // 대표 레포지토리 조회 함수
    const getPrimaryPortfolio = async () => {
      if (username) {
        const portfoliosResponse = await getMyPortfolios(
          username,
          0,
          100
        );

        const primaryPortfolio = portfoliosResponse.data.items.find(
          (item: Portfolio) => item.portfolioIsPrimary == true
        );
        setPortfolio(primaryPortfolio);
      } else {
        alert("대표 포트폴리오 조회 에러 발생!");
      }
    };

    getPrimaryPortfolio();
  }, []);

  // 유저 사진 조회 함수
  useEffect(() => {
    const fetchUserPicture = async () => {
      if (username) {
        const data = await getProfilePicture(username);
        setPicture(data.memberPicture);
      }
    };

    fetchUserPicture();
  }, [username]);

  return (
    <div className="border border-gray-300 rounded-lg">
      {/* header */}
      <header className="flex justify-between p-4">
        <h2 className="font-bold text-2xl">대표 포트폴리오</h2>
        <div className="flex items-center">
          {isOwner ? (
            <Link to={`/users/profile/${username}/portfolio`} className="flex">
              <img
                src={SettingsIcon}
                alt="포트폴리오 관리"
                className="w-6 h-6 mx-2"
              />
              <div>포트폴리오 관리</div>
            </Link>
          ) : (
            <></>
          )}
        </div>
      </header>
      {/* portfolio */}
      {portfolio && (
        <div className="block min-h-[192px]">
          <Link
            to={`/portfolio/${portfolio.portfolioId}`}
            className="flex items-start w-full px-2 py-2"
          >
            <div className="flex items-center">
              <img
                src={portfolio.portfolioThumbnailImg || "기본 이미지 URL"} // 썸네일 이미지 URL 설정
                alt="대표 포트폴리오 썸네일"
                className="w-48 h-48 rounded-md mr-4" // 이미지 크기 및 여백 설정
              />
            </div>
            <div className="flex flex-col w-full justify-between min-h-[192px]">
              <span className="text-xl font-bold mb-3 p-1">
                {portfolio.portfolioTitle}
              </span>
              <span className="text-sm line-clamp-3 p-2">
                {portfolio.portfolioDescription}
              </span>
              <div className="text-sm text-gray-500 mt-auto self-end">
                {portfolio.portfolioCommentCount}개의 댓글 ·{" "}
                {new Date(portfolio.created)
                  .toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })
                  .replace(/\.$/, "")}
              </div>
            </div>
          </Link>
          {/* Nickname */}
          <div className="border-t border-gray-300 py-2 text-right">
            <Link to={`/users/profile/${username}`}>
              <div className="py-2 px-2 flex items-center justify-end space-x-2">
                <img
                  src={picture || ""}
                  alt="profile"
                  className="w-10 h-10 rounded-full"
                />
                <span className="text-gray-500">by</span>
                <span className="text-black font-bold">
                  {portfolio.memberNickname}
                </span>
              </div>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrimaryPortfolio;
