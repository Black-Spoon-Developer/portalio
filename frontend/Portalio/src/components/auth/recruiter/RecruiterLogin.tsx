import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const RecruiterLogin: React.FC = () => {
  // 비밀번호 가시성 토글 상태
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="text-center">
      <section className="my-5">
        <div className="my-2">
          <input
            type="text"
            placeholder="사업자 번호"
            className="w-5/6 h-14 p-3 text-lg rounded-xl border-2"
          />
        </div>
        <div className="my-2 relative w-5/6 mx-auto">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="비밀번호"
            className="w-full h-14 p-3 pr-12 text-lg rounded-xl border-2" // 오른쪽에 여백을 주기 위해 pr-12 추가
          />
          {/* 눈 아이콘 */}
          <div
            className="absolute inset-y-0 right-4 flex items-center cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash size={24} /> : <FaEye size={24} />}
          </div>
        </div>
      </section>
      <section>
        <div className="my-2">
          <button className="w-5/6 h-14 text-lg font-bold rounded-3xl shadow-md text-white bg-conceptSkyBlue hover:bg-hoverConceptSkyBlue">
            로그인
          </button>
        </div>
        <div>
          <button className="w-5/6 h-14 text-lg font-bold rounded-3xl shadow-md text-white bg-conceptGreen hover:bg-hoverConceptGreen">
            회원가입
          </button>
        </div>
      </section>
    </div>
  );
};

export default RecruiterLogin;
