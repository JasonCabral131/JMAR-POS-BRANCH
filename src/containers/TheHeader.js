import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  CHeader,
  CToggler,
  CHeaderBrand,
  CHeaderNav,
  CSubheader,
  CBreadcrumbRouter,
  CLink,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";

// routes config
import routes from "../routes";

import {
  TheHeaderDropdown,
  TheHeaderDropdownMssg,
  TheHeaderDropdownNotif,
} from "./index";
import storelogo from "src/assets/icons/store.jpg";
const TheHeader = () => {
  const dispatch = useDispatch();
  const sidebarShow = useSelector((state) => state.coreUiState.sidebarShow);
  const { user } = useSelector((state) => state.auth);
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
        <TheHeaderDropdownNotif />
        <TheHeaderDropdownMssg />
        <TheHeaderDropdown />
      </CHeaderNav>

      <CSubheader className="px-3 justify-content-between">
        <CBreadcrumbRouter
          className="border-0 c-subheader-nav m-0 px-0 px-md-3"
          routes={routes}
        />
        <div className="d-md-down-none mfe-2 c-subheader-nav">
          <CLink className="c-subheader-nav-link">
            <CIcon name="cil-speech" alt="Settings" />
          </CLink>
          <CLink
            className="c-subheader-nav-link"
            aria-current="page"
            to="/dashboard"
          >
            <CIcon name="cil-graph" alt="Dashboard" />
            &nbsp;Dashboard
          </CLink>
        </div>
      </CSubheader>
    </CHeader>
  );
};

export default TheHeader;
