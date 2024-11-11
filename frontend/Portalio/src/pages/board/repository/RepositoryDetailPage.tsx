import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

interface Repository {
  repositoryId: number;
  repositoryTitle: string;
  repositoryContent: string;
  startDate: string;
  endDate: string;
  repositoryImgKey: string;
  repositoryFileKey: string;
  repositoryPost: boolean;
  activityBoards: { url: string }[];
  member: { memberId: number; name: string };
}

const RepositoryDetailPage: React.FC = () => {
  const [repository] = useState<Repository>({
    repositoryId: 1,
    repositoryTitle: "데이터 기반 채용 전략",
    repositoryContent:
      "데이터 기반 채용 전략을 통해 채용 비용을 절감하고, 채용 후 장기적으로 높은 성과를 보이는 인재의 비율을 증가",
    startDate: "2024.10.01",
    endDate: "2024.10.10",
    repositoryImgKey: "",
    repositoryFileKey: "",
    repositoryPost: true,
    activityBoards: [
      { url: "https://www.example.com/blog/organizational-culture-innovation" },
      { url: "https://www.example.com/resources/data-driven-hiring-strategy" },
      { url: "https://www.example.com/services/culture-consulting" },
    ],
    member: { memberId: 1, name: "홍길동" },
  });

  return (
    <div
      className="p-8 max-w-3xl mx-auto bg-white shadow-md rounded-lg border mb-8"
      style={{ border: "1px solid #bfbfbf", borderRadius: "5px" }}
    >
      <header className="text-3xl font-bold mb-4">
        {repository.repositoryTitle}
      </header>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">목표</h2>
        <p>{repository.repositoryContent}</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">인원</h2>
        <p>2명</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">기간</h2>
        <p>
          {repository.startDate} ~ {repository.endDate}
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">후기</h2>
        <ReactMarkdown>{`"데이터 기반 채용 전략 프로젝트를 통해 채용 과정에 큰 변화를 가져올 수 있었습니다. 기존에는 지원자의 주관적 평가에 의존하는 경우가 많아, 적합한 인재를 채용하는 데 어려움이 있었습니다. 하지만 이번 프로젝트로 지원자 이력들, 학력들, 채용 성공률 등 다양한 지표를 체계적으로 분석하게 되면서, 각 직무별로 최적의 후보자 프로필을 정의하고 맞춤형 평가 기준을 마련할 수 있었습니다." 

또한, AI 기반 매칭 알고리즘을 도입하여 직무와 지원자 간의 적합성을 정량적으로 평가하게 되었고, 이를 통해 채용 성공률이 약 30% 이상 상승하는 성과를 이루었습니다. 채용 채널별 효과 분석 결과도 인사이트가 많았는데, 가장 효과적인 채널에 예산을 집중함으로써 비용 효율성 또한 크게 개선되었습니다. 이 프로젝트를 통해 우리 팀은 보다 데이터에 근거한 의사결정을 내릴 수 있었고, 장기적으로도 조직에 큰 도움이 될 것이라 확신합니다. 데이터 기반 접근이 채용의 미래라는 것을 체감하게 된 의미 있는 경험이었습니다."`}</ReactMarkdown>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">활동 기록</h2>
        <ul className="list-disc pl-5 space-y-2">
          {repository.activityBoards.map((activity, index) => (
            <li key={index}>
              활동 {index + 1} :{" "}
              <a href={activity.url} className="text-blue-500 hover:underline">
                {activity.url}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default RepositoryDetailPage;
