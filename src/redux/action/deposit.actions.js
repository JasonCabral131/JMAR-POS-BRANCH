import axiosInstance from "src/helpers/axios";
import Swal from "sweetalert2";
import { depositConstant } from "../constant";

export const depositCustomer = (data) => {
  return async (dispatch) => {
    try {
      const res = await axiosInstance.post("/deposit-customer-to-branch", data);
      if (res.status === 200) {
        Swal.fire({
          icon: "success",
          title: "SuccessFully Deposit",
        });
        dispatch(getDepositCustomer());
        return true;
      }
      Swal.fire({
        icon: "warning",
        text: res.data.message,
      });
      return false;
    } catch (e) {
      Swal.fire({
        icon: "warning",
        text: "Failed to Deposit",
      });
      return false;
    }
  };
};
export const getDepositCustomer = () => {
  return async (dispatch) => {
    try {
      dispatch({ type: depositConstant.CUSTOMER_DEPOSIT_REQUEST });
      const res = await axiosInstance.get("/get-deposit-customer-to-branch");
      if (res.status === 200) {
        dispatch({
          type: depositConstant.GET_DEPOSIT_SUCCESS,
          payload: { deposit: res.data.deposit },
        });
        return;
      }
      dispatch({ type: depositConstant.GET_DEPOSIT_FAIL });
    } catch (e) {}
  };
};
export const sendingVerficationCode = (data) => {
  return async (dispatch) => {
    try {
      const res = await axiosInstance.post("/deposit-confirmation-code", data);
      if (res.status === 200) {
        Swal.fire({
          icon: "success",
          text: "Confirmation Successfully Send",
        });
        return {
          result: true,
          encrytedConfirmationCode: res.data.encrytedConfirmationCode,
        };
      }
      Swal.fire({
        icon: "warning",
        text: res.data.message,
      });
      return {
        result: false,
        encrytedConfirmationCode: res.data.encrytedConfirmationCode,
      };
    } catch (e) {
      Swal.fire({
        icon: "warning",
        text: "Confirmation Code send",
      });
      return { result: false };
    }
  };
};
export const addingDepositCustomer = (data) => {
  return async (dispatch) => {
    try {
      const res = await axiosInstance.post(
        "/adding-deposit-customer-branch",
        data
      );
      if (res.status === 200) {
        Swal.fire({
          icon: "success",
          text: "SuccessFully Deposited",
        });
        dispatch(getDepositCustomer());
        return true;
      }
      Swal.fire({
        icon: "warning",
        text: res.data.message,
      });

      return false;
    } catch (e) {
      Swal.fire({
        icon: "error",
        text: "Failed to Updated",
      });
      return false;
    }
  };
};
export const getDepositCustomerHistory = (data) => {
  return async (dispatch) => {
    try {
      const res = await axiosInstance.post(
        "/get-deposit-customer-branch-history",
        data
      );
      if (res.status === 200) {
        return { result: true, customer: res.data.customer };
      }
      return { result: false };
    } catch (e) {
      return { result: false };
    }
  };
};
