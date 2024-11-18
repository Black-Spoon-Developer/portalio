import React from "react";
import { MdCoPresent } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../store";
import { sideNavActions } from "../../../../store/nav/SideNavSlice";
import { useNavigate } from "react-router-dom";

const AIinterviewButton: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const selectState = useSelector((state: RootState) => state.sideNav.tabState);

  // 탭 상태 변환
  const onClick = () => {
    dispatch(sideNavActions.selectAIinterview());
    navigate("/ai/introduce");
  };

  // 나중에 라우터 경로 설정을 통해서 페이지 이동하게 하면 됩니다.

  return (
    <>
      <button
        onClick={onClick}
        className={`flex items-center my-8 text-conceptGrey hover:text-conceptSkyBlue ${
          selectState == "AIinterview"
            ? "text-conceptSkyBlue border-l-4 border-conceptSkyBlue"
            : "text-conceptGrey hover:text-conceptSkyBlue"
        }`}
      >
        <MdCoPresent className="size-8 ml-12 mr-8" />
        <div className="text-lg font-bold tracking-[0.3em]">모 의 면 접</div>
      </button>
    </>
  );
};

export default AIinterviewButton;
