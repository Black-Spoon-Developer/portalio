import React from "react";
import { MdMailOutline } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../store";
import { sideNavActions } from "../../../../store/nav/SideNavSlice";

const MessageButton: React.FC = () => {
  const dispatch = useDispatch();

  const selectState = useSelector((state: RootState) => state.sideNav.tabState);

  // 탭 상태 변환
  const onClick = () => {
    dispatch(sideNavActions.selectMessage());
  };

  return (
    <>
      <button
        onClick={onClick}
        className={`flex items-center my-8 text-conceptGrey hover:text-conceptSkyBlue font-bold ${
          selectState == "Message"
            ? "text-conceptSkyBlue border-l-4 border-conceptSkyBlue"
            : "text-conceptGrey hover:text-conceptSkyBlue"
        }`}
      >
        <MdMailOutline className="size-8 ml-12 mr-8" />
        <div className="text-lg font-bold tracking-[0.5em]">쪽 지</div>
      </button>
    </>
  );
};

export default MessageButton;
