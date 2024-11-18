import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { boardDetailLike, patchSolveBoard } from "../../../api/BoardAPI";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import {
  IoCheckmarkCircleOutline,
  IoCheckmarkCircleSharp,
} from "react-icons/io5";
import { Viewer } from "@toast-ui/react-editor";

interface QuestionDetailMdProps {
  questionTitle: string;
  questionContent: string;
  isLiked: boolean;
  memberId: number;
  memberUsername: string;
  memberNickname: string;
  memberPicture: string;
  solved: boolean;
  setUpdateDetailTrigger: React.Dispatch<React.SetStateAction<boolean>>;
}

const QuestionDetailMd: React.FC<QuestionDetailMdProps> = ({
  questionTitle,
  questionContent,
  isLiked,
  memberId,
  memberUsername,
  memberNickname,
  memberPicture,
  solved,
  setUpdateDetailTrigger,
}) => {
  const navigate = useNavigate();
  const userID = parseInt(
    useSelector((state: RootState) => state.auth.memberId) ?? "0",
    10
  );

  const { question_id } = useParams<{ question_id: string }>();

  // 질문 게시글 좋아요 핸들러 함수
  const handleLike = async () => {
    if (!question_id) {
      alert("좋아요 처리 중 오류가 발생했습니다.");
      return;
    }

    try {
      await boardDetailLike(question_id);
      setUpdateDetailTrigger(true);
    } catch (error) {
      alert("좋아요 처리 중 오류가 발생했습니다." + error);
    }
  };

  // 질문 게시글 해결 처리 핸들러 함수
  const handleSolve = async () => {
    if (!question_id) {
      alert("질문 게시글 해결 처리 중 오류가 발생했습니다.");
      return;
    }
    try {
      await patchSolveBoard(question_id);
      setUpdateDetailTrigger(true);
    } catch (error) {
      alert("질문 게시글 해결 처리 중 오류가 발생했습니다." + error);
    }
  };

  // 작성자 사진 누르면 작성자의 프로필 페이지로 이동
  const handleAuthorProfile = () => {
    navigate(`/users/profile/${memberUsername}`);
  };

  // 글 수정 버튼을 누르면 수정 페이지로 이동
  const handleEditPost = () => {
    navigate(`/question/edit/${question_id}`);
  };

  return (
    <div className="markdown-viewer p-6 rounded-lg border-2 relative">
      <section className="flex justify-between">
        <div className="flex items-center">
          <button onClick={handleAuthorProfile}>
            <img src={memberPicture} alt="" className="w-10 h-10 rounded-full" />
          </button>
          <div className="ml-4 font-bold">{memberNickname}</div>
        </div>
        {memberId !== userID && ( // userID와 memberId가 다를 때만 버튼을 표시
          <button
            onClick={handleLike}
            className={`flex items-center justify-center p-2 rounded-full text-xl ${
              isLiked ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"
            }`}
            style={{ width: "40px", height: "40px" }}
          >
            ❤️
          </button>
        )}
        {/* userID와 memberId가 같을 때 해결 여부에 따라 버튼을 조건부로 표시 */}
        {memberId === userID &&
          (solved ? (
            <section className="flex flex-col">
              <button onClick={handleSolve} className="flex items-center mb-3">
                <IoCheckmarkCircleSharp className="text-conceptSkyBlue mr-1 size-6" />
                <div className="font-bold">해 결</div>
              </button>
              <button
                onClick={handleEditPost}
                className="font-bold text-lg hover:text-conceptSkyBlue"
              >
                ✏️ 수정
              </button>
            </section>
          ) : (
            <section className="flex flex-col">
              <button onClick={handleSolve} className="flex items-center mb-3">
                <IoCheckmarkCircleOutline className="text-conceptGrey size-6 mr-1" />
                <div className="text-conceptGrey font-bold tracking-widest">
                  미해결
                </div>
              </button>
              <button
                onClick={handleEditPost}
                className="font-bold text-lg hover:text-conceptSkyBlue"
              >
                ✏️ 수정
              </button>
            </section>
          ))}
      </section>

      <header className="flex items-center">
        <h1>{questionTitle}</h1>
      </header>
      <Viewer initialValue={questionContent} key={questionContent} />
    </div>
  );
};

export default QuestionDetailMd;
