import axiosInstance from "src/helpers/axios";
import { logout } from ".";
import { taxConstant } from "../constant";
import Swal from "sweetalert2";
export const createTaxInfo = (data) => {
  return async (dispatch) => {
    try {
      dispatch({ type: taxConstant.TAX_REQUEST });
      const res = await axiosInstance.post("/create-government-tax", data);
      if (res.status === 200) {
        dispatch(getTaxInfo());
        Swal.fire({
          icon: "success",
          text: "Successfully Added",
          timer: 2000,
        });
        return true;
      }
      Swal.fire({
        icon: "error",
        text: res.data.message,
        timer: 2000,
      });
      return false;
    } catch (e) {
      Swal.fire({
        icon: "error",
        text: "Something went wrong",
        timer: 2000,
      });

      dispatch(logout());
      return false;
    }
  };
};

export const getTaxInfo = () => {
  return async (dispatch) => {
    try {
      dispatch({ type: taxConstant.TAX_REQUEST });
      const res = await axiosInstance.get("/get-government-tax");
      if (res.status === 200) {
        dispatch({
          type: taxConstant.GET_TAX_SUCCESS,
          payload: { governmentTax: res.data.governmentTax },
        });
        return true;
      }
      return false;
    } catch (e) {
      dispatch(logout());
      return false;
    }
  };
};
export const updateTaxInfo = (data) => {
  return async (dispatch) => {
    try {
      dispatch({ type: taxConstant.TAX_REQUEST });
      const res = await axiosInstance.post("/update-government-tax", data);
      if (res.status === 200) {
        dispatch(getTaxInfo());
        Swal.fire({
          icon: "success",
          text: "Successfully Updated",
          timer: 2000,
        });
        return true;
      }
      Swal.fire({
        icon: "error",
        text: res.data.message,
        timer: 2000,
      });
      return false;
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: "Something went wrong",
        timer: 2000,
      });

      dispatch(logout());
      return false;
    }
  };
};
export const archivedTaxInfo = (data) => {
  return async (dispatch) => {
    try {
      dispatch({ type: taxConstant.TAX_REQUEST });
      const res = await axiosInstance.post("/archived-government-tax", data);
      if (res.status === 200) {
        dispatch(getTaxInfo());
        dispatch(getArchivedTaxInfo());
        Swal.fire({
          icon: "success",
          text: "Successfully Updated",
          timer: 2000,
        });
        return true;
      }
      Swal.fire({
        icon: "error",
        text: res.data.message,
        timer: 2000,
      });
      return false;
    } catch (e) {
      Swal.fire({
        icon: "error",
        text: "Something went wrong",
        timer: 2000,
      });
      dispatch(logout());
      return false;
    }
  };
};

export const getArchivedTaxInfo = () => {
  return async (dispatch) => {
    try {
      dispatch({ type: taxConstant.TAX_REQUEST });
      const res = await axiosInstance.get("/get-archived-government-tax");
      if (res.status === 200) {
        dispatch({
          type: taxConstant.GET_ARCHIVED_TAX_SUCCESS,
          payload: { governmentTax: res.data.governmentTax },
        });
        return true;
      }
      return false;
    } catch (e) {
      dispatch(logout());
      return false;
    }
  };
};
