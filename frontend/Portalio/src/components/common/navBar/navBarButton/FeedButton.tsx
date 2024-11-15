import React from "react";
import { AiOutlineHome } from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../store";
import { sideNavActions } from "../../../../store/nav/SideNavSlice";

const FeedButton: React.FC = () => {
  const dispatch = useDispatch();

  const selectState = useSelector((state: RootState) => state.sideNav.tabState);

  const onClick = () => {
    dispatch(sideNavActions.selectFeed());
  };

  return (
    <>
      <button
        onClick={onClick}
        className={`flex items-center my-8 text-conceptGrey hover:text-conceptSkyBlue ${
          selectState == "Feed"
            ? "text-conceptSkyBlue border-l-4 border-conceptSkyBlue"
            : "text-conceptGrey hover:text-conceptSkyBlue"
        }`}
      >
        <AiOutlineHome className="size-8 ml-12 mr-8" />
        <div className="text-lg font-bold tracking-[0.5em]">피 드</div>
      </button>
    </>
  );
};

export default FeedButton;
