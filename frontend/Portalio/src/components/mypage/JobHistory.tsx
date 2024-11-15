import React, { useEffect, useState } from "react";
import SettingsIcon from "../../assets/Setting.svg";
import BriefCase from "../../assets/BriefCase.svg";
import { getjobHistory, createJobHistory } from "../../api/MyPageAPI";
import { useParams } from "react-router-dom";
import { JobHistoryDTO } from "../../interface/mypage/MyPageInterface";

const JobHistory: React.FC = () => {
  const { user_id } = useParams<{ user_id: string }>();
  const userId = Number(user_id);

  // 이력/경력 관련 변수
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [careers, setCareers] = useState<JobHistoryDTO[]>([]);

  // 정보 업데이트 트리거 변수
  const [updateTrigger, setUpdateTrigger] = useState(false);

  const [newCareer, setNewCareer] = useState<JobHistoryDTO>({
    company: "",
    position: "",
    startDate: "",
    endDate: "",
  });

  // Career 관련 함수
  const displayedCareers = isExpanded ? careers : careers.slice(0, 3);
  const handleCareerInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCareer((prevCareer) => ({ ...prevCareer, [name]: value }));
  };

  const handleAddCareer = async () => {
    // jobHistory 생성 요청
    await createJobHistory(newCareer);
    setNewCareer({
      company: "",
      position: "",
      startDate: "",
      endDate: "",
    });
    setUpdateTrigger(true);
    setIsAdding(false);
  };

  const fetchJobHistory = async () => {
    const response = await getjobHistory(userId);
    setCareers(response);
  };

  // onMounted 되었을 때 이력/경력 정보 가져오기
  useEffect(() => {
    fetchJobHistory();
  }, []);

  // 새로운 커리어를 생성후 정보 업데이트를 위한 함수
  useEffect(() => {
    if (updateTrigger) {
      fetchJobHistory();
      setUpdateTrigger(false);
    }
  }, [updateTrigger]);

  return (
    <div className="w-1/2 pr-4 border-r border-gray-300">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold">이력 / 경력</h3>
        {!isAdding && (
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

      <ul className="career-list space-y-3">
        {displayedCareers.map((career, index) => (
          <li className="flex items-start mb-4" key={index}>
            <img
              src={BriefCase}
              alt="BriefCase Icon"
              className="w-5 h-5 mr-2 mt-1"
            />
            <div className="career-details">
              <div className="flex items-baseline">
                <strong className="font-bold">{career.company}</strong>
                <span className="ml-2 text-sm">{career.position}</span>
              </div>
              <span className="duration text-gray-500">{`${career.startDate} ~ ${career.endDate}`}</span>
            </div>
          </li>
        ))}
      </ul>

      {/* 경력 입력 폼 */}
      {isAdding && (
        <div className="mt-3 space-y-2">
          <input
            type="text"
            name="company"
            placeholder="회사명"
            value={newCareer.company}
            onChange={handleCareerInputChange}
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            name="position"
            placeholder="직책"
            value={newCareer.position}
            onChange={handleCareerInputChange}
            className="border p-2 rounded w-full"
          />
          <div className="flex items-center space-x-2">
            <input
              type="month"
              name="startDate"
              value={newCareer.startDate}
              onChange={handleCareerInputChange}
              className="border p-2 rounded w-1/2"
            />
            <span>~</span>
            <input
              type="month"
              name="endDate"
              value={newCareer.endDate}
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
