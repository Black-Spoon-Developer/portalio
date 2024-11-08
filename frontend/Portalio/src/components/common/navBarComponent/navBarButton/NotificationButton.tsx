import React from "react";
import { MdOutlineNotifications } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../store";
import { sideTabActions } from "../../../../store/tab/SideTabSlice";

const NotificationButton: React.FC = () => {
  const dispatch = useDispatch();

  const selectState = useSelector((state: RootState) => state.sideTab.tabState);

  const onClick = () => {
    dispatch(sideTabActions.selectNotification());
  };

  return (
    <>
      <button
        onClick={onClick}
        className={`flex items-center my-8 text-conceptGrey hover:text-conceptSkyBlue font-bold ${
          selectState == "Notification"
            ? "text-conceptSkyBlue border-l-4 border-conceptSkyBlue"
            : "text-conceptGrey hover:text-conceptSkyBlue"
        }`}
      >
        <MdOutlineNotifications className="size-8 ml-12 mr-8" />
        <div className="text-lg font-bold tracking-[0.5em]">알 림</div>
      </button>
    </>
  );
};

export default NotificationButton;
