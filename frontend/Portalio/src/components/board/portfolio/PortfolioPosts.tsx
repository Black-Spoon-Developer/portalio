import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import PortfolioSearch from "./PortfolioSearch";
import { fetchMorePosts } from "../../../api/BoardAPI";

interface Post {
  id: number;
  memberId: number;
  authorNickname: string;
  authorPicture: string;
  time: string;
  portfolioContent: string;
  portfolioCommentCount: number;
  portfolioRecommendationCount: number;
  comments: number;
  created: string;
}

const PortfolioPosts: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [skip, setSkip] = useState(0);
  const limit = 10;

  useEffect(() => {
    // 초기 게시글 데이터를 로드합니다.
    loadMorePosts();
  }, []);

  const loadMorePosts = async () => {
    try {
      const newPosts = await fetchMorePosts(skip, limit);
      if (newPosts.length < limit) {
        setHasMore(false);
      }
      setPosts((prevPosts) => [...prevPosts, ...newPosts]);
      setSkip(skip + limit);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      setHasMore(false);
    }
  };

  // 게시글 클릭 시 상세 페이지로 이동
  const handlePostClick = (postId: number) => {
    navigate(`/posts/${postId}`);
  };

  const formatTime = (created: string) => {
    const createdDate = new Date(created);
    const now = new Date();
    const diffInSeconds = Math.floor(
      (now.getTime() - createdDate.getTime()) / 1000
    );

    if (diffInSeconds < 60) return `약 ${diffInSeconds}초 전`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `약 ${diffInMinutes}분 전`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `약 ${diffInHours}시간 전`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `약 ${diffInDays}일 전`;
  };

  return (
    <>
      <header>
        <PortfolioSearch />
      </header>

      <InfiniteScroll
        dataLength={posts.length}
        next={loadMorePosts}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={<p>더 이상 게시글이 없습니다.</p>}
      >
        <div className="grid grid-cols-1 gap-4 p-4">
          {posts.map((post) => (
            <div
              key={post.id}
              onClick={() => handlePostClick(post.id)}
              className="border rounded-lg p-4 shadow cursor-pointer hover:bg-gray-100"
            >
              <div className="flex items-center mb-2">
                <img
                  src={post.authorPicture || "https://via.placeholder.com/40"}
                  alt="프로필 이미지"
                  className="w-10 h-10 rounded-full mr-4"
                />
                <div>
                  <p className="font-semibold">{post.authorNickname}</p>
                  <p className="text-gray-500 text-sm">
                    {formatTime(post.created)}
                  </p>
                </div>
              </div>
              <div className="bg-gray-300 h-40 mb-2"></div>
              <p className="text-gray-700 mb-2">{post.portfolioContent}</p>
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
