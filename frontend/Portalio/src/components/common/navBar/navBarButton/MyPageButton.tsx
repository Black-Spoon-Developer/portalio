import React from "react";
import { CgProfile } from "react-icons/cg";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../store";
import { sideNavActions } from "../../../../store/nav/SideNavSlice";

const MyPageButton: React.FC = () => {
  const dispatch = useDispatch();

  const selectState = useSelector((state: RootState) => state.sideNav.tabState);

  const onClick = () => {
    dispatch(sideNavActions.selectMypage());
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
