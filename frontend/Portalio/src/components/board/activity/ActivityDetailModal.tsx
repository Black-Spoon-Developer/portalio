import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { IoCloseOutline } from "react-icons/io5";
import { fetchDetailActivity } from "../../../api/ActivityAPI";
import "./ActivityDetailMd.css"; // markdown-viewer 스타일 적용

interface PortfolioDetailMdProps {
  activityId: number;
  onClose: () => void;
}

const ActivityDetailModal: React.FC<PortfolioDetailMdProps> = ({
  activityId,
  onClose,
}) => {
  const [activityContent, setActivityContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivityDetail = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetchDetailActivity(activityId);
        setActivityContent(response.activityContent);
      } catch (error) {
        setError("게시글을 불러오는 데 실패했습니다." + error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivityDetail();
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="markdown-viewer relative p-6 rounded-lg bg-white shadow-lg max-w-lg w-1/2 max-h-[80vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
        >
          <IoCloseOutline size={24} />
        </button>
        {isLoading ? (
          <p>로딩 중...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {activityContent}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
};

export default ActivityDetailModal;
