import React from "react";
import NavBar from "./components/common/UpNavBar.tsx";
import Footer from "./components/common/Footer.tsx";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage.tsx";
import UserSignupPage from "./pages/auth/user/UserSignUpPage.tsx";
import PortfolioPage from "./pages/board/PortfolioPage.tsx";
import ToastEditor from "./components/common/ToastEditor.tsx";
import Dropzone from "./components/common/Dropzone.tsx";
import ToastEditorWithVideo from "./components/common/ToastEditorMovie.tsx";

const App: React.FC = () => {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<PortfolioPage />}></Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/user/signup" element={<UserSignupPage />}></Route>
        <Route path="/test" element={<ToastEditor />}></Route>
        <Route path="/test2" element={<Dropzone />}></Route>
        <Route path="/test3" element={<ToastEditorWithVideo />}></Route>
      </Routes>
      <Footer />
    </>
  );
};

export default App;
