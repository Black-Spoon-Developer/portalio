import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import { PortfolioList } from "../../../interface/portfolio/PortfolioInterface";
import { fetchMoreActivity, activitySearch } from "../../../api/ActivityAPI";
import ActivitySearch from "./ActivitySearch";
import LoadingSkeleton from "../../spinner/LoadingSkeleton";

const ActivityPosts: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<PortfolioList[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [skip, setSkip] = useState(0);
  const limit = 10;
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    loadMorePosts();
  }, []);

  const loadMorePosts = async () => {
    try {
      if (isSearching) {
        // 검색 중일 때는 검색 API를 호출
        const response = await activitySearch(searchTerm);
        const newPosts = response.data.items;
        setPosts((prevPosts) => [...prevPosts, ...newPosts]);
        if (newPosts.length < limit) {
          setHasMore(false);
        }
      } else {
        // 검색 중이 아닐 때는 일반 게시글 불러오기
        const newPosts = await fetchMoreActivity(skip, limit);
        setPosts((prevPosts) => [...prevPosts, ...newPosts]);
        if (newPosts.length < limit) {
          setHasMore(false);
        }
      }
      setSkip(skip + limit);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      setHasMore(false);
    }
  };

  // 검색 요청 처리
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setIsSearching(true); // 검색 중 상태로 설정
    setSkip(0); // 무한 스크롤의 skip 값 초기화
    setPosts([]); // 기존 게시글 초기화 후 새로운 검색 결과로 설정
    setHasMore(true); // 무한 스크롤 활성화
    loadMorePosts(); // 검색 API 요청
  };

  // 전체글 조회 요청 처리
  const handleReset = () => {
    setSearchTerm("");
    setIsSearching(false); // 검색 상태 해제
    setSkip(0);
    setPosts([]);
    setHasMore(true);
    loadMorePosts();
  };

  const handlePostClick = (postId: number) => navigate(`/portfolio/${postId}`);

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
        <ActivitySearch onSearch={handleSearch} onReset={handleReset} />
      </header>

      <InfiniteScroll
        dataLength={posts.length}
        next={loadMorePosts}
        hasMore={hasMore}
        loader={<LoadingSkeleton />}
        endMessage={<p>더 이상 게시글이 없습니다.</p>}
      >
        <div className="grid grid-cols-1 gap-4 p-4">
          {posts.map((post) => (
            <div
              key={post.portfolioId}
              onClick={() => handlePostClick(post.portfolioId)}
              className="border rounded-lg p-4 shadow cursor-pointer hover:bg-gray-100"
            >
              <div className="flex items-center mb-2">
                {/* 이 부분 수정해야함 */}
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
              <img
                src={post.portfolioThumbnailImg}
                alt="no-image"
                className="bg-gray-300 h-40 mb-2"
              />
              <p className="text-gray-700 mb-2">{post.portfolioContent}</p>
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </>
  );
};

export default ActivityPosts;
