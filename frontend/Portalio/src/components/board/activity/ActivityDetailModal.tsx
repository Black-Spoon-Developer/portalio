import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { IoCloseOutline } from "react-icons/io5";
import "./ActivityDetailMd.css";

interface PortfolioDetailMdProps {
  activityContent: string;
  isLiked: boolean;

  onClose: () => void; // 모달 닫기 함수
}

const ActivityDetailModal: React.FC<PortfolioDetailMdProps> = ({
  activityContent,
  onClose,
}) => {
  const userID = parseInt(
    useSelector((state: RootState) => state.auth.memberId) ?? "0",
    10
  );

  return (
    <div className="modal-backdrop">
      <div className="markdown-viewer p-6 rounded-lg border-2 relative bg-white">
        <button onClick={onClose} className="absolute top-2 right-2">
          <IoCloseOutline />
        </button>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {activityContent}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default ActivityDetailModal;
