import React from "react";
import NavBar from "./components/common/navBar/UpNavBar.tsx";
import Footer from "./components/common/Footer.tsx";
import { Outlet, Route, Routes, useLocation } from "react-router-dom";
// import MainTestPage from "./pages/MainTest.tsx";
import LoginPage from "./pages/auth/LoginPage.tsx";
import UserSignupPage from "./pages/auth/user/UserSignUpPage.tsx";
import UserProfilePage from "./pages/user/UserProfilePage.tsx";
import UserSettingPage from "./pages/user/UserSettingPage.tsx";
import UserPortfolioListPage from "./pages/user/UserPortfolioListPage.tsx";
import UserFreeListPage from "./pages/user/UserFreeListPage";
import UserRepositoryListPage from "./pages/user/UserRepositoryListPage.tsx";
import BoardEditPage from "./pages/board/board/BoardEditPage.tsx";
import BoardCreatePage from "./pages/board/board/BoardCreatePage.tsx";
import PortfolioCreatePage from "./pages/board/portfolio/PortfolioCreatePage.tsx";
import PortfolioDetailPage from "./pages/board/portfolio/PortfolioDetailPage.tsx";
import PortfolioEditPage from "./pages/board/portfolio/PortfolioEditPage.tsx";
import RepositoryEditPage from "./pages/board/repository/RepositoryEditPage.tsx";
import RepositoryDetailPage from "./pages/board/repository/RepositoryDetailPage.tsx";
import RepositoryCreatePage from "./pages/board/repository/RepositoryCreatePage.tsx";
import NotFoundPage from "./pages/auth/NotFoundPage.tsx";
import BoardPage from "./pages/board/board/BoardPage.tsx";
import FreeDetailPage from "./pages/board/board/free/FreeDetailPage.tsx";
import QuestionDetailPage from "./pages/board/board/qustion/QuestionDetailPage.tsx";
import ActivityCreatePage from "./pages/board/activity/ActivityCreatePage.tsx";
import ActivityDetailPage from "./pages/board/activity/ActivityDetailPage.tsx";
import ActivityEditPage from "./pages/board/activity/ActivityEditPage.tsx";
import UserQuestionListPage from "./pages/user/UserQuestionListPage.tsx";

import UserActivityListPage from "./pages/user/UserActivityListPage";

// Recruiter (주석 처리 - 당장 사용하지 않음)
// import RecruiterPage from "./pages/recruiter/RecruiterPage.tsx";

// AI (주석 처리 - 현재 계획 없음)
// import AIIntroducePage from "./pages/ai/AIIntroducePage.tsx";
// import AIInterviewPage from "./pages/ai/AIInterviewPage.tsx";
// import AIAnalyzePage from "./pages/ai/AIAnalyzePage.tsx";
// import AIRecordPage from "./pages/ai/AIRecordPage.tsx";
// import PortfolioPage from "./pages/board/PortfolioPage.tsx";
// import TextAnalysisPage from "./pages/ai/analysis/text/TextAnalysisPage.tsx";
// import AiInterviewRecordsPage from "./pages/ai/analysis/record/AiInterviewRecordsPage.tsx";
import VideoProcessPage from "./pages/ai/analysis/video/VideoProcessPage.tsx";
import AudioProcessPage from "./pages/ai/analysis/audio/AudioProcessPage.tsx";
import AudioAnalysisPage from "./pages/ai/analysis/audio/AudioAnalysisPage.tsx";
import InterviewIntroPage from "./pages/common/InterviewIntroPage.tsx";
import InterviewSetupPage from "./pages/common/InterviewSetupPage.tsx";
import InterviewQuestionPage from "./pages/common/InterviewQuestionPage.tsx";
import LoadingSpinner from "./components/spinner/LoadingSpinner.tsx";
// import AudioAnalysisPage from "./pages/ai/analysis/audio/AudioAnalysisPage.tsx";

const App: React.FC = () => {
  const location = useLocation();

  // Footer를 표시하지 않을 URL 목록
  const hideFooterPaths = ["/", "/users/signup"];

  // 현재 경로가 hideFooterPaths에 포함되면 Footer를 숨깁니다.
  const shouldShowFooter = !hideFooterPaths.includes(location.pathname);

  return (
    <>
      <NavBar />
      <Routes>
        {/* Main */}
        <Route path="/" element={<BoardPage />} />

        {/* User */}
        <Route path="/users" element={<Outlet />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<UserSignupPage />} />
          <Route path="profile/:user_id" element={<Outlet />}>
            <Route index element={<UserProfilePage />} />
            <Route path="free" element={<UserFreeListPage />} />
            <Route path="setting" element={<UserSettingPage />} />
            <Route path="portfolio" element={<UserPortfolioListPage />} />
            <Route path="repository" element={<UserRepositoryListPage />} />
            <Route path="activity" element={<UserActivityListPage />} />
            <Route path="question" element={<UserQuestionListPage />} />
          </Route>
        </Route>

        {/* Board */}
        <Route path="/free" element={<Outlet />}>
          <Route path="create" element={<BoardCreatePage />} />
          <Route path=":free_id" element={<FreeDetailPage />} />
          <Route path="edit/:board_id" element={<BoardEditPage />} />
        </Route>
        <Route path="/question" element={<Outlet />}>
          <Route path="create" element={<BoardCreatePage />} />
          <Route path=":question_id" element={<QuestionDetailPage />} />
          <Route path="edit/:board_id" element={<BoardEditPage />} />
        </Route>
        <Route path="/activity" element={<Outlet />}>
          <Route path="create" element={<ActivityCreatePage />} />
          <Route path=":activity_id" element={<ActivityDetailPage />} />
          <Route
            path="edit/:repository_id/:activity_id"
            element={<ActivityEditPage />}
          />
        </Route>

        {/* Portfolio */}
        <Route path="/portfolio" element={<Outlet />}>
          <Route path="create" element={<PortfolioCreatePage />} />
          <Route path=":portfolio_id" element={<PortfolioDetailPage />} />
          <Route path="edit/:portfolio_id" element={<PortfolioEditPage />} />
        </Route>

        {/* Repository */}
        <Route path="/repository" element={<Outlet />}>
          <Route path="create" element={<RepositoryCreatePage />} />
          <Route path=":repository_id" element={<RepositoryDetailPage />} />
          <Route path="edit/:repository_id" element={<RepositoryEditPage />} />
        </Route>

        {/* Recruiter (주석 처리) */}
        {/* <Route path="/recruiter" element={<RecruiterPage />} /> */}

        {/* AI (주석 처리) */}
        <Route path="/ai" element={<Outlet />}>
          {/* 히어로 페이지 */}
          <Route path="introduce" element={<InterviewIntroPage />} />
          {/* 질문 생성 페이지 */}
          <Route path="question" element={<InterviewQuestionPage />}></Route>
          <Route
            path="interview-setup"
            element={<InterviewSetupPage />}
          ></Route>
          {/* 화상 면접 */}
          {/* 화상 면접 페이지 */}
          <Route
            path="interview/video/process"
            element={<VideoProcessPage />}
          ></Route>
          {/* 음성 면접 */}
          {/* 음성 면접 진행 페이지 */}
          <Route
            path="interview/audio/process"
            element={<AudioProcessPage />}
          />
          {/* 음성 면접 결과 분석 조회 페이지 */}
          <Route
            path="interview/audio/analysis/:interview_id"
            element={<AudioAnalysisPage />}
          ></Route>
          {/* <Route path="analyze/:analyze_id" element={<AIAnalyzePage />} />
          <Route path="record/:record_id" element={<AIRecordPage />} /> */}
        </Route>

        {/* Exception handling */}
        <Route path="*" element={<NotFoundPage />}></Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/user/signup" element={<UserSignupPage />}></Route>
        <Route path="/test" element={<LoadingSpinner />}></Route>
      </Routes>

      {/* shouldShowFooter가 true일 때만 Footer 렌더링 */}
      {shouldShowFooter && <Footer />}
    </>
  );
};

export default App;
