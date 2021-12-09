import React from "react";
import TheContent from "./TheContent";
import TheHeader from "./TheHeader";
import TheFooter from "./TheFooter";
import TheSidebar from "./TheSidebar";
// import {
//   TheContent,
//   TheSidebar,
//   TheFooter,
//   TheHeader
// } from './index'

const TheLayout = () => {
  return (
    <div className="c-app c-default-layout">
      <TheSidebar />
      <div className="c-wrapper">
        <TheHeader />
        <div className="c-body">
          <TheContent />
        </div>
        <TheFooter />
      </div>
    </div>
  );
};

export default TheLayout;
