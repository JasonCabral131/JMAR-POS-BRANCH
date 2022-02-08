import React, { useState } from "react";
import "src/views/BranchChat/style.scss";
import FullWidthLogo from "src/assets/icons/hamburger_logo_expand.png";
import { useHistory, Switch, Route, Redirect } from "react-router-dom";
// import option1 from "src/assets/icons/cashier.jpg";
import option2 from "src/assets/icons/storeKo.jpg";
import BranchView from "./UserView/BranchView.js";
import BranchChatContent from "./component/Branch/index.jsx";
import { useEffect } from "react";
import moment from "moment-timezone";
import { logout } from "src/redux/action";
import { useDispatch, useSelector } from "react-redux";
import boopSfx from "src/assets/ringtunes/messenger.mp3";
const CashierChatSystem = (props) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { socket } = useSelector((state) => state.socket);
  const [option, setOption] = useState({
    option1: false,
    option2: true,
  });
  const nightShift = () => {
    let someDate = new Date();
    let result = someDate.setDate(someDate.getDate() + 1);
    const settingHr = new Date(result).setHours(3);
    const settingMin = new Date(settingHr).setMinutes(0);
    const setSec = new Date(settingMin).setSeconds(0);
    return moment(new Date(setSec)).tz("Asia/Manila").unix();
  };
  const morningShift = () => {
    const someDate = new Date();
    const settingHr = new Date(someDate).setHours(17);
    const settingMin = new Date(settingHr).setMinutes(0);
    const setSec = new Date(settingMin).setSeconds(0);
    return moment(new Date(setSec)).tz("Asia/Manila").unix();
  };
  const history = useHistory();
  useEffect(() => {
    setInterval(function () {
      // Get today's date and time
      if (user) {
        const currentTime = moment(new Date()).tz("Asia/Manila").unix();
        const diffTime =
          user.shiftingSchedule === "night"
            ? nightShift() - currentTime
            : morningShift() - currentTime;
        // If the count down is over, write some text

        if (diffTime < 0) {
          dispatch(logout());
        }
      }
    }, 1000);
    return () => {
      clearInterval();
    };
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    if (socket) {
      if (user) {
        socket.on("new-message-send-by-branch", async (data) => {
          let audio = new Audio(boopSfx);
          audio.play();
        });
      }
    }
    // eslint-disable-next-line
  }, [socket]);
  return (
    <div className="branch-chat-container">
      <div className="branch-chat-heading shadow">
        <div
          className="logo-container"
          onClick={() => {
            history.push("/cashier/dashboard");
          }}
        >
          <img alt="logo-jarm" src={FullWidthLogo} />
          <h1 className="chat-system-h1"> Chat System</h1>
        </div>
      </div>
      <div className="body-chat-system">
        <div className="chat-sidebar-container">
          <div className="list-option-container shadow">
            <div
              className={`list-option-info ${
                option.option2 ? "active-option" : ""
              }`}
              onClick={() => {
                setOption({
                  option1: false,
                  option2: true,
                });
                history.push("/jarm-chat-system/branch");
              }}
            >
              <img alt="cashier-logo" src={option2} />
            </div>
            {/* <div
              className={`list-option-info ${
                option.option1 ? "active-option" : ""
              }`}
              onClick={() => {
                setOption({
                  option1: true,
                  option2: false,
                });
                history.push("/jarm-chat-system/cashier");
              }}
            >
              <img alt="cashier-logo" src={option1} />
            </div> */}
          </div>
          {option.option2 ? <BranchView /> : null}
        </div>
        <div className="chat-body-container">
          <Switch>
            <Route
              exact
              component={BranchChatContent}
              path={"/jarm-chat-system/my-store"}
            />
            <Redirect to={"/jarm-chat-system/my-store"} />
          </Switch>
        </div>
      </div>
    </div>
  );
};
export default CashierChatSystem;
