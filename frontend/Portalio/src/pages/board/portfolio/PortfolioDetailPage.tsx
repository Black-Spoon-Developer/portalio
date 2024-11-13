import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PortfolioDetailMd from "../../../components/board/portfolio/PortfolioDetailMd";
import PortfolioDetailComments from "../../../components/board/portfolio/PortfolioDetailComments";
import SideNavBar from "../../../components/common/navBar/SideNavBar";
import PortfolioDetailCommentsInput from "../../../components/board/portfolio/PortfolioDetailCommentsInput";
import PortfolioDetailPdf from "../../../components/board/portfolio/PortfolioDetailPdf";
import {
  fetchPortfolioDetail,
  fetchPortfolioDetailComments,
} from "../../../api/PortfolioAPI";
import { Portfolio } from "../../../interface/portfolio/PortfolioInterface";

const PortfolioDetailPage: React.FC = () => {
  const { portfolio_id } = useParams<{ portfolio_id: string }>();
  const [portfolioContent, setPortfolioContent] = useState<string>("");
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [memberId, setMemberId] = useState<number>(0);

  // 댓글 목록 업데이트 하는 트리거 상태
  const [updateCommentTrigger, setUpdateCommentTrigger] = useState(false);

  // 댓글 내용 prop 해주기 위한 상태
  const [comments, setComments] = useState<Portfolio[]>([]);

  // 좋아요 시 상세 정보를 트리거 하기 위한 상태
  const [updateDetailTrigger, setUpdateDetailTrigger] = useState(false);

  // onMounted를 했을 때 포트폴리오 상세 및 상세 글에 대한 댓글 조회
  useEffect(() => {
    fetchPortfolioInfo();
  }, []);

  // 포트폴리오 상세 조회
  const fetchPortfolioInfo = async () => {
    try {
      if (portfolio_id) {
        const response = await fetchPortfolioDetail(portfolio_id);
        setPortfolioContent(response.portfolioContent);
        setIsLiked(response.isLiked);
        setMemberId(response.memberId);
      }
    } catch (error) {
      alert("글 조회를 실패했습니다.: " + error);
    }
  };

  // 댓글 정보 조회
  const fetchComments = async () => {
    try {
      if (portfolio_id) {
        const response = await 
      }
    } catch () {

    }
  } 

  return (
    <div className="grid grid-cols-5 min-h-screen">
      <div className="fixed top-48 left-0 h-full">
        <SideNavBar />
      </div>
      <div className="col-span-1"></div>
      <div className="mx-5 my-8 col-span-3">
        <PortfolioDetailMd
          portfolioContent={portfolioContent}
          isLiked={isLiked}
          memberId={memberId}
        />
        <PortfolioDetailCommentsInput />
        <PortfolioDetailComments />
      </div>
      <div className="col-span-1">
        <PortfolioDetailPdf portfolioContent={portfolioContent} />
      </div>
    </div>
  );
};

export default PortfolioDetailPage;
