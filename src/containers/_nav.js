import React from "react";
import CIcon from "@coreui/icons-react";
import { SiBloglovin } from "react-icons/si";
import {
  RiSecurePaymentFill,
  RiUserStarLine,
  RiGovernmentLine,
} from "react-icons/ri";
import { MdSecurity, MdOutlineInventory } from "react-icons/md";
import { GiPayMoney } from "react-icons/gi";
import { FaPeopleCarry } from "react-icons/fa";
import { IoDocumentTextOutline } from "react-icons/io5";
import { FcPositiveDynamic } from "react-icons/fc";
const _nav = [
  {
    _tag: "CSidebarNavItem",
    name: "Dashboard",
    to: "/branch/dashboard",
    icon: <CIcon name="cil-speedometer" customClasses="c-sidebar-nav-icon" />,
  },
  {
    _tag: "CSidebarNavItem",
    name: "Blogs",
    to: "/branch/BlogPosting",
    icon: <SiBloglovin size="20" className="c-sidebar-nav-icon" />,
    badge: {
      color: "info",
      text: "create New",
    },
  },
  {
    _tag: "CSidebarNavItem",
    name: "Counter Area",
    to: "/counter-area",
    icon: <RiSecurePaymentFill size="20" className="c-sidebar-nav-icon" />,
  },
  {
    _tag: "CSidebarNavTitle",
    _children: ["Store Data"],
  },
  {
    _tag: "CSidebarNavDropdown",
    name: "Inventory Item",
    route: "/base",
    icon: <MdOutlineInventory className="c-sidebar-nav-icon" />,
    _children: [
      {
        _tag: "CSidebarNavItem",
        name: "Brand",
        to: "/branch/inventory-item/brand",
      },
      {
        _tag: "CSidebarNavItem",
        name: "Brand Subcategory",
        to: "/branch/inventory-item/sub-brand",
      },
      {
        _tag: "CSidebarNavItem",
        name: "Product",
        to: "/branch/inventory-item/product",
      },
    ],
  },

  {
    _tag: "CSidebarNavDropdown",
    name: "Government Tax",

    icon: <RiGovernmentLine className="c-sidebar-nav-icon" />,
    _children: [
      {
        _tag: "CSidebarNavItem",
        name: "Tax",
        to: "/branch/inventory-item/government-tax",
        badge: {
          color: "success",
          text: "NEW",
        },
      },
      {
        _tag: "CSidebarNavItem",
        name: "Tax Remitted",
        to: "/branch/tax/tax-remitted",
      },
    ],
  },
  {
    _tag: "CSidebarNavDropdown",
    name: "Cashier ",

    icon: <FaPeopleCarry className="c-sidebar-nav-icon" />,
    _children: [
      {
        _tag: "CSidebarNavItem",
        name: "Cashier Staff",
        to: "/branch/branch-cashier-information",
      },
      {
        _tag: "CSidebarNavItem",
        name: "Scheduling",
        to: "/branch/branch-cashier-information/scheduling",
      },
    ],
  },
  {
    _tag: "CSidebarNavItem",
    name: "Customer",
    to: "/branch/branch-customer-information",
    icon: <RiUserStarLine className="c-sidebar-nav-icon" />,
  },

  {
    _tag: "CSidebarNavItem",
    name: "Deposit Customer Account",
    to: "/branch/deposit-customer",
    icon: <GiPayMoney className="c-sidebar-nav-icon" />,
  },
  {
    _tag: "CSidebarNavItem",
    name: "Roles and Permission",
    to: "/branch/roles-permission",
    icon: <MdSecurity className="c-sidebar-nav-icon" />,
  },
  {
    _tag: "CSidebarNavItem",
    name: "Reports",
    to: "/branch/report-information",
    icon: <IoDocumentTextOutline className="c-sidebar-nav-icon " />,
  },
  {
    _tag: "CSidebarNavItem",
    name: "Sales",
    to: "/branch/sales-information",
    icon: <FcPositiveDynamic className="c-sidebar-nav-icon" color="#FFFFFF" />,
  },

  {
    _tag: "CSidebarNavDivider",
    className: "m-2",
  },
];

export default _nav;
