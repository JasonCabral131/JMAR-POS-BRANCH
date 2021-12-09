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
  CHeaderNavItem,
  CImg,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";

// routes config
import routes from "../routes";

import {
  TheHeaderDropdown,
  TheHeaderDropdownMssg,
  TheHeaderDropdownNotif,
} from "./index";

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
      <CHeaderBrand className="mx-auto d-lg-none" to="/">
        <h1 className="brand-name">
          <CImg
            src="https://res.cloudinary.com/seven-eleven-grocery-netlify-com/image/upload/v1633504263/logo_umwwru.png"
            className="c-sidebar-brand-full"
            name="logo"
            height="48"
            alt="Logo"
          />
          <p className="p-brand-name">
            {" "}
            {user
              ? user.status === "owner"
                ? user.branch_name + " Branch"
                : user.Owner.branch_name + " Branch"
              : null}{" "}
          </p>
        </h1>
      </CHeaderBrand>

      <CHeaderNav className="d-md-down-none mr-auto">
        <CHeaderNavItem className="px-3">
          <h1 className="brand-name">
            <CImg
              src="https://res.cloudinary.com/seven-eleven-grocery-netlify-com/image/upload/v1633504263/logo_umwwru.png"
              className="c-sidebar-brand-full"
              name="logo-negative"
              height={35}
            />
            <p className="p-brand-name">
              {" "}
              {user
                ? user.status === "owner"
                  ? user.branch_name + " Branch"
                  : user.Owner.branch_name + " Branch"
                : null}{" "}
            </p>
          </h1>
        </CHeaderNavItem>
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
          <CLink className="c-subheader-nav-link" href="#">
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
