import React, { useEffect, useState } from "react";
import SettingsIcon from "../../assets/Setting.svg";
import BriefCase from "../../assets/BriefCase.svg";
import {
  getjobHistory,
  createJobHistory,
  editJobHistory,
  deleteJobHistory,
} from "../../api/MyPageAPI";
import { useParams } from "react-router-dom";
import {
  JobHistoryResponse,
  JobHistoryRequest,
  JobHistoryEditRequest,
} from "../../interface/mypage/MyPageInterface";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

const JobHistory: React.FC = () => {
  const { username } = useParams<{ username: string }>();

  // 수정 버튼 제어 변수
  const memberUsername = useSelector((state: RootState) => state.auth.memberUsername);
  const isOwner = username && memberUsername ? username === memberUsername : false;

  // 이력/경력 관련 변수
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [careers, setCareers] = useState<JobHistoryResponse[]>([]);
  const [newCareer, setNewCareer] = useState<JobHistoryRequest>({
    jobCompany: "",
    jobPosition: "",
    jobStartDate: "",
    jobEndDate: "",
  });
  const [editingCareer, setEditingCareer] = useState<JobHistoryEditRequest>({
    jobHistoryId: 0,
    jobCompany: "",
    jobPosition: "",
    jobStartDate: "",
    jobEndDate: "",
  });

  // Career 관련 함수
  const displayedCareers = isExpanded ? careers : careers.slice(0, 3);
  const handleCareerInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCareer((prevCareer) => ({ ...prevCareer, [name]: value }));
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditingCareer((prevCareer) => ({ ...prevCareer, [name]: value }));
  };

  // 경력/이력 조회 함수
  const fetchJobHistory = async () => {
    const response = await getjobHistory(username || '');
    setCareers(response);
  };

  // 경력/이력 추가 핸들러 함수
  const handleAddCareer = async () => {
    // 모든 입력값이 존재하는지 확인
    const isValid = Object.values(newCareer).every(
      (value) => value.trim() !== ""
    );

    if (!isValid) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    try {
      // jobHistory 생성 요청 및 결과 데이터 반환 받기
      const createdCareer = await createJobHistory(newCareer);

      // 생성된 데이터를 기존 careers 배열에 추가
      setCareers((prevCareers) => [...prevCareers, createdCareer]);

      // 입력 폼 초기화
      setNewCareer({
        jobCompany: "",
        jobPosition: "",
        jobStartDate: "",
        jobEndDate: "",
      });

      setIsAdding(false);
    } catch (error) {
      console.error("경력 생성 중 오류 발생:", error);
      alert("경력 생성 중 문제가 발생했습니다. 다시 시도해주세요.");
    }
  };

  // 경력/이력 수정 핸들러 함수
  const handleEditCareer = (career: JobHistoryResponse) => {
    setIsEditing(career.jobHistoryId);
    setEditingCareer({
      jobHistoryId: career.jobHistoryId,
      jobCompany: career.jobCompany,
      jobPosition: career.jobPosition,
      jobStartDate: career.jobStartDate,
      jobEndDate: career.jobEndDate,
    });
  };

  // 경력/이력 수정된 값을 저장하는 핸들러 함수
  const handleSaveEditCareer = async (editCareer: JobHistoryEditRequest) => {
    const request: JobHistoryEditRequest = {
      jobHistoryId: editCareer.jobHistoryId,
      jobCompany: editCareer.jobCompany,
      jobPosition: editCareer.jobPosition,
      jobStartDate: editCareer.jobStartDate,
      jobEndDate: editCareer.jobEndDate,
    };
    // 수정 요청 후 서버에서 수정된 데이터 반환받기
    const updatedCareer = await editJobHistory(request);

    // 반환된 데이터를 기존 배열에서 찾아 업데이트
    setCareers((prevCareers) =>
      prevCareers.map(
        (career) =>
          career.jobHistoryId === updatedCareer.jobHistoryId
            ? updatedCareer // 수정된 데이터로 대체
            : career // 변경되지 않은 데이터 유지
      )
    );

    setIsEditing(null);
  };

  // 경력/이력 삭제 핸들러 함수
  const handleDeleteCareer = async (jobHistoryId: number) => {
    await deleteJobHistory(jobHistoryId);

    // 삭제 후 상태에서 해당 경력 삭제
    setCareers((prevCareers) =>
      prevCareers.filter((career) => career.jobHistoryId !== jobHistoryId)
    );
  };

  // onMounted 되었을 때 이력/경력 정보 가져오기
  useEffect(() => {
    fetchJobHistory();
  }, []);

  return (
    <div className="w-1/2 pr-4 border-r border-gray-300">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold">이력 / 경력</h3>
        {isOwner && !isAdding && (
          <button
            className="flex items-center text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded p-1 transition duration-200"
            onClick={() => setIsAdding(true)}
          >
            <img
              src={SettingsIcon}
              alt="경력 관리 아이콘"
              className="size-4 mr-1"
            />
            경력 수정
          </button>
        )}
      </div>

      <ul className="space-y-3">
        {displayedCareers.map((career) => (
          <li className="flex items-start mb-4" key={career.jobHistoryId}>
            <img
              src={BriefCase}
              alt="BriefCase Icon"
              className="w-5 h-5 mr-2 mt-1"
            />
            {isEditing === career.jobHistoryId ? (
              // 수정 폼 렌더링
              <div className="career-edit-form w-full">
                <input
                  type="text"
                  name="jobCompany"
                  value={editingCareer.jobCompany}
                  onChange={handleEditInputChange}
                  placeholder="회사명"
                  className="border p-2 rounded w-full"
                />
                <input
                  type="text"
                  name="jobPosition"
                  value={editingCareer.jobPosition}
                  onChange={handleEditInputChange}
                  placeholder="직책"
                  className="border p-2 rounded w-full mt-2"
                />
                <div className="flex items-center space-x-2 mt-2">
                  <input
                    type="month"
                    name="jobStartDate"
                    value={editingCareer.jobStartDate}
                    onChange={handleEditInputChange}
                    className="border p-2 rounded w-1/2"
                  />
                  <span>~</span>
                  <input
                    type="month"
                    name="jobEndDate"
                    value={editingCareer.jobEndDate}
                    onChange={handleEditInputChange}
                    className="border p-2 rounded w-1/2"
                  />
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    className="text-white bg-blue-500 px-4 py-2 rounded hover:bg-blue-700"
                    onClick={() => handleSaveEditCareer(editingCareer)}
                  >
                    저장
                  </button>
                  <button
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => setIsEditing(null)}
                  >
                    취소
                  </button>
                </div>
              </div>
            ) : (
              // 기존 경력 데이터 렌더링
              <section>
                <div className="flex items-baseline">
                  <strong className="font-bold">{career.jobCompany}</strong>
                  <span className="ml-2 text-sm">{career.jobPosition}</span>
                </div>
                <span className="text-gray-500">{`${career.jobStartDate} ~ ${career.jobEndDate}`}</span>
                {isAdding && (
                  <div className="flex space-x-2 mt-2">
                    <button
                      onClick={() => handleEditCareer(career)}
                      className="text-sm text-blue-500 hover:text-blue-700"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDeleteCareer(career.jobHistoryId)}
                      className="text-sm text-red-500 hover:text-red-700"
                    >
                      삭제
                    </button>
                  </div>
                )}
              </section>
            )}
          </li>
        ))}
      </ul>

      {/* 경력 입력 폼 */}
      {isAdding && (
        <div className="mt-3 space-y-2">
          <input
            type="text"
            name="jobCompany"
            placeholder="회사명"
            value={newCareer.jobCompany}
            onChange={handleCareerInputChange}
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            name="jobPosition"
            placeholder="직책"
            value={newCareer.jobPosition}
            onChange={handleCareerInputChange}
            className="border p-2 rounded w-full"
          />
          <div className="flex items-center space-x-2">
            <input
              type="month"
              name="jobStartDate"
              value={newCareer.jobStartDate}
              onChange={handleCareerInputChange}
              className="border p-2 rounded w-1/2"
            />
            <span>~</span>
            <input
              type="month"
              name="jobEndDate"
              value={newCareer.jobEndDate}
              onChange={handleCareerInputChange}
              className="border p-2 rounded w-1/2"
            />
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <button
              className="text-white bg-blue-500 px-4 py-2 rounded hover:bg-blue-700"
              onClick={handleAddCareer}
            >
              추가
            </button>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setIsAdding(false)}
            >
              취소
            </button>
          </div>
        </div>
      )}
      <div className="expand-button mt-3 flex justify-center items-center">
        {careers.length > 3 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-500"
          >
            {isExpanded ? "▲ 접기" : "▼ 펼치기"}
          </button>
        )}
      </div>
    </div>
  );
};

export default JobHistory;
