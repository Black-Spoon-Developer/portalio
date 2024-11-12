import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import { ActivityList } from "../../../interface/activity/ActivityInterface";
import { fetchMoreActivity, activitySearch } from "../../../api/ActivityAPI";
import ActivitySearch from "./ActivitySearch";
import LoadingSkeleton from "../../spinner/LoadingSkeleton";
import ActivityDetailModal from "./ActivityDetailModal";

const ActivityPosts: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<ActivityList[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [skip, setSkip] = useState(0);
  const limit = 10;
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isSearching, setIsSearching] = useState(false);

  // 모달 상태와 선택된 게시물 데이터 관리
  const [selectedPost, setSelectedPost] = useState<ActivityList | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadMorePosts();
  }, []);

  const loadMorePosts = async () => {
    try {
      if (isSearching) {
        const response = await activitySearch(searchTerm);
        const newPosts = response.data.items;
        setPosts((prevPosts) =>
          skip === 0 ? newPosts : [...prevPosts, ...newPosts]
        );
        if (newPosts.length < limit) {
          setHasMore(false);
        }
      } else {
        const newPosts = await fetchMoreActivity(skip, limit);
        setPosts((prevPosts) =>
          skip === 0 ? newPosts : [...prevPosts, ...newPosts]
        );
        if (newPosts.length < limit) {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      setHasMore(false);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setIsSearching(true);
    setSkip(0);
    setPosts([]);
    setHasMore(true);
    loadMorePosts();
  };

  const handleReset = () => {
    setSearchTerm("");
    setIsSearching(false);
    setSkip(0);
    setPosts([]);
    setHasMore(true);
    loadMorePosts();
  };

  // 게시물 클릭 시 모달을 열고 해당 게시물을 선택
  const handlePostClick = (post: ActivityList) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  // 모달 닫기 함수
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

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
              key={post.activityBoardId}
              onClick={() => handlePostClick(post)}
              className="border rounded-lg p-4 shadow cursor-pointer hover:bg-gray-100"
            >
              <div className="flex items-center mb-2">
                <img
                  src={post.activityBoardImageKey}
                  alt="프로필 이미지"
                  className="w-10 h-10 rounded-full mr-4"
                />
                <div>
                  <p className="font-semibold">{post.activityBoardContent}</p>
                  <p className="text-gray-500 text-sm">
                    {formatTimeAgo(post.activityBoardDate)}
                  </p>
                </div>
              </div>
              <img
                src={post.activityBoardImageKey}
                alt="no-image"
                className="bg-gray-300 h-40 mb-2"
              />
              <p className="text-gray-700 mb-2">{post.activityBoardTitle}</p>
            </div>
          ))}
        </div>
      </InfiniteScroll>

      {isModalOpen && selectedPost && (
        <ActivityDetailModal
          activityContent={selectedPost.activityBoardContent}
          isLiked={false}
          onClose={closeModal} // 모달 닫기 함수 전달
        />
      )}
    </>
  );
};

export default ActivityPosts;
