import React from "react";
import { HiOutlineDocumentSearch } from "react-icons/hi";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../store";
import { sideNavActions } from "../../../../store/nav/SideNavSlice";

const TrendButton: React.FC = () => {
  const dispatch = useDispatch();
  const selectState = useSelector((state: RootState) => state.sideTab.tabState);

  const onClick = () => {
    dispatch(sideNavActions.selectJobInfo());
  };

  return (
    <>
      <button
        onClick={onClick}
        className={`flex items-center my-8 text-conceptGrey hover:text-conceptSkyBlue font-bold ${
          selectState == "JobInfo"
            ? "text-conceptSkyBlue border-l-4 border-conceptSkyBlue"
            : "text-conceptGrey hover:text-conceptSkyBlue"
        }`}
      >
        <HiOutlineDocumentSearch className="size-8 ml-12 mr-8" />
        <div className="text-lg font-bold tracking-[0.3em]">채 용 정 보</div>
      </button>
    </>
  );
};

export default TrendButton;
