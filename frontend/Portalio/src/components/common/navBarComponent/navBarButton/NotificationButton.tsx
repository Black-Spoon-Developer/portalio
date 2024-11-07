import React from "react";
import { MdOutlineNotifications } from "react-icons/md";

const NotificationButton: React.FC = () => {
  return (
    <>
      <button className="flex items-center my-6 text-conceptGrey hover:text-conceptSkyBlue font-bold ">
        <MdOutlineNotifications className="size-10 ml-12 mr-8" />
        <div className="text-xl font-bold tracking-[0.5em]">알 림</div>
      </button>
    </>
  );
};

export default NotificationButton;
