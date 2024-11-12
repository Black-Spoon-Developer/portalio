import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { ActivityList } from "../../../interface/activity/ActivityInterface";
import { fetchMoreActivity, activitySearch } from "../../../api/ActivityAPI";
import ActivitySearch from "./ActivitySearch";
import LoadingSkeleton from "../../spinner/LoadingSkeleton";
import ActivityDetailModal from "./ActivityDetailModal";

const ActivityPosts: React.FC = () => {
  const [posts, setPosts] = useState<ActivityList[]>([]);
  const [hasMore, setHasMore] = useState(true); // 무한 스크롤 여부
  const limit = 10; // 무한 스크롤에서 사용할 제한 수
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isSearching, setIsSearching] = useState(false); // 검색 상태 여부

  // 모달 상태와 선택된 게시물 ID 관리
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // 검색 상태가 아닌 경우 초기 전체 데이터 로드
    if (!isSearching) {
      loadMorePosts();
    }
  }, []);

  // 활동 게시글 리스트 조회 메서드 (무한 스크롤)
  const loadMorePosts = async () => {
    try {
      const newPosts = await fetchMoreActivity(posts.length, limit);
      setPosts((prevPosts) => [...prevPosts, ...newPosts]);
      setHasMore(newPosts.length === limit); // 더 이상 가져올 데이터가 없을 때 false
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      setHasMore(false);
    }
  };

  // 검색 처리 핸들러
  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    setIsSearching(true); // 검색 상태 활성화
    setHasMore(false);
    try {
      const searchResults = await activitySearch(term);
      console.log(searchResults);
      setPosts(searchResults); // 검색 결과로 posts를 업데이트하고 기존 데이터를 초기화
    } catch (error) {
      console.error("Failed to search posts:", error);
    }
  };

  // 검색 초기화 및 전체 게시물 조회 핸들러
  const handleReset = () => {
    setSearchTerm("");
    setIsSearching(false); // 검색 상태 해제
    setPosts([]); // posts 초기화
    setHasMore(true); // 무한 스크롤 다시 활성화
  };

  // 게시물 클릭 시 모달을 열고 게시물 ID를 선택
  const handlePostClick = (postId: number) => {
    setSelectedPostId(postId);
    setIsModalOpen(true);
  };

  // 모달 닫기 함수
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPostId(null);
  };

  // 시간 표시 포맷 함수
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
        hasMore={!isSearching && hasMore} // 검색 상태에서는 무한 스크롤 비활성화
        loader={<LoadingSkeleton />}
        endMessage={<p>더 이상 게시글이 없습니다.</p>}
      >
        <div className="grid grid-cols-1 gap-4 p-4">
          {posts.map((post) => (
            <div
              key={post.activityBoardId}
              onClick={() => handlePostClick(post.activityBoardId)}
              className="border rounded-lg p-4 shadow cursor-pointer hover:bg-gray-100"
            >
              <div className="flex items-center mb-2">
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
              <p className="text-gray-700 mb-2 font-bold text-3xl">
                {post.activityBoardTitle}
              </p>
            </div>
          ))}
        </div>
      </InfiniteScroll>

      {isModalOpen && selectedPostId && (
        <ActivityDetailModal activityId={selectedPostId} onClose={closeModal} />
      )}
    </>
  );
};

export default ActivityPosts;
