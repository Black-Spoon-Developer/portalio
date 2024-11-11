import React from "react";
import NavBar from "./components/common/navBarComponent/navBar/UpNavBar.tsx";
import Footer from "./components/common/Footer.tsx";
import { Outlet, Route, Routes } from "react-router-dom";
// import MainTestPage from "./pages/MainTest.tsx";
import LoginPage from "./pages/auth/LoginPage.tsx";
import UserSignupPage from "./pages/auth/user/UserSignUpPage.tsx";
import UserProfilePage from "./pages/auth/user/UserProfilePage.tsx";
import UserSettingPage from "./pages/auth/user/UserSettingPage.tsx";
import UserPortfolioPage from "./pages/auth/user/UserPortfolioPage.tsx";
import UserBoardListPage from "./pages/auth/user/UserBoardListPage.tsx";
import UserRepositoryPage from "./pages/auth/user/UserRepositoryPage.tsx";
import BoardEditPage from "./pages/auth/board/BoardEditPage.tsx";
import BoardDetailPage from "./pages/auth/board/BoardDetailPage.tsx";
import BoardCreatePage from "./pages/auth/board/BoardCreatePage.tsx";
import PortfolioCreatePage from "./pages/auth/portfolio/PortfolioCreatePage.tsx";
import PortfolioDetailPage from "./pages/auth/portfolio/PortfolioDetailPage.tsx";
import PortfolioEditPage from "./pages/auth/portfolio/PortfolioEditPage.tsx";
import RepositoryEditPage from "./pages/auth/repository/RepositoryEditPage.tsx";
import RepositoryDetailPage from "./pages/auth/repository/RepositoryDetailPage.tsx";
import RepositoryCreatePage from "./pages/auth/repository/RepositoryCreatePage.tsx";
import NotFoundPage from "./pages/auth/NotFoundPage.tsx";

import { useNavigate } from "react-router-dom";

// Recruiter (주석 처리 - 당장 사용하지 않음)
// import RecruiterPage from "./pages/recruiter/RecruiterPage.tsx";

// AI (주석 처리 - 현재 계획 없음)
// import AIIntroducePage from "./pages/ai/AIIntroducePage.tsx";
 import CamInterviewPage from "./pages/interview/cam/CamInterviewpage.tsx";
// import AIAnalyzePage from "./pages/ai/AIAnalyzePage.tsx";
// import AIRecordPage from "./pages/ai/AIRecordPage.tsx";

const App: React.FC = () => {
  const navigate = useNavigate();

  // Handle button click to navigate to interview page
  const handleStartInterview = () => {
    const interviewId = 1; // 원하는 interview_id를 설정
    navigate(`/ai/interview/${interviewId}`);
  };

  return (
    <>
      <NavBar />
      <div style={{ textAlign: "center", margin: "20px" }}>
        <button
          onClick={handleStartInterview}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
            backgroundColor: "#007BFF",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
          }}
        >
          면접 시작하기
        </button>
      </div>
      
      <Routes>
        {/* Main */}
        {/* <Route path="/" element={<MainTestPage />} /> */}

        {/* User */}
        <Route path="/users" element={<Outlet />}>
          <Route path="signup" element={<UserSignupPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="profile/:user_id" element={<Outlet />}>
            <Route index element={<UserProfilePage />} />
            <Route path="setting" element={<UserSettingPage />} />
            <Route path="portfolio" element={<UserPortfolioPage />} />
            <Route path="board" element={<UserBoardListPage />} />
            <Route path="repository" element={<UserRepositoryPage />} />
          </Route>
        </Route>

        {/* Board */}
        <Route path="/free" element={<Outlet />}>
          <Route path="create" element={<BoardCreatePage />} />
          <Route path=":free_id" element={<BoardDetailPage />} />
          <Route path="edit/:free_id" element={<BoardEditPage />} />
        </Route>
        <Route path="/question" element={<Outlet />}>
          <Route path="create" element={<BoardCreatePage />} />
          <Route path=":question_id" element={<BoardDetailPage />} />
          <Route path="edit/:question_id" element={<BoardEditPage />} />
        </Route>
        <Route path="/activity" element={<Outlet />}>
          <Route path="create" element={<BoardCreatePage />} />
          <Route path=":activity_id" element={<BoardDetailPage />} />
          <Route path="edit/:activity_id" element={<BoardEditPage />} />
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
        { <Route path="/ai" element={<Outlet />}>
          {/* <Route path="introduce" element={<AIIntroducePage />} /> */}
          <Route path="interview/:interview_id" element={<CamInterviewPage />} />
          {/* <Route path="analyze/:analyze_id" element={<AIAnalyzePage />} />
          <Route path="record/:record_id" element={<AIRecordPage />} /> */}
        </Route> }

        {/* Exception handling */}
        <Route path="*" element={<NotFoundPage />}></Route>
      </Routes>
      <Footer />
    </>
  );
};

export default App;
