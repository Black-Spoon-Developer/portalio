import React from "react";

const UserSettingPage: React.FC = () => {
  const userEmail = "khg9055@gmail.com"; // 사용자의 이메일

  const handleLogout = () => {
    console.log("회원 탈퇴");
    // 회원 탈퇴 로직을 추가하세요
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-4">계정 설정</h1>
      <p className="text-gray-600 mb-6">
        계정 정보를 확인하고 수정할 수 있어요.
      </p>

      <div className="bg-white p-6 rounded-lg shadow-md mb-4">
        <h2 className="text-xl font-medium mb-2">연결된 이메일</h2>
        <div className="flex items-center space-x-4">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
            alt="Google"
            className="w-6 h-6"
          />
          <span className="text-gray-800">{userEmail}</span>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleLogout}
          className="text-white bg-red-500 py-2 px-6 rounded-lg font-semibold hover:bg-red-600"
        >
          탈퇴하기
        </button>
      </div>
    </div>
  );
};

export default UserSettingPage;
