import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  CHeader,
  CToggler,
  CHeaderNav,
  CSubheader,
  CBreadcrumbRouter,
  CHeaderBrand,
} from "@coreui/react";

// routes config
import routes from "../cashier.routes";
import TheHeaderDropdown from "./TheHeaderDropdown";
import TheHeaderDropdownMssg from "./TheHeaderDropdownMssg";

import storelogo from "src/assets/icons/store.jpg";
import { toCapitalized } from "src/reusable";
import moment from "moment-timezone";

import { logout } from "src/redux/action";

const TheHeader = () => {
  const dispatch = useDispatch();
  const sidebarShow = useSelector((state) => state.coreUiState.sidebarShow);
  const { user } = useSelector((state) => state.auth);
  const [timerNow, setTimerNow] = useState("");
  const toggleSidebar = () => {
    const val = [true, "responsive"].includes(sidebarShow)
      ? false
      : "responsive";
    dispatch({ type: "set", sidebarShow: val });
  };

  const toggleSidebarMobile = () => {
    const val = [false, "responsive"].includes(sidebarShow)
      ? true
      : "responsive";
    dispatch({ type: "set", sidebarShow: val });
  };
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
  useEffect(() => {
    setInterval(function () {
      // Get today's date and time
      if (user) {
        const currentTime = moment(new Date()).tz("Asia/Manila").unix();
        const diffTime =
          user.shiftingSchedule === "night"
            ? nightShift() - currentTime
            : morningShift() - currentTime;
        const duration = moment.duration(diffTime * 1000, "milliseconds");

        const hr = moment.duration(duration).hours();
        const mn = moment.duration(duration).minutes();
        const sec = moment.duration(duration).seconds();
        // If the count down is over, write some text
        setTimerNow(`${hr}h ${mn}m ${sec}sec`);

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
  return (
    <CHeader withSubheader>
      <CToggler
        inHeader
        className="ml-md-3 d-lg-none"
        onClick={toggleSidebarMobile}
      />
      <CToggler
        inHeader
        className="ml-3 d-md-down-none"
        onClick={toggleSidebar}
      />
      <CHeaderBrand className="mx-auto d-lg-none mr-auto m-3" to="/">
        <h4 className="brand-information-header">
          <p>
            {" "}
            {user
              ? user.status === "owner"
                ? user.branch_name + " Store"
                : user.branch.branch_name + " Store"
              : null}{" "}
          </p>
          <img
            alt={"store"}
            src={storelogo}
            className="ml-2"
            style={{ width: "40px", height: "40px" }}
          />
        </h4>
      </CHeaderBrand>
      <CHeaderNav className="d-md-down-none mr-auto m-3">
        <h4 className="brand-information-header">
          <p>
            {" "}
            {user
              ? user.status === "owner"
                ? user.branch_name + " Store"
                : user.branch.branch_name + " Store"
              : null}{" "}
          </p>
          <img
            alt={"store"}
            src={storelogo}
            className="ml-2"
            style={{ width: "40px", height: "40px" }}
          />
        </h4>
      </CHeaderNav>

      <CHeaderNav className="px-3">
        <TheHeaderDropdownMssg />
        <TheHeaderDropdown />
      </CHeaderNav>

      <CSubheader className="px-3 justify-content-between">
        <CBreadcrumbRouter
          className="border-0 c-subheader-nav m-0 px-0 px-md-3"
          routes={routes}
        />
        <div className="d-md-down-none mfe-2 c-subheader-nav">
          <h6 className="mt-1">
            {user
              ? user.status === "cashier"
                ? toCapitalized(` ${user.shiftingSchedule} Shift `) +
                  `${
                    user.shiftingSchedule === "night"
                      ? ` ( 5:00 PM -3:00 Am )`
                      : ` ( 7:00 AM - 5:00 PM )`
                  }`
                : null
              : null}
            <br />
            <span className="mt-2  d-block">
              Time Out : <span className="ml-2 text-danger">{timerNow}</span>
            </span>
          </h6>
        </div>
      </CSubheader>
    </CHeader>
  );
};

export default TheHeader;
