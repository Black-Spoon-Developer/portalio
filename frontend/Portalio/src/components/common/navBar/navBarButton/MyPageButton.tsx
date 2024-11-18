import React from "react";
import { CgProfile } from "react-icons/cg";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../store";
import { sideNavActions } from "../../../../store/nav/SideNavSlice";
import { useNavigate } from "react-router-dom";

const MyPageButton: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const memberUsername = useSelector((state: RootState) => state.auth.memberUsername);


  const selectState = useSelector((state: RootState) => state.sideNav.tabState);

  const onClick = () => {
    dispatch(sideNavActions.selectMypage());
    navigate(`/users/profile/${memberUsername}`); // 특정 URL로 이동
  };

  return (
    <>
      <button
        onClick={onClick}
        className={`flex items-center my-8 text-conceptGrey hover:text-conceptSkyBlue font-bold ${
          selectState == "MyPage"
            ? "text-conceptSkyBlue border-l-4 border-conceptSkyBlue"
            : "text-conceptGrey hover:text-conceptSkyBlue"
        }`}
      >
        <CgProfile className="size-8 ml-12 mr-8" />
        <div className="text-lg font-bold tracking-[0.5em]">마이 페이지</div>
      </button>
    </>
  );
};

export default MyPageButton;
