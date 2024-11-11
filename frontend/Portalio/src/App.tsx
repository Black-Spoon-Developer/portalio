import React from "react";
import NavBar from "./components/common/navBarComponent/navBar/UpNavBar.tsx";
import Footer from "./components/common/Footer.tsx";
import { Outlet, Route, Routes } from "react-router-dom";
// import MainTestPage from "./pages/MainTest.tsx";
import LoginPage from "./pages/auth/LoginPage.tsx";
import UserSignupPage from "./pages/auth/user/UserSignUpPage.tsx";
import UserProfilePage from "./pages/auth/user/UserProfilePage.tsx";
import UserSettingPage from "./pages/auth/user/UserSettingPage.tsx";
import UserFreeListPage from "./pages/auth/user/UserFreeListPage.tsx";
import UserActivityListPage from "./pages/auth/user/UserActivityListPage.tsx";
import UserPortfolioListPage from "./pages/auth/user/UserPortfolioListPage.tsx";
import UserRepositoryListPage from "./pages/auth/user/UserRepositoryListPage.tsx";
import UserQuestionListPage from "./pages/auth/user/UserQuestionListPage.tsx"
import BoardEditPage from "./pages/board/board/BoardEditPage.tsx";
import BoardDetailPage from "./pages/board/board/BoardDetailPage.tsx";
import BoardCreatePage from "./pages/board/board/BoardCreatePage.tsx";
import PortfolioCreatePage from "./pages/board/portfolio/PortfolioCreatePage.tsx";
import PortfolioDetailPage from "./pages/board/portfolio/PortfolioDetailPage.tsx";
import PortfolioEditPage from "./pages/board/portfolio/PortfolioEditPage.tsx";
import RepositoryEditPage from "./pages/board/repository/RepositoryEditPage.tsx";
import RepositoryDetailPage from "./pages/board/repository/RepositoryDetailPage.tsx";
import RepositoryCreatePage from "./pages/board/repository/RepositoryCreatePage.tsx";
import NotFoundPage from "./pages/auth/NotFoundPage.tsx";

// Recruiter (주석 처리 - 당장 사용하지 않음)
// import RecruiterPage from "./pages/recruiter/RecruiterPage.tsx";

// AI (주석 처리 - 현재 계획 없음)
// import AIIntroducePage from "./pages/ai/AIIntroducePage.tsx";
// import AIInterviewPage from "./pages/ai/AIInterviewPage.tsx";
// import AIAnalyzePage from "./pages/ai/AIAnalyzePage.tsx";
// import AIRecordPage from "./pages/ai/AIRecordPage.tsx";

const App: React.FC = () => {
  return (
    <>
      <NavBar />
      <Routes>
        {/* Main */}
        {/* <Route path="/" element={<MainTestPage />} /> */}

        {/* User */}
        <Route path="/users" element={<Outlet />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<UserSignupPage />} />
          <Route path="profile/:userId" element={<Outlet />}>
            <Route index element={<UserProfilePage />} />
            <Route path="setting" element={<UserSettingPage />} />
            <Route path="free" element={<UserFreeListPage />} />
            <Route path="activity" element={<UserActivityListPage />} />
            <Route path="question" element={<UserQuestionListPage />} />
            <Route path="portfolio" element={<UserPortfolioListPage />} />
            <Route path="repository" element={<UserRepositoryListPage />} />
          </Route>
        </Route>

        {/* Board */}
        <Route path="/free" element={<Outlet />}>
          <Route path="create" element={<BoardCreatePage />} />
          <Route path=":freeId" element={<BoardDetailPage />} />
          <Route path="edit/:freeId" element={<BoardEditPage />} />
        </Route>
        <Route path="/question" element={<Outlet />}>
          <Route path="create" element={<BoardCreatePage />} />
          <Route path=":questionId" element={<BoardDetailPage />} />
          <Route path="edit/:questionId" element={<BoardEditPage />} />
        </Route>
        <Route path="/activity" element={<Outlet />}>
          <Route path="create" element={<BoardCreatePage />} />
          <Route path=":activityId" element={<BoardDetailPage />} />
          <Route path="edit/:activityId" element={<BoardEditPage />} />
        </Route>

        {/* Portfolio */}
        <Route path="/portfolio" element={<Outlet />}>
          <Route path="create" element={<PortfolioCreatePage />} />
          <Route path=":portfolioId" element={<PortfolioDetailPage />} />
          <Route path="edit/:portfolioId" element={<PortfolioEditPage />} />
        </Route>

        {/* Repository */}
        <Route path="/repository" element={<Outlet />}>
          <Route path="create" element={<RepositoryCreatePage />} />
          <Route path=":repositoryId" element={<RepositoryDetailPage />} />
          <Route path="edit/:repositoryId" element={<RepositoryEditPage />} />
        </Route>

        {/* Recruiter (주석 처리) */}
        {/* <Route path="/recruiter" element={<RecruiterPage />} /> */}

        {/* AI (주석 처리) */}
        {/* <Route path="/ai" element={<Outlet />}>
          <Route path="introduce" element={<AIIntroducePage />} />
          <Route path="interview/:interviewId" element={<AIInterviewPage />} />
          <Route path="analyze/:analyzeId" element={<AIAnalyzePage />} />
          <Route path="record/:recordId" element={<AIRecordPage />} />
        </Route> */}

        {/* Exception handling */}
        <Route path="*" element={<NotFoundPage />}></Route>
      </Routes>
      <Footer />
    </>
  );
};

export default App;
