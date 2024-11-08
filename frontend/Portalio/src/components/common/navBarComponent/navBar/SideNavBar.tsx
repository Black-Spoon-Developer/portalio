import React from "react";
import FeedButton from "../navBarButton/FeedButton";
import NotificationButton from "../navBarButton/NotificationButton";
import MessageButton from "../navBarButton/MessageButton";
import TrendButton from "../navBarButton/TrendButton";
import AIinterviewButton from "../navBarButton/AIinterviewButton";

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
