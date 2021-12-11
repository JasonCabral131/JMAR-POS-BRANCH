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
import { useSelector } from "react-redux";
import shortid from "shortid";
const TheLayout = () => {
  const { user } = useSelector((state) => state.auth);

  const { socket } = useSelector((state) => state.socket);
  if (user) {
    if (socket) {
      if (!window.location.hash) {
        window.location = window.location + `#${shortid.generate()}`;
        window.location.reload();
      }
    }
  }
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
