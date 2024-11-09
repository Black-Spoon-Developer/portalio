import React from "react";
import PortfolioDetailMd from "../../../components/board/portfolio/PortfolioDetailMd";
import PortfolioDetailComments from "../../../components/board/portfolio/PortfolioDetailComments";
import SideNavBar from "../../../components/common/navBar/SideNavBar";

const PortfolioDetailPage: React.FC = () => {
  return (
    <div className="grid grid-cols-5 min-h-screen">
      <div className="fixed top-48 left-0 h-full">
        <SideNavBar />
      </div>
      <div className="col-span-1"></div>
      <div className="mx-5 my-8 col-span-3">
        <PortfolioDetailMd />
        <PortfolioDetailComments />
      </div>
      <div className="col-span-1"></div>
    </div>
  );
};

export default PortfolioDetailPage;
