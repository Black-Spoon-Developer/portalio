import React from "react";
import { HiOutlineDocumentSearch } from "react-icons/hi";

const TrendButton: React.FC = () => {
  return (
    <>
      <button className="flex items-center my-6 text-conceptGrey hover:text-conceptSkyBlue font-bold">
        <HiOutlineDocumentSearch className="size-10 ml-12 mr-8" />
        <div className="text-xl font-bold tracking-[0.3em]">채 용 정 보</div>
      </button>
    </>
  );
};

export default TrendButton;
