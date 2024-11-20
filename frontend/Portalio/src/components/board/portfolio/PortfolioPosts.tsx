import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import PortfolioSearch from "./PortfolioSearch";
import { fetchMorePosts, portfolioSearch } from "../../../api/PortfolioAPI";
import { Portfolio } from "../../../interface/portfolio/PortfolioInterface";
import LoadingSkeleton from "../../spinner/LoadingSkeleton";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { userTicketUpdate } from "../../../api/TicketAPI";

const PortfolioPosts: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Portfolio[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [skip, setSkip] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const limit = 10;

  // 리셋 트리거 상태
  const [resetTriggered, setResetTriggered] = useState(false);

  // 유저 ID 값 가져오기
  const userID = Number(useSelector((state: RootState) => state.auth.memberId));

  // 유저 티켓 값 가져오기
  const ticket = Number(
    useSelector((state: RootState) => state.auth.memberTicket)
  );

  // onMounted 할때 초기 게시글 불러오기
  useEffect(() => {
    loadMorePosts();
  }, []);

  // 리셋 트리거
  useEffect(() => {
    // 검색 상태가 아닌 경우 초기 전체 데이터 로드
    if (!isSearching && resetTriggered) {
      loadMorePosts();
      setResetTriggered(false);
    }
  }, [resetTriggered]);

  // 게시글 리스트 조회 메서드
  const loadMorePosts = async () => {
    try {
      if (!isSearching) {
        // 검색 중이 아닐 때는 일반 게시글 불러오기
        const newPosts = await fetchMorePosts(skip, limit);
        console.log(newPosts);
        setPosts((prevPosts) => [...prevPosts, ...newPosts]);
        if (newPosts.length < limit) {
          setHasMore(false);
        }
        setSkip(skip + limit);
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      setHasMore(false);
    }
  };

  // 검색 요청 처리
  const handleSearch = async (term: string, subCategory: number | null) => {
    setIsSearching(true); // 검색 중 상태로 설정
    setSkip(0); // 무한 스크롤의 skip 값 초기화
    setPosts([]); // 기존 게시글 초기화 후 새로운 검색 결과로 설정
    setHasMore(true); // 무한 스크롤 활성화
    try {
      const searchResults = await portfolioSearch(term, subCategory || 0);
      setPosts(searchResults);
    } catch (error) {
      console.error("Failed to search posts:", error);
    }
  };

  // 리셋으로 전체글 조회로 변경
  const handleReset = () => {
    setIsSearching(false); // 검색 상태 해제
    setSkip(0);
    setPosts([]);
    setHasMore(true);
    setResetTriggered(true);
  };

  // 상세 조회 핸들러 함수
  const handlePostClick = async (postId: number, memberId: number) => {
    // 멤버 ID가 없거나 즉, 로그인이 안됐거나 티켓이 없으면 리다이렉트하기
    if (!userID || !ticket) {
      alert("로그인을 해주세요!");
      navigate("/users/login");
    }

    if (ticket < 1) {
      alert("티켓이 부족합니다!");
      return;
    }

    // 내가 글 작성자라면 티켓 차감없이 상세 보기 가능
    if (memberId === userID) {
      navigate(`/portfolio/${postId}`);
    } else {
      const response = await userTicketUpdate(-1);
      // 티켓값이 충분하면 이동
      if (response) {
        navigate(`/portfolio/${postId}`);
      }
    }
  };

  // 시간 형식 변환 함수
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `약 ${diffInSeconds}초 전`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `약 ${diffInMinutes}분 전`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `약 ${diffInHours}시간 전`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `약 ${diffInDays}일 전`;
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) return `약 ${diffInMonths}달 전`;
    const diffInYears = Math.floor(diffInMonths / 12);
    return `약 ${diffInYears}년 전`;
  };

  return (
    <>
      <header>
        <PortfolioSearch onSearch={handleSearch} onReset={handleReset} />
      </header>

      <InfiniteScroll
        dataLength={posts.length}
        next={loadMorePosts}
        hasMore={!isSearching && hasMore}
        loader={<LoadingSkeleton />}
        endMessage={<p>더 이상 게시글이 없습니다.</p>}
      >
        <div className="grid grid-cols-2 gap-4 p-4">
          {posts.map((post) => (
            <div
              key={post.portfolioId}
              onClick={() => handlePostClick(post.portfolioId, post.memberId)}
              className="border rounded-lg p-4 shadow cursor-pointer hover:bg-gray-100"
            >
              <div className="flex items-center mb-4">
                <img
                  src={post.picture}
                  alt="프로필 이미지"
                  className="w-10 h-10 rounded-full mr-4"
                />
                <div>
                  <p className="font-semibold">{post.memberNickname}</p>
                  <p className="text-gray-500 text-sm">
                    {formatTimeAgo(post.created)}
                  </p>
                </div>
              </div>
              <div className="h-80">
                <img
                  src={post.portfolioThumbnailImg}
                  alt="no-image"
                  className="bg-gray-300 mb-2 w-full h-full object-cover"
                />
              </div>
              <p className="text-gray-700 mb-4 line-clamp-3">
                {post.portfolioTitle}
                {post.portfolioDescription}
              </p>
              <div className="flex justify-evenly text-gray-500 text-sm">
                <div className="text-lg tracking-widest">
                  💬 {post.portfolioCommentCount}
                </div>
                <div className="text-lg tracking-widest">
                  ❤️ {post.portfolioRecommendationCount}
                </div>
              </div>
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </>
  );
};

export default PortfolioPosts;
