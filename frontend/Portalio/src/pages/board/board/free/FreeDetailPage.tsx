import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import SideNavBar from "../../../../components/common/navBar/SideNavBar";
import { getBoard } from "../../../../api/BoardAPI";
import { BoardLikeResponse } from "../../../../interface/board/BoardInterface";
import FreeDetailMd from "../../../../components/board/free/FreeDetailMd";
import FreeDetailComments from "../../../../components/board/free/FreeDetailComments";
import FreeDetailCommentsInput from "../../../../components/board/free/FreeDetailCommentsInput";

const FreeDetailPage: React.FC = () => {
  const { free_id } = useParams<{ free_id: string }>();
  const [post, setPost] = useState<BoardLikeResponse>();

  useEffect(() => {
    const fetchMarkdownContent = async () => {
      try {
        if (free_id) {
          const response = await getBoard(free_id);
          setPost(response.data);
        }
      } catch (error) {
        alert("글 조회를 실패했습니다.: " + error);
      }
    };

    fetchMarkdownContent();
  }, []);

  return (
    <div className="grid grid-cols-5 min-h-screen">
      <div className="fixed top-48 left-0 h-full">
        <SideNavBar />
      </div>
      <div className="col-span-1"></div>
      <div className="mx-5 my-8 col-span-3">
        <FreeDetailMd
          portfolioContent={post?.boardContent}
          isLiked={post?.isLiked}
          memberId={post?.memberId}
        />
        <FreeDetailCommentsInput />
        <FreeDetailComments />
      </div>
    </div>
  );
};

export default FreeDetailPage;
