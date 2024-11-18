import React, { useEffect, useState } from "react";
import { getInterviewReports } from "../../../../api/AiInterview"; // API 호출 함수 임포트
import { InterviewReportResponse } from "../../../../type/AiInterview"; // 인터페이스 임포트
import { RootState } from "../../../../store";
import { useSelector } from "react-redux";
import AIimage from "../../../../assets/AI.png"

const AiInterviewContentList: React.FC = () => {
  const [interviewReports, setInterviewReports] = useState<InterviewReportResponse[]>([]);
  const [_, setTotal] = useState(0); 
  const [currentPage, setCurrentPage] = useState(1); 
  const [totalPages, setTotalPages] = useState(0); 
  const [interviewCount, setInterviewCount] = useState(0)
  const userData = useSelector((state: RootState) => state.auth);

  const itemsPerPage = 5;
  const skip = (currentPage - 1) * itemsPerPage;

  useEffect(() => {
    const fetchInterviewReports = async () => {
      try {
        const response = await getInterviewReports({ skip, limit: itemsPerPage });
        setTotal(response.total);
        setInterviewReports(response.items);
        setTotalPages(Math.ceil(response.total / itemsPerPage));
        setInterviewCount(response.items[0].interview_count)
      } catch (error) {
        console.error("인터뷰 리포트 불러오기 오류:", error);
      }
    };
    fetchInterviewReports();
  }, [currentPage]);

  // 인터뷰 타입에 맞는 아이콘을 반환하는 함수
  const renderInterviewIcon = (type: string) => {
    switch (type) {
      case "video":
        return "🖥️"; // 비디오 아이콘
      case "audio":
        return "🎙️"; // 오디오 아이콘
      case "text":
        return "📝"; // 텍스트 아이콘
      default:
        return "❓"; // 기본 아이콘
    }
  };
  console.log(interviewReports)
  // 페이지 변경 함수
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="grid grid-cols-12 gap-4 p-4 my-4">
      <div className="col-span-1"></div>
      <div className="col-span-7">
        <header className="flex justify-between">
          {/* 타이틀 */}
          <h2 className="text-5xl font-bold mb-7 pb-3 border-b-2">
            📋 AI 모의 면접 분석 기록
          </h2>
        </header>

        {interviewReports.length === 0 ? (
          <div className="text-center text-gray-500 text-3xl">
            현재 분석 기록이 없습니다.
          </div>
        ) : (
          interviewReports.map((report) => (
            <div
              key={report.interview_log_id}
              className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 mb-5"
            >
              <div className="bg-gradient-to-r from-conceptSkyBlue to-conceptGreen text-white p-4">
                <h3 className="text-lg font-semibold">평가 등급: {report.interview_grade}</h3>
              </div>

              <div className="p-4 flex justify-between items-center">
                <div>
                  <p className="text-lg font-medium">포트폴리오: {report.portfolio_title}</p>
                  <p className="text-sm text-gray-500">직무 종류: {report.select_job}</p>
                  <p className="text-sm text-gray-500">평가 종류: {report.interview_type}</p>
                  <p className="text-sm text-gray-500">{new Date(report.created_at).toLocaleDateString()}</p>
                </div>
                <div className="text-4xl">{renderInterviewIcon(report.interview_type)}</div>
              </div>

              <div className="p-4 border-t text-right">
                <a
                  href={`interview/${report.interview_type}/analysis/${report.interview_id}`}
                  className="text-blue-500 hover:underline text-sm font-medium flex items-center justify-end"
                >
                  상세 페이지{" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </a>
              </div>
            </div>
          ))
        )}

    {interviewReports.length > 0 && (
      <div className="flex justify-center space-x-4 mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
        >
          {"<"} 이전
        </button>
        <span className="flex items-center justify-center text-lg">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
        >
          다음 {">"}
        </button>
      </div>
    )}
      </div>
      <div className="col-span-3">
        <div className="border-2 p-3 shadow-lg h-50 w-full">
          <div className="flex items-center">
            <div className="ml-5 mt-5">
              <img
                src={userData.memberPicture ?? "https://portalio.s3.ap-northeast-2.amazonaws.com/Portfolio_board/3f445562-1b3c-453a-86e2-42d8853a2df2.png"}
                className="w-20 h-20 rounded-full mr-3"
              />
            </div>
            <div className="mt-5">
              <p className="text-xl font-bold">{userData.memberUsername}</p>
              <p className="text-sm">{userData.memberNickname}</p>
            </div>
            <hr className="my-3 text-xl" />
          </div>
          <div className="m-5">
            <p className="text-xl font-bold my-2">면접 횟수: {interviewCount}</p>
            <p className="text-xl font-bold">티켓 수: {userData.memberTicket}</p>
          </div>
        </div>
        <a href="/ai/introduce">
        <div className="flex items-center justify-center border-2 p-3 shadow-lg w-full my-10 h-60">
          <img src={AIimage} className="w-auto h-auto max-w-full max-h-full" alt="AI Image" />
        </div>
        </a>
      </div>
      <div className="col-span-1"></div>
    </div>
  );
};

export default AiInterviewContentList;
