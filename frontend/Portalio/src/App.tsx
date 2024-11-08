import React from "react";
import NavBar from "./components/common/navBarComponent/navBar/UpNavBar.tsx";
import Footer from "./components/common/Footer.tsx";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage.tsx";
import UserSignupPage from "./pages/auth/user/UserSignUpPage.tsx";
import PortfolioPage from "./pages/board/PortfolioPage.tsx";
import SideNavBar from "./components/common/navBarComponent/navBar/SideNavBar.tsx";

const App: React.FC = () => {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/test" element={<SideNavBar />}></Route>
        <Route path="/" element={<PortfolioPage />}></Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/user/signup" element={<UserSignupPage />}></Route>
      </Routes>
      <Footer />
    </>
  );
};

export default App;
