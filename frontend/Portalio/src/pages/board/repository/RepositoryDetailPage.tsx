import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { getRepositoryDetail } from "./../../../api/RepositoryAPI";

interface Repository {
  repositoryId: number; // 레포지토리 고유 ID
  repositoryTitle: string; // 레포지토리 제목
  repositoryContent: string; // 레포지토리 내용
  startDate: string; // 레포지토리 시작 날짜 (ISO 형식의 문자열)
  endDate: string; // 레포지토리 종료 날짜 (ISO 형식의 문자열)
  repositoryFileKey: string; // 파일 키 값 (파일에 대한 식별자)
  repositoryPost: boolean; // 게시 여부 (true: 게시됨, false: 비게시)
  memberId: number; // 레포지토리를 소유한 회원 ID
}

const RepositoryDetailPage: React.FC = () => {
  const { repositoryId } = useParams<{ repositoryId: string }>(); // URL에서 userId를 추출
  const [repository, setRepository] = useState<Repository | null>(null);

  useEffect(() => {
    const fetchRepositoryDetail = async () => {
      try {
        const response = await getRepositoryDetail(repositoryId || "");
        console.log("Repository Detail:", response); // 응답 콘솔에 출력
        setRepository(response.data); // 상태에 응답 데이터 저장
      } catch (error) {
        console.error("Failed to fetch repositories:", error);
      }
    };

    fetchRepositoryDetail();
  }, []);

  return (
    <div>
      {repository ? (
        <div
          className="p-8 max-w-3xl mx-auto bg-white shadow-md rounded-lg border mb-8"
          style={{ border: "1px solid #bfbfbf", borderRadius: "5px" }}
        >
          <header className="text-3xl font-bold mb-4 flex justify-between items-center">
            {repository.repositoryTitle}
            <Link
              to={`/repository/edit/${repository.repositoryId}`}
              className="text-sm bg-[#57D4E2] text-white border border-[#57D4E2] px-3 py-1 rounded hover:bg-white hover:text-[#57D4E2] transition"
            >
              수정
            </Link>
          </header>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">소개</h2>
            <ReactMarkdown>{repository.repositoryContent}</ReactMarkdown>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">기간</h2>
            <p>
              {repository.startDate} ~ {repository.endDate}
            </p>
          </section>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default RepositoryDetailPage;
