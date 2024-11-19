import React, { useState } from "react";
import Logo from "../../assets/Logo.png";
import TempImg from "../../assets/TempServiceImg.png";
import UserLogin from "../../components/auth/user/UserLogin";
import RecruiterLogin from "../../components/auth/recruiter/RecruiterLogin";

const LoginPage: React.FC = () => {
  // 개인 & 채용 담당자 상태 관리 (기본값: 개인)
  const [isUserLogin, setIsUserLogin] = useState(true);

  return (
    <div className="min-h-screen">
      {/* 로그인 부분 */}
      <div className="my-8">
        {/* 큰 로고 */}
        <header className="flex justify-center">
          <img src={Logo} alt="no-image" className="w-1/5" />
        </header>
        {/* 로그인 박스 */}
        <body className="flex flex-col items-center">
          <div className="flex border-2 p-8 rounded-lg w-2/3 bg-white shadow-md my-8">
            <section className="w-full flex justify-center mb-4">
              {/* 소개 이미지 */}
              <img
                src={TempImg}
                alt="Service Image"
                className="w-full rounded-lg"
              />
            </section>
            {/* 구분선 */}
            <div className="mx-4 w-0.5 bg-conceptGrey h-auto"></div>
            {/* 개인 유저 구분 탭 */}
            <section className="w-full flex flex-col justify-center">
              <div>
                <div className="flex justify-around my-4">
                  <button
                    onClick={() => setIsUserLogin(true)}
                    className={`text-2xl font-bold ${
                      isUserLogin ? "text-conceptSkyBlue" : "text-conceptGrey"
                    } hover:text-conceptSkyBlue`}
                  >
                    개인
                  </button>
                  {/* <button
                    onClick={() => setIsUserLogin(false)}
                    className={`text-2xl font-bold ${
                      !isUserLogin ? "text-conceptSkyBlue" : "text-conceptGrey"
                    } hover:text-conceptSkyBlue`}
                  >
                    채용 담당자
                  </button> */}
                </div>
              </div>
              {/* 로그인 부분 */}
              {isUserLogin ? <UserLogin /> : <RecruiterLogin />}
            </section>
          </div>
        </body>
      </div>
    </div>
  );
};

export default LoginPage;
