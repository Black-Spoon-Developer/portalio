import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { IoCloseOutline } from "react-icons/io5";
import { fetchDetailActivity } from "../../../api/ActivityAPI";
import "./ActivityDetailMd.css"; // markdown-viewer 스타일 적용
import { ActivityDetail } from "../../../interface/activity/ActivityInterface";
import LoadingSkeleton from "../../spinner/LoadingSkeleton";

interface ActivityDetailMdProps {
  activityId: number;
  onClose: () => void;
}

const ActivityDetailModal: React.FC<ActivityDetailMdProps> = ({
  activityId,
  onClose,
}) => {
  const [activityDetailInfo, setActivityDetailInfo] =
    useState<ActivityDetail>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <>
      <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
        <div className="relative w-1/2">
          {/* 작성자 정보를 viewer 바로 위에 배치 */}
          <section className="flex items-center mb-4">
            <img
              src={activityDetailInfo?.picture}
              alt="no-image"
              className="mr-3 rounded-full size-10"
            />
            <div className="font-bold text-white">
              {activityDetailInfo?.memberNickname}님의 활동 게시글
            </div>
          </section>

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
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {activityDetailInfo?.activityBoardContent}
                </ReactMarkdown>
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
};

export default ActivityDetailModal;
