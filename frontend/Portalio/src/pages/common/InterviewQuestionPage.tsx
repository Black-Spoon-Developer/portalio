import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  fetchPreInterview,
  generateQuestions,
} from "../../api/AiInterviewReadyAPI";
import { MemberInfoDTO } from "../../interface/aiInterview/AICommonInterface";
import QuestionSelect from "../../components/ai/tab/QuestionSelect";
import { InterviewActions } from "../../store/aiInterview/InterviewSlice";
import LoadingSpinner from "../../components/spinner/LoadingSpinner";

const InterviewQuestionPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [memberInfo, setMemberInfo] = useState<MemberInfoDTO | null>(null);
  const [isInfoLoading, setIsInfoLoading] = useState(false);
  const [isQuestionLoading, setIsQuestionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // onMounted 됐을 때 멤버 정보를 통해서 질문 생성을 위한 정보를 가져온다.
  useEffect(() => {
    const loadMemberInfo = async () => {
      try {
        setIsInfoLoading(true);
        const data = await fetchPreInterview();
        setMemberInfo(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "데이터 로드 실패");
      } finally {
        setIsInfoLoading(false);
      }
    };

    loadMemberInfo();
  }, []);

  // 질문 생성 핸들러 함수
  const handleGenerate = async ({
    selectedPortfolios,
    selectedRepositories,
    selectedJobs,
  }: {
    selectedPortfolios: number[];
    selectedRepositories: number[];
    selectedJobs: string[];
  }) => {
    try {
      // 로딩 상태로 만들기
      setIsQuestionLoading(true);

      // 질문 생성 요청을 하고 가져오기
      const response = await generateQuestions({
        portfolio_id: selectedPortfolios[0],
        repository_id: selectedRepositories[0],
        job_roles: selectedJobs,
      });

      // Redux 상태에 저장
      dispatch(
        InterviewActions.setQuestions({
          interview_id: response.interview_id,
          portfolio_id: response.portfolio_id ?? null,
          repository_id: response.repository_id ?? null,
          questions: response.questions,
        })
      );

      // Setup 페이지로 이동
      navigate(`/ai/interview-setup`, {
        state: {
          portfolioId: response.portfolio_id,
          repositoryId: response.repository_id,
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "질문 생성 실패");
    } finally {
      setIsQuestionLoading(false);
    }
  };

  // 질문 생성 중 로딩 스피너
  if (isQuestionLoading) return <LoadingSpinner mode="Question" />;

  // 정보 요청 중 로딩 스피너
  if (isInfoLoading) return <LoadingSpinner mode="Getting" />;

  if (error) return <div className="text-red-500 text-center p-8">{error}</div>;
  if (!memberInfo) return null;

  return (
    <QuestionSelect
      portfolios={memberInfo.portfolios}
      repositories={memberInfo.repositories}
      onGenerate={handleGenerate}
    />
  );
};

export default InterviewQuestionPage;
