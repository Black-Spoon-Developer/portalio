import React from "react";
import FeedButton from "./navBarButton/FeedButton";
import MyPageButton from "./navBarButton/MyPageButton";
// import MessageButton from "./navBarButton/MessageButton";
// import TrendButton from "./navBarButton/TrendButton";
import AIinterviewButton from "./navBarButton/AIinterviewButton";

const SideNavBar: React.FC = () => {
  return (
    <>
      <FeedButton />
      <AIinterviewButton />
      {/* <TrendButton /> */}
      {/* <MessageButton /> */}
      <MyPageButton />
    </>
  );
};

export default SideNavBar;
