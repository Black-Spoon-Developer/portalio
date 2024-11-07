import React from "react";
import NavBar from "./components/common/NavBar.tsx";
import Footer from "./components/common/Footer.tsx";
import { Route, Routes } from "react-router-dom";
import MainTestPage from "./pages/MainTest.tsx";
import LoginPage from "./pages/auth/LoginPage.tsx";
import UserSignupPage from "./pages/auth/user/UserSignUpPage.tsx";

const App: React.FC = () => {
  return (
    <>
      {/* <NavBar /> */}
      <Routes>
        <Route path="/" element={<MainTestPage />}></Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/user/signup" element={<UserSignupPage />}></Route>
      </Routes>
      <Footer />
    </>
  );
};

export default App;
