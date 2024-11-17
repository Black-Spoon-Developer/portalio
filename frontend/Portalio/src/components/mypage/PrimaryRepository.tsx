import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getMyRepositoryList } from "../../api/RepositoryAPI";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

interface Repository {
  repositoryId: number;
  repositoryTitle: string;
}

const PrimaryRepository: React.FC = () => {
  const { user_id } = useParams<{ user_id: string }>();
  const username = useSelector((state: RootState) => state.auth.memberUsername);
  const [repositories, setRepositories] = useState<Repository[]>([]);

  // 대표 레포지토리 조회 함수 - 이거 수정 필요함
  const getPrimaryRepository = async () => {
    if (username) {
      const repositoryResponse = await getMyRepositoryList(username);

      setRepositories(repositoryResponse.items.slice(0, 3));
    } else {
      alert("대표 레포지토리 정보를 가져오는 중 에러가 발생했습니다.");
    }
  };

  useEffect(() => {
    getPrimaryRepository();
  }, []);

  return (
    <div className="w-1/2 border-r mr-5 p-2">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-2xl">대표 레포지토리</h2>
        <Link to={`/users/profile/${user_id}/repository`} className="text-sm">
          더 보기 →
        </Link>
      </div>
      {repositories.length > 0 ? (
        repositories.map((repository, index) => (
          <div className="repository-item" key={index}>
            <Link to={`/repository/${repository.repositoryId}`}>
              <h3>{repository.repositoryTitle}</h3>
              <p>효율적인 인재 확보와 이직률 감소 사례</p>
            </Link>
          </div>
        ))
      ) : (
        <p className="mt-5">레포지토리가 없습니다</p>
      )}
    </div>
  );
};

export default PrimaryRepository;
