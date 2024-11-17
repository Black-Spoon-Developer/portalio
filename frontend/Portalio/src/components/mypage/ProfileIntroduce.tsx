import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import SettingsIcon from "../../assets/Setting.svg";

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
  // 프로필 사진 관련 변수
  const picture = useSelector((state: RootState) => state.auth.memberPicture);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // 프로필 소개 관련 변수
  const [isEditingIntro, setIsEditingIntro] = useState(false);
  const [introTitle, setIntroTitle] = useState("🔥 끊임없이 도전하는 사람!");
  const [introText, setIntroText] = useState(
    "다양한 회사에서 많은 경험을 했습니다. 현재는 구직중이며 원하는 회사는 많은 성장성과 도전정신이 있는 회사를 원합니다."
  );

  // 프로필 사진 클릭 시 선택 모달 열기
  const handleProfileClick = () => setIsModalOpen(true);

  // 프로필 소개 관련 함수
  const handleSaveIntro = () => {
    setIsEditingIntro(false);
    // 서버에 introTitle과 introText 저장 API 호출 가능
  };

  // 프로필 사진 클릭 시 선택 모달 열기
  const handleViewProfile = () => {
    setIsModalOpen(false);
    setIsViewModalOpen(true);
  };

  return (
    <div className="flex items-center text-left mb-5 border-b border-gray-400 pb-5">
      <div className="relative mr-6 min-w-[200px]">
        {/* 오른쪽에 여백 추가 */}
        <img
          src={picture || "기본 이미지 URL"}
          alt="Profile"
          className="profile-image w-48 h-48 rounded-full cursor-pointer" // 둥근 이미지 모양 유지
        />
        <button
          className="absolute bottom-2 right-2 hover:bg-gray-300 bg-gray-200 text-gray-700 rounded-full inline-flex items-center justify-center w-10 h-10 text-xl transform transition duration-200"
          onClick={handleProfileClick}
        >
          📷
        </button>
      </div>

      {/* 선택 모달 */}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <button
            className="w-full text-left mb-2 hover:bg-gray-100 p-2 rounded"
            onClick={handleViewProfile}
          >
            프로필 사진 보기
          </button>
          <input
            type="file"
            accept="image/*"
            className="w-full text-left mb-2 hover:bg-gray-100 p-2 rounded cursor-pointer"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                console.log("선택된 파일:", e.target.files[0]);
                // 여기서 파일 업로드 처리 로직을 추가하세요
              }
            }}
          />
        </Modal>
      )}

      {/* 프로필 사진 보기 모달 */}
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
        {/* 소개 제목과 수정 버튼 */}
        <div className="flex justify-between items-center mb-2 w-full">
          <div className="flex items-center w-full">
            {!isEditingIntro ? (
              <h2 className="intro-title text-xl text-orange-500 font-bold flex-grow">
                {introTitle}
              </h2>
            ) : (
              <input
                type="text"
                value={introTitle}
                onChange={(e) => setIntroTitle(e.target.value)}
                className="border p-2 rounded w-full"
                placeholder="인트로 제목을 입력하세요"
              />
            )}
          </div>
          {!isEditingIntro && (
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

        {/* 소개 내용 */}
        <div className="flex flex-col mt-2 w-full">
          {!isEditingIntro ? (
            <p className="intro-description text-sm w-full">{introText}</p>
          ) : (
            <>
              <textarea
                value={introText}
                onChange={(e) => setIntroText(e.target.value)}
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
