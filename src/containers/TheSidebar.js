import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  CCreateElement,
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarNavDivider,
  CSidebarNavTitle,
  CSidebarMinimizer,
  CSidebarNavDropdown,
  CSidebarNavItem,
  CImg,
} from "@coreui/react";

// sidebar nav config
import navigation from "./_nav";
import FullWidthLogo from "./../assets/icons/hamburger_logo_expand.png";
import MinimizeLogo from "./../assets/icons/Jarm_Logo.svg";
const TheSidebar = () => {
  const dispatch = useDispatch();
  const show = useSelector((state) => state.coreUiState.sidebarShow);

  return (
    <CSidebar
      show={show}
      onShowChange={(val) => dispatch({ type: "set", sidebarShow: val })}
    >
      <CSidebarBrand className="d-md-down-none" to="/">
        <CImg
          src={FullWidthLogo}
          className="c-sidebar-brand-full"
          name="logo-negative"
          height={35}
        />
        <CImg
          src={MinimizeLogo}
          className="c-sidebar-brand-minimized"
          name="sygnet"
          height={35}
        />
      </CSidebarBrand>
      <CSidebarNav>
        <CCreateElement
          items={navigation}
          components={{
            CSidebarNavDivider,
            CSidebarNavDropdown,
            CSidebarNavItem,
            CSidebarNavTitle,
          }}
        />
      </CSidebarNav>
      <CSidebarMinimizer className="c-d-md-down-none" />
    </CSidebar>
  );
};

export default React.memo(TheSidebar);
