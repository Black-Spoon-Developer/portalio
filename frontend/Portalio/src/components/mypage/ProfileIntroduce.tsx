import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import SettingsIcon from "../../assets/Setting.svg";
import { useParams } from "react-router-dom";
import {
  getUserIntroduction,
  setUserIntroduction,
} from "./../../api/MyPageAPI";
import { uploadProfilePicture } from "../../api/S3ImageUploadAPI";
import { updateProfilePicture, getProfilePicture } from "./../../api/MemberAPI";
import { useDispatch } from "react-redux";
import { authActions } from "../../store/auth/AuthSlice";

// 모달
const Modal: React.FC<{ onClose: () => void; children: React.ReactNode }> = ({
  onClose,
  children,
}) => (
  <div
    className="modal-overlay fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    onClick={onClose}
  >
    <div
      className="modal-content bg-white p-8 rounded shadow-lg relative"
      onClick={(e) => e.stopPropagation()}
    >
      {children}
      <button
        onClick={onClose}
        className="absolute bottom-3 right-3 text-gray-500 hover:text-gray-700"
      >
        닫기
      </button>
    </div>
  </div>
);

const ProfileIntroduce: React.FC = () => {
  // Redux 에서 memberId와 프로필 사진 정보 추출
  const memberUsername = useSelector(
    (state: RootState) => state.auth.memberUsername
  );
  const oAuthPicture = useSelector(
    (state: RootState) => state.auth.memberPicture
  );

  // URL에서 user_id 파라미터 추출
  const { username } = useParams<{ username: string }>();
  const isOwner =
    username && memberUsername ? username === memberUsername : false;

  // 상태 관리
  const [picture, setPicture] = useState(oAuthPicture);
  const [isModalOpen, setIsModalOpen] = useState(false); // 프로필 사진 변경 모달
  const [isViewModalOpen, setIsViewModalOpen] = useState(false); // 프로필 사진 보기 모달
  const [isFileUploadModalOpen, setIsFileUploadModalOpen] = useState(false); // 파일 업로드 모달 상태
  const [isCropModalOpen, setIsCropModalOpen] = useState(false); // 이미지 크롭 모달 상태
  const [uploadedFile, setUploadedFile] = useState<File | null>(null); // 업로드된 파일 상태

  // 유저 소개 데이터 변수
  const [introduction, setIntroduction] = useState({
    userIntroductionTitle: "", // 제목 설정
    userIntroductionContent: "", // 내용 설정
  });

  // 유저 소개 수정 버튼 제어 변수
  const [isEditingIntro, setIsEditingIntro] = useState(false);

  // Redux 디스패치
  const dispatch = useDispatch();

  // 유저 사진 조회 함수
  useEffect(() => {
    const fetchUserPicture = async () => {
      if (username) {
        const data = await getProfilePicture(username);
        setPicture(data.memberPicture);
      }
    };

    fetchUserPicture();
  }, [username]);

  // 유저 프로필 데이터 조회 함수
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (username) {
        const data = await getUserIntroduction(username);
        setIntroduction({
          userIntroductionTitle: data.userIntroductionTitle,
          userIntroductionContent: data.userIntroductionContent,
        });
      }
    };

    fetchUserInfo();
  }, [username]);

  // 유저 소개 저장 함수
  const handleSaveIntro = async () => {
    setUserIntroduction(introduction); // api 호출
    setIsEditingIntro(false); // 수정 모드 종료
  };

  // 프로필 사진 업로드 및 업데이트
  const handleCropComplete = async () => {
    if (uploadedFile) {
      // 크롭된 이미지를 서버에 업로드
      const croppedImage = await uploadProfilePicture(uploadedFile);

      if (croppedImage) {
        console.log("업로드된 URL: ", croppedImage);

        // DB 업데이트
        const response = await updateProfilePicture(croppedImage);

        if (response) {
          // 로컬 상태 업데이트
          dispatch(authActions.updateMemberPicture(croppedImage));
          setPicture(croppedImage); // 로컬 상태 업데이트
          setIsCropModalOpen(false); // 크롭 모달 닫기
        }
      }
    }
  };

  return (
    <div className="flex items-center text-left mb-5 border-b border-gray-400 pb-5">
      {/* 프로필 이미지와 수정 버튼 */}
      <div className="relative mr-6 min-w-[200px]">
        <img
          src={picture || "기본 이미지 URL"}
          alt="Profile"
          className="profile-image w-48 h-48 rounded-full cursor-pointer"
        />
        <button
          className="absolute bottom-2 right-2 hover:bg-gray-300 bg-gray-200 text-gray-700 rounded-full inline-flex items-center justify-center w-10 h-10 text-xl transform transition duration-200"
          onClick={() => setIsModalOpen(true)} // 모달 열기
        >
          📷
        </button>
      </div>

      {/* 프로필 사진 변경/보기 모달 */}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          {/* 프로필 사진 변경 버튼 */}
          {isOwner && (
            <button
              className="w-full text-left mb-2 hover:bg-gray-100 p-2 rounded"
              onClick={() => {
                setIsModalOpen(false); // 현재 모달 닫기
                setIsViewModalOpen(false); // 사진 보기 모달도 닫기
                setIsFileUploadModalOpen(true); // 파일 업로드 모달 열기
              }}
            >
              프로필 사진 변경
            </button>
          )}
          {/* 기존 프로필 사진 보기 버튼 */}
          <button
            className="w-full text-left mb-2 hover:bg-gray-100 p-2 rounded"
            onClick={() => setIsViewModalOpen(true)} // 사진 보기 모달 열기
          >
            프로필 사진 보기
          </button>
        </Modal>
      )}

      {isFileUploadModalOpen && (
        <Modal onClose={() => setIsFileUploadModalOpen(false)}>
          {/* 파일 업로드 입력 */}
          <input
            type="file"
            accept="image/*"
            className="w-full text-left mb-2 hover:bg-gray-100 p-2 rounded cursor-pointer"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];
                setUploadedFile(file); // 선택된 파일 상태 저장
                setIsFileUploadModalOpen(false); // 파일 업로드 모달 닫기
                setIsCropModalOpen(true); // 이미지 크롭 모달 열기
              }
            }}
          />
        </Modal>
      )}

      {isCropModalOpen && (
        <Modal onClose={() => setIsCropModalOpen(false)}>
          {/* 이미지 크롭 UI */}
          <div className="crop-container">
            {uploadedFile ? ( // uploadedFile이 null인지 확인
              <img
                src={URL.createObjectURL(uploadedFile)} // null이 아니면 Blob으로 변환
                alt="Preview"
                className="w-full h-auto"
              />
            ) : (
              <p>이미지가 없습니다.</p> // null인 경우 메시지 표시
            )}
            {/* 크롭 슬라이더 UI */}
            <input type="range" min="1" max="100" className="w-full mt-2" />
            <div className="flex justify-end mt-4">
              <button
                onClick={() => {
                  handleCropComplete(); // 크롭 완료 로직 (추후 API 호출로 연결)
                }}
                className="text-white bg-blue-500 px-4 py-2 rounded hover:bg-blue-700"
              >
                저장
              </button>
              <button
                onClick={() => setIsCropModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 ml-2"
              >
                취소
              </button>
            </div>
          </div>
        </Modal>
      )}

      {isViewModalOpen && (
        <Modal onClose={() => setIsViewModalOpen(false)}>
          <img
            src={picture || "기본 이미지 URL"} // 프로필 사진 표시
            alt="Profile"
            className="w-[600] h-[600px]"
          />
        </Modal>
      )}

      {/* 프로필 소개 */}
      <div className="profile-info flex flex-col w-full">
        <div className="flex justify-between items-center mb-2 w-full">
          <div className="flex items-center w-full">
            {!isEditingIntro ? (
              <h2 className="intro-title text-xl text-orange-500 font-bold flex-grow">
                {/* 제목 표시 */}
                {introduction.userIntroductionTitle ||
                  "자기소개를 입력해 주세요."}
              </h2>
            ) : (
              <input
                type="text"
                value={introduction.userIntroductionTitle} // 제목 입력
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
              onClick={() => setIsEditingIntro(true)} // 수정 모드로 전환
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
              {/* 내용 표시 */}
            </p>
          ) : (
            <>
              <textarea
                value={introduction.userIntroductionContent} // 내용 입력
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
                  onClick={handleSaveIntro} // 저장
                  className="text-white bg-blue-500 px-4 py-2 rounded hover:bg-blue-700"
                >
                  저장
                </button>
                <button
                  onClick={() => setIsEditingIntro(false)} // 수정 취소
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
