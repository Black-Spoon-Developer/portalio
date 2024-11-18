import React, { useState, useEffect } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { fetchDetailActivity } from "../../../api/ActivityAPI";
import { ActivityDetail } from "../../../interface/activity/ActivityInterface";
import LoadingSkeleton from "../../spinner/LoadingSkeleton";
import { Viewer } from "@toast-ui/react-editor";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

interface ActivityDetailMdProps {
  activityId: number;
  onClose: () => void;
}

const ActivityDetailModal: React.FC<ActivityDetailMdProps> = ({
  activityId,
  onClose,
}) => {
  const navigate = useNavigate();
  const [activityDetailInfo, setActivityDetailInfo] =
    useState<ActivityDetail>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userID = Number(useSelector((state: RootState) => state.auth.memberId));

  useEffect(() => {
    const fetchActivityDetail = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetchDetailActivity(activityId);
        setActivityDetailInfo(response);
      } catch (error) {
        setError("게시글을 불러오는 데 실패했습니다." + error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivityDetail();
  }, []);

  // 작성자 사진 누르면 작성자의 프로필 페이지로 이동
  const handleAuthorProfile = () => {
    navigate(`/users/profile/${activityDetailInfo?.memberUsername}`);
  };

  // 글 수정 버튼을 누르면 수정 페이지로 이동
  const handleEditPost = () => {
    navigate(
      `/activity/edit/${activityDetailInfo?.repositoryId}/${activityDetailInfo?.activityBoardId}`
    );
  };

  return (
    <>
      <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
        <div className="relative w-1/2">
          {/* 작성자 정보를 viewer 바로 위에 배치 */}
          <header className="flex justify-between items-center">
            <section className="flex items-center mb-4">
              <button onClick={handleAuthorProfile}>
                <img
                  src={activityDetailInfo?.picture}
                  alt="no-image"
                  className="mr-3 rounded-full size-10"
                />
              </button>
              <div className="font-bold text-white">
                {activityDetailInfo?.memberNickname}님의 활동 게시글
              </div>
            </section>
            <section>
              {userID === activityDetailInfo?.memberId && (
                <button
                  onClick={handleEditPost}
                  className="font-bold text-md mr-2 text-white hover:text-conceptSkyBlue"
                >
                  ✏️ 수정
                </button>
              )}
            </section>
          </header>

          <section
            className="markdown-viewer p-6 rounded-lg bg-white shadow-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            style={{ minWidth: "672px", minHeight: "550px" }}
          >
            <button
              onClick={onClose}
              className="absolute right-10 text-gray-600 hover:text-gray-800"
            >
              <IoCloseOutline size={24} />
            </button>
            {isLoading ? (
              <LoadingSkeleton />
            ) : error ? (
              <p>{error}</p>
            ) : (
              <div>
                <header className="text-2xl font-bold border-b-2 p-2">
                  {activityDetailInfo?.activityBoardTitle}
                </header>
                <Viewer
                  initialValue={activityDetailInfo?.activityBoardContent}
                  key={activityDetailInfo?.activityBoardContent}
                />
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
};

export default ActivityDetailModal;
