import React from "react";
import CIcon from "@coreui/icons-react";
import { RiSecurePaymentFill } from "react-icons/ri";
import { IoDocumentTextOutline } from "react-icons/io5";
const _nav = [
  {
    _tag: "CSidebarNavItem",
    name: "Dashboard",
    to: "/dashboard",
    icon: <CIcon name="cil-speedometer" customClasses="c-sidebar-nav-icon" />,
  },
  {
    _tag: "CSidebarNavItem",
    name: "Counter Area",
    to: "/counter-area",
    icon: <RiSecurePaymentFill size="20" className="c-sidebar-nav-icon" />,
  },
  {
    _tag: "CSidebarNavItem",
    name: "Reports",
    to: "/branch/report-information",
    icon: <IoDocumentTextOutline className="c-sidebar-nav-icon " />,
  },
  {
    _tag: "CSidebarNavDivider",
    className: "m-2",
  },
];

export default _nav;
