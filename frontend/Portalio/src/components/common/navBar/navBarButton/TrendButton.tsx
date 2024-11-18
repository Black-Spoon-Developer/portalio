import React from "react";
import { HiOutlineDocumentSearch } from "react-icons/hi";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { useNavigate } from "react-router-dom";

const TrendButton: React.FC = () => {
  const navigate = useNavigate();
  const selectState = useSelector((state: RootState) => state.sideNav.tabState);

  const onClick = () => {
    navigate("/employment")
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
