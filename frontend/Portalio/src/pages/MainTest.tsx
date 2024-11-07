import React from "react";
// import { issueAccessToken } from "../api/AuthAPI";

const MainTest: React.FC = () => {
  // useEffect(() => {
  //   // const fetchData = async () => {
  //   //   // access 토큰 저장
  //   //   const fetchAccessToken = async () => {
  //   //     const isLogin = localStorage.getItem("isLogin");
  //   //     const accessToken = localStorage.getItem("access");

  //   //     if (accessToken == null && isLogin == "true") {
  //   //       const newAccessToken = await issueAccessToken();
  //   //       if (newAccessToken) {
  //   //         localStorage.setItem("access", newAccessToken);
  //   //       }
  //   //     }
  //   //   };

  //   //   await fetchAccessToken(); // access 토큰 가져오기
  //   };

  //   fetchData(); // 비동기 함수 실행
  // }, []);

  return (
    <>
      <div>안녕하세요</div>
      <div>메인 페이지 test</div>
    </>
  );
};

export default MainTest;
