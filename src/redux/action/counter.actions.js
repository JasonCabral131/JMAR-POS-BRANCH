import axiosInstance from "src/helpers/axios";
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
