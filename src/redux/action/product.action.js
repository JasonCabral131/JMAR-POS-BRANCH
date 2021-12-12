import axiosInstance from "src/helpers/axios";
//import cashierAxios from "src/helpers/cashierAxios";
import { logout } from "./auth.action";
import { productConstant, taxConstant } from "../constant";
import axios from "axios";

export const createProductInfo = (data) => {
  return async (dispatch) => {
    try {
      const res = await axiosInstance.post(
        "/create-product-brand-branch-owner",
        data
      );

      if (res.status === 200) {
        dispatch({
          type: productConstant.PRODUCT_CREATE_SUCCESS,
          payload: { product: res.data.product },
        });
        return { result: true, message: "Successfully Created!" };
      }
      return { result: false, message: res.data.message };
    } catch (e) {
      dispatch(logout());
      return { result: false, message: "Something went Wrong!" };
    }
  };
};

export const getProductByBrandOwner = () => {
  return async (dispatch) => {
    try {
      dispatch({ type: productConstant.PRODUCT_REQUEST });
      const res = await axiosInstance.get("/get-product-brand-branch-owner");

      if (res.status === 200) {
        dispatch({
          type: productConstant.GET_PRODUCT_SUCCESS,
          payload: { products: res.data.products },
        });
        return { result: true };
      }
      dispatch({ type: productConstant.GET_PRODUCT_FAIL });
      return { result: false };
    } catch (e) {
      dispatch(logout());
      dispatch({ type: productConstant.GET_PRODUCT_FAIL });
      return { result: false, message: "Something went Wrong!" };
    }
  };
};
export const updateProductInfo = (data) => {
  return async (dispatch) => {
    try {
      const res = await axiosInstance.post(
        "/update-product-brand-branch-owner",
        data
      );
      if (res.status === 200) {
        dispatch(getProductByBrandOwner());
        return { result: true, message: "Successfully updated" };
      }
      return { result: false, message: res.data.message };
    } catch (error) {
      dispatch(logout());
      return { return: false, message: "Something went wrong" };
    }
  };
};
export const deleteProductImage = (data) => {
  return async (dispatch) => {
    try {
      const res = await axiosInstance.post(
        "/delete-product-image-brand-branch-owner",
        data
      );
      if (res.status === 200) {
        dispatch(getProductByBrandOwner());
        return { result: true, message: "Successfully updated" };
      }
      return { result: false, message: res.data.message };
    } catch (e) {
      dispatch(logout());
      return { result: false, message: "Something went wront" };
    }
  };
};
export const changeProductStatus = (data) => {
  return async (dispatch) => {
    try {
      const res = await axiosInstance.post(
        "/archived-product-by-branch-owner",
        data
      );
      if (res.status === 200) {
        dispatch(getProductByBrandOwner());
        dispatch(getArchivedProduct());
        return { result: true, message: "Success" };
      }
      return { result: false, message: res.data.message };
    } catch (e) {
      dispatch(logout());
      return { result: false, message: "Something went Wrong" };
    }
  };
};
export const getArchivedProduct = () => {
  return async (dispatch) => {
    try {
      dispatch({ type: productConstant.PRODUCT_REQUEST });
      const res = await axiosInstance.get(
        "/get-archived-product-by-branch-owner"
      );
      if (res.status === 200) {
        dispatch({
          type: productConstant.GET_DELETED_PRODUCT_SUCCESS,
          payload: { archives: res.data.archives },
        });
        console.log(res.data.archives);
        return { result: true, message: res.data.message };
      }
      dispatch({ type: productConstant.GET_DELETED_PRODUCT_FAIL });
      return { result: false, message: res.data.message };
    } catch (e) {
      dispatch(logout());
      return { result: false, message: "Something went wrong" };
    }
  };
};

export const getCounterProductByCashier = (data) => {
  return async (dispatch) => {
    try {
      const { token } = data;
      dispatch({ type: productConstant.PRODUCT_REQUEST });
      const res = await axios({
        method: "post",
        url: `http://localhost:8000/api-jarm-cashier/get-product-by-branch`,
        data: data,
        headers: { authorization: token ? `Bearer ${token}` : "" },
      });

      if (res.status === 200) {
        dispatch({
          type: productConstant.GET_PRODUCT_SUCCESS,
          payload: { products: res.data.products },
        });
        dispatch({
          type: taxConstant.GET_ARCHIVED_TAX_SUCCESS,
          payload: { governmentTax: res.data.taxs },
        });
        return { result: true };
      }
      dispatch({ type: productConstant.GET_PRODUCT_FAIL });
      return { result: false };
    } catch (e) {
      dispatch({ type: productConstant.GET_PRODUCT_FAIL });
      return { result: false, message: "Something went Wrong!" };
    }
  };
};
