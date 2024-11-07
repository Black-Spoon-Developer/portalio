import React from "react";
import { AiOutlineHome } from "react-icons/ai";

const FeedButton: React.FC = () => {
  return (
    <>
      <button className="flex items-center my-6 text-conceptGrey hover:text-conceptSkyBlue">
        <AiOutlineHome className="size-10 ml-12 mr-8" />
        <div className="text-xl font-bold tracking-[0.5em]">피 드</div>
      </button>
    </>
  );
};

export default FeedButton;
