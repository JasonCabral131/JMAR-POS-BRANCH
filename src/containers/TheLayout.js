import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getActiveCashierInformation,
  getCustomerInfo,
  getSales,
} from "src/redux/action";
import { getBrandByBranchOwner } from "src/redux/action/brand.action";
import { getProductByBrandOwner } from "src/redux/action/product.action";
import { getSubcategoryInfo } from "src/redux/action/subcategory.action";
import { TheContent, TheSidebar, TheFooter, TheHeader } from "./index";

const TheLayout = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getBrandByBranchOwner());
    dispatch(getSubcategoryInfo());
    dispatch(getProductByBrandOwner());
    dispatch(getCustomerInfo());
    dispatch(getActiveCashierInformation());
    dispatch(getSales());
    // eslint-disable-next-line
  }, []);
  return (
    <div className="c-app c-default-layout">
      {user && user.status === "owner" ? <TheSidebar /> : null}

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
