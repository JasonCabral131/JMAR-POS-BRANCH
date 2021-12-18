import axiosInstance from "src/helpers/axios";
import cashierAxios from "src/helpers/cashierAxios";
import Swal from "sweetalert2";
import { salesConstant } from "../constant";

export const cashierPay = (data) => {
  return async (dispatch) => {
    try {
      console.log(data);
      const res = await axiosInstance.post("/counter-sale-routing", data);
      if (res.status === 200) {
        return { result: true, message: res.data.message };
      }
      return { result: false, message: res.data.message };
    } catch (e) {
      return { result: false, message: "Something went wrong" };
    }
  };
};
export const getSales = () => {
  return async (dispatch) => {
    try {
      dispatch({ type: salesConstant.SALES_REQUEST });
      const res = await axiosInstance.get("/get-brand-owner-sales");
      if (res.status === 200) {
        dispatch({
          type: salesConstant.GET_SALES_SUCCESS,
          payload: res.data.POS,
        });
        return { result: true, POS: res.data.POS };
      }
      dispatch({ type: salesConstant.GET_SALES_FAIL });
      return { result: false };
    } catch (e) {
      dispatch({ type: salesConstant.GET_SALES_FAIL });
      return { result: false };
    }
  };
};
export const cashierCounter = (data) => {
  return async (dispatch) => {
    try {
      const res = await cashierAxios.post("/cashier-counter-pay", data);
      if (res.status === 200) {
        Swal.fire("Success", res.data.message, "success");
        return true;
      }
      Swal.fire("Warning", res.data.message, "warning");
      return false;
    } catch (e) {
      if (e.response.status === 400) {
        Swal.fire("Warning", e.response.data.message, "error");
        return false;
      }
      Swal.fire("Warning", e, "error");
      return false;
    }
  };
};
export const getCashierSales = () => {
  return async (dispatch) => {
    try {
      dispatch({ type: salesConstant.SALES_REQUEST });
      const res = await cashierAxios.get("/get-cashier-sale");
      if (res.status === 200) {
        dispatch({
          type: salesConstant.GET_SALES_SUCCESS,
          payload: res.data.POS,
        });
        return { result: true, POS: res.data.POS };
      }
      dispatch({ type: salesConstant.GET_SALES_FAIL });
      return { result: false };
    } catch (e) {
      dispatch({ type: salesConstant.GET_SALES_FAIL });
      return { result: false };
    }
  };
};
