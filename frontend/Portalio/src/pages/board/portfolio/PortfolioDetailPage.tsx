import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PortfolioDetailMd from "../../../components/board/portfolio/PortfolioDetailMd";
import PortfolioDetailComments from "../../../components/board/portfolio/PortfolioDetailComments";
import SideNavBar from "../../../components/common/navBar/SideNavBar";
import PortfolioDetailCommentsInput from "../../../components/board/portfolio/PortfolioDetailCommentsInput";
import {
  fetchPortfolioDetail,
  fetchPortfolioDetailComments,
} from "../../../api/PortfolioAPI";
import {
  Portfolio,
  PortfolioCommetsResponse,
} from "../../../interface/portfolio/PortfolioInterface";

const PortfolioDetailPage: React.FC = () => {
  const { portfolio_id } = useParams<{ portfolio_id: string }>();
  const [portfolio, setPortfolio] = useState<Portfolio>();

  // 댓글 목록 업데이트 하는 트리거 상태
  const [updateCommentTrigger, setUpdateCommentTrigger] = useState(false);

  // 댓글 내용 prop 해주기 위한 상태
  const [comments, setComments] = useState<PortfolioCommetsResponse[]>([]);

  // 좋아요 시 상세 정보를 트리거 하기 위한 상태
  const [updateDetailTrigger, setUpdateDetailTrigger] = useState(false);

  // onMounted를 했을 때 포트폴리오 상세 및 상세 글에 대한 댓글 조회
  useEffect(() => {
    fetchPortfolioInfo();
    fetchComments();
  }, []);

  // 댓글 작성시 댓글 목록을 업데이트 하는 함수
  useEffect(() => {
    if (updateCommentTrigger) {
      fetchComments();
      setUpdateCommentTrigger(false);
    }
  }, [updateCommentTrigger]);

  // 좋아요를 눌렀을 시 새로 상세 정보를 가져오기 위한 함수
  useEffect(() => {
    if (updateDetailTrigger) {
      fetchPortfolioInfo();
      setUpdateDetailTrigger(false);
    }
  }, [updateDetailTrigger]);

  // 포트폴리오 상세 조회
  const fetchPortfolioInfo = async () => {
    try {
      if (portfolio_id) {
        const response = await fetchPortfolioDetail(portfolio_id);
        setPortfolio(response);
        console.log("PortfolioDetaiPage.tsx: ", response.portfolioIsPrimary);
      }
    } catch (error) {
      alert("글 조회를 실패했습니다.: " + error);
    }
  };

  // 댓글 정보 조회
  const fetchComments = async () => {
    try {
      if (portfolio_id) {
        const response = await fetchPortfolioDetailComments(portfolio_id);
        setComments(response);
      }
    } catch (error) {
      alert("댓글 조회를 실패했습니다" + error);
    }
  };

  return (
    <div className="grid grid-cols-5 min-h-screen">
      <div className="fixed top-48 left-0 h-full">
        <SideNavBar />
      </div>
      <div className="col-span-1"></div>
      <div className="mx-5 my-8 col-span-3">
        {portfolio ? (
          <>
            <PortfolioDetailMd
              portfolioTitle={portfolio.portfolioTitle}
              portfolioContent={portfolio.portfolioContent}
              memberNickname={portfolio.memberNickname}
              memberUsername={portfolio.memberUsername}
              memberPicture={portfolio.picture}
              isLiked={portfolio.isLiked}
              memberId={portfolio.memberId}
              setUpdateDetailTrigger={setUpdateDetailTrigger}
              portfolioIsPrimary={portfolio.portfolioIsPrimary}
            />
            <PortfolioDetailCommentsInput
              setUpdateCommentTrigger={setUpdateCommentTrigger}
            />
            <PortfolioDetailComments comments={comments} />
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <div className="col-span-1"></div>
    </div>
  );
};

export default PortfolioDetailPage;
