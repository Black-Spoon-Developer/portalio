import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getMyRepositoryList } from "../../api/RepositoryAPI";

interface Repository {
  repositoryId: number;
  repositoryTitle: string;
  repositoryDescription: string;
}

const PrimaryRepository: React.FC = () => {
  const { username } = useParams<{ username: string }>();

  const [repositories, setRepositories] = useState<Repository[]>([]);

  // 대표 레포지토리 조회 함수
  const getPrimaryRepository = async () => {
    if (username) {
      try {
        const repositoryResponse = await getMyRepositoryList(username);
        setRepositories(repositoryResponse.items.slice(0, 3)); // 상위 3개 레포지토리만 표시
      } catch (error) {
        console.log(error);
      }
    }
  };

  // 긴 글자 -> ... 으로 대체
  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  useEffect(() => {
    getPrimaryRepository();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-2xl">대표 레포지토리</h2>
        <Link
          to={`/users/profile/${username}/repository`}
          className="text-sm text-blue-500 hover:underline"
        >
          더 보기 →
        </Link>
      </div>

      {repositories.length > 0 ? (
        repositories.map((repository) => (
          <Link
            key={repository.repositoryId}
            to={`/repository/${repository.repositoryId}`}
            className="text-gray-800 hover:text-blue-500"
          >
            <div className="bg-white shadow rounded-lg p-4 border mb-4">
              <p className="font-bold text-xl">
                {truncateText(repository.repositoryTitle, 20)}
              </p>
              <p>{truncateText(repository.repositoryDescription, 40)}</p>
            </div>
          </Link>
        ))
      ) : (
        <li className="text-gray-500">아직 생성된 레포지토리가 없어요.</li>
      )}
    </div>
  );
};

export default PrimaryRepository;
