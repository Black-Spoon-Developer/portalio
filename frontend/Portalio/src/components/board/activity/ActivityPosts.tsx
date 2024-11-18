import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { ActivityList } from "../../../interface/activity/ActivityInterface";
import { fetchMoreActivity, activitySearch } from "../../../api/ActivityAPI";
import ActivitySearch from "./ActivitySearch";
import LoadingSkeleton from "../../spinner/LoadingSkeleton";
import ActivityDetailModal from "./ActivityDetailModal";

const ActivityPosts: React.FC = () => {
  // 게시글 상태
  const [posts, setPosts] = useState<ActivityList[]>([]);
  // 무한 스크롤 여부
  const [hasMore, setHasMore] = useState(true);
  // 시작점 상태
  const [skip, setSkip] = useState(0);
  // 검색 상태 여부
  const [isSearching, setIsSearching] = useState(false);
  // 무한 스크롤에서 사용할 제한 수
  const limit = 10;

  // 모달 상태와 선택된 게시물 ID 관리
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 리셋 트리거 상태
  const [resetTriggered, setResetTriggered] = useState(false);

  // onMounted 트리거
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

  // 활동 게시글 리스트 조회 메서드 (무한 스크롤) - 검색 상태가 아닐 경우
  const loadMorePosts = async () => {
    try {
      const newPosts = await fetchMoreActivity(posts.length, limit);

      // page를 나누지 않고 기본 틀에서 컴포넌트만 바꿔줘야 하는 로직을 작성했으므로
      // useEffect가 자주 발생하게 되어 이를 방지하고자 onMounted시 상태가 초기화 되는것을 노려서 처음에 불러오는 값이 중첩이 안되도록 구현함.
      if (skip === 0) {
        setPosts(newPosts);
      } else {
        setPosts((prevPosts) => [...prevPosts, ...newPosts]);
      }

      if (newPosts.length < limit) {
        setHasMore(false);
      }
      setSkip(skip + limit);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      setHasMore(false);
    }
  };

  // 검색 처리 핸들러
  const handleSearch = async (term: string) => {
    setIsSearching(true); // 검색 상태 활성화
    setHasMore(false);
    setPosts([]);
    try {
      const searchResults = await activitySearch(term);
      console.log(searchResults);
      setPosts(searchResults);
    } catch (error) {
      console.error("Failed to search posts:", error);
    }
  };

  // 검색 초기화 및 전체 게시물 조회 핸들러
  const handleReset = () => {
    setIsSearching(false); // 검색 상태 해제
    setSkip(0); // 시작점 초기화
    setPosts([]); // posts 초기화
    setHasMore(true); // 무한 스크롤 다시 활성화
    setResetTriggered(true); // 리셋 트리거 작동
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
        <ActivitySearch onSearch={handleSearch} onReset={handleReset} />
      </header>

      <InfiniteScroll
        dataLength={posts.length}
        next={loadMorePosts}
        hasMore={!isSearching && hasMore} // 검색 상태에서는 무한 스크롤 비활성화
        loader={<LoadingSkeleton />}
        endMessage={<p>더 이상 게시글이 없습니다.</p>}
      >
        <div className="grid grid-cols-2 gap-4 p-4">
          {posts.map((post) => (
            <div
              key={post.activityBoardId}
              onClick={() => handlePostClick(post.activityBoardId)}
              className="border rounded-lg p-4 shadow cursor-pointer hover:bg-gray-100"
            >
              <div className="flex items-center mb-5">
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
