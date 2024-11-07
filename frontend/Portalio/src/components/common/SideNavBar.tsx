import React from "react";
import FeedButton from "./navBarComponent/navBarButton/FeedButton";
import NotificationButton from "./navBarComponent/navBarButton/NotificationButton";
import MessageButton from "./navBarComponent/navBarButton/MessageButton";
import TrendButton from "./navBarComponent/navBarButton/TrendButton";
import AIinterviewButton from "./navBarComponent/navBarButton/AIinterviewButton";

const SideNavBar: React.FC = () => {
  return (
    <>
      <FeedButton />
      <AIinterviewButton />
      <TrendButton />
      <MessageButton />
      <NotificationButton />
    </>
  );
};

export default SideNavBar;
