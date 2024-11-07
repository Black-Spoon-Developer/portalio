import React from "react";
import { MdMailOutline } from "react-icons/md";

const MessageButton: React.FC = () => {
  return (
    <>
      <button className="flex items-center my-6 text-conceptGrey hover:text-conceptSkyBlue font-bold">
        <MdMailOutline className="size-10 ml-12 mr-8" />
        <div className="text-xl font-bold tracking-[0.5em]">쪽 지</div>
      </button>
    </>
  );
};

export default MessageButton;
