import React from "react";
import { MdCoPresent } from "react-icons/md";

const AIinterviewButton: React.FC = () => {
  return (
    <>
      <button className="flex items-center my-6 text-conceptGrey hover:text-conceptSkyBlue">
        <MdCoPresent className="size-10 ml-12 mr-8" />
        <div className="text-xl font-bold tracking-[0.3em]">모 의 면 접</div>
      </button>
    </>
  );
};

export default AIinterviewButton;
