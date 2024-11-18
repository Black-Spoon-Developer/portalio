import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import SettingsIcon from "../../assets/Setting.svg";
import { useParams } from "react-router-dom";
import {
  getUserIntroduction,
  setUserIntroduction,
} from "./../../api/MyPageAPI";

const Modal: React.FC<{ onClose: () => void; children: React.ReactNode }> = ({
  onClose,
  children,
}) => (
  <div
    className="modal-overlay fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    onClick={onClose}
  >
    <div
      className="modal-content bg-white p-4 rounded shadow-lg"
      onClick={(e) => e.stopPropagation()}
    >
      {children}
      <button
        onClick={onClose}
        className="mt-4 text-right w-full htransition-all duration-200 flex leading-none"
      >
        닫기
      </button>
    </div>
  </div>
);

const ProfileIntroduce: React.FC = () => {
  const { user_id } = useParams<{ user_id: string }>();
  const memberId = useSelector((state: RootState) => state.auth.memberId);
  const isOwner = user_id && memberId ? user_id === memberId : false;

  const picture = useSelector((state: RootState) => state.auth.memberPicture);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // 유저 소개 수정 관련 변수
  const [introduction, setIntroduction] = useState({
    userIntroductionTitle: "",
    userIntroductionContent: "",
  });

  // 유저 소개 조회 함수
  useEffect(() => {
    const fetchUserIntroduction = async () => {
      if (memberId) {
        const data = await getUserIntroduction(Number(memberId));
        setIntroduction({
          userIntroductionTitle: data.userIntroductionTitle,
          userIntroductionContent: data.userIntroductionContent,
          userIntroductionContent: data.userIntroductionContent,
        });
      }
    };

    fetchUserIntroduction();
  }, [memberId]);

  // 유저 소개 수정 버튼 제어 변수
  const [isEditingIntro, setIsEditingIntro] = useState(false);

  // 유저 소개 수정 버튼 제어 함수
  const handleSaveIntro = async () => {
    setUserIntroduction(introduction);
    setIsEditingIntro(false); // 수정 모드 종료
  };

  return (
    <div className="flex items-center text-left mb-5 border-b border-gray-400 pb-5">
      <div className="relative mr-6 min-w-[200px]">
        <img
          src={picture || "기본 이미지 URL"}
          alt="Profile"
          className="profile-image w-48 h-48 rounded-full cursor-pointer"
        />
        <button
          className="absolute bottom-2 right-2 hover:bg-gray-300 bg-gray-200 text-gray-700 rounded-full inline-flex items-center justify-center w-10 h-10 text-xl transform transition duration-200"
          onClick={() => setIsModalOpen(true)}
        >
          📷
        </button>
      </div>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <button
            className="w-full text-left mb-2 hover:bg-gray-100 p-2 rounded"
            onClick={() => setIsViewModalOpen(true)}
          >
            프로필 사진 보기
          </button>
          {isOwner && (
            <input
              type="file"
              accept="image/*"
              className="w-full text-left mb-2 hover:bg-gray-100 p-2 rounded cursor-pointer"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  console.log("선택된 파일:", e.target.files[0]);
                }
              }}
            />
          )}
        </Modal>
      )}

      {isViewModalOpen && (
        <Modal onClose={() => setIsViewModalOpen(false)}>
          <img
            src={picture || "기본 이미지 URL"}
            alt="Profile"
            className="w-[600] h-[600px]"
          />
        </Modal>
      )}

      <div className="profile-info flex flex-col w-full">
        <div className="flex justify-between items-center mb-2 w-full">
          <div className="flex items-center w-full">
            {!isEditingIntro ? (
              <h2 className="intro-title text-xl text-orange-500 font-bold flex-grow">
                {introduction.userIntroductionTitle}
              </h2>
            ) : (
              <input
                type="text"
                value={introduction.userIntroductionTitle}
                onChange={(e) =>
                  setIntroduction((prev) => ({
                    ...prev,
                    userIntroductionTitle: e.target.value,
                  }))
                }
                className="border p-2 rounded w-full"
                placeholder="인트로 제목을 입력하세요"
              />
            )}
          </div>
          {isOwner && !isEditingIntro && (
            <button
              onClick={() => setIsEditingIntro(true)}
              className="flex items-center text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded p-1 transition duration-200 whitespace-nowrap"
            >
              <img
                src={SettingsIcon}
                alt="수정 아이콘"
                className="size-4 mr-1"
              />
              수정
            </button>
          )}
        </div>

        <div className="flex flex-col mt-2 w-full">
          {!isEditingIntro ? (
            <p className="intro-description text-sm w-full">
              {introduction.userIntroductionContent}
            </p>
          ) : (
            <>
              <textarea
                value={introduction.userIntroductionContent}
                onChange={(e) =>
                  setIntroduction((prev) => ({
                    ...prev,
                    userIntroductionContent: e.target.value,
                  }))
                }
                className="border p-2 rounded w-full"
                placeholder="소개 내용을 입력하세요"
              />
              <div className="flex justify-end space-x-2 mt-2">
                <button
                  onClick={handleSaveIntro}
                  className="text-white bg-blue-500 px-4 py-2 rounded hover:bg-blue-700"
                >
                  저장
                </button>
                <button
                  onClick={() => setIsEditingIntro(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  취소
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileIntroduce;
