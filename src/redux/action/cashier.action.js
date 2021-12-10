import axiosInstance from "src/helpers/axios";
import { cashierConstant } from "../constant";
import Swal from "sweetalert2";

export const createCashierBranchInfo = (data) => {
  return async (dispatch) => {
    try {
      dispatch({ type: cashierConstant.CASHIER_REQUEST });
      const res = await axiosInstance.post("/create-branch-cashier", data);
      if (res.status === 200) {
        dispatch(getActiveCashierInformation());
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Check Roles And Permission to have an Access this Account",
        });
        return { result: true, message: "Create Success" };
      }
      Swal.fire({
        icon: "warning",
        text: res.data.message,
      });
      return { result: false, message: res.data.message };
    } catch (e) {
      Swal.fire({
        icon: "warning",
        text: "Failed to Creat",
      });
      return { result: false, message: "Failed to create" };
    }
  };
};

export const getActiveCashierInformation = () => {
  return async (dispatch) => {
    try {
      dispatch({ type: cashierConstant.CASHIER_REQUEST });
      const res = await axiosInstance.get("/get-branch-cashier");
      if (res.status === 200) {
        dispatch({
          type: cashierConstant.GET_CASHIER_SUCCESS,
          payload: { cashier: res.data.cashier },
        });
      }
      dispatch({ type: cashierConstant.GET_CASHIER_FAIL });
    } catch (e) {
      dispatch({ type: cashierConstant.GET_CASHIER_FAIL });
    }
  };
};

export const updateCashierInformation = (data) => {
  return async (dispatch) => {
    try {
      const res = await axiosInstance.post("/update-branch-cashier", data);
      if (res.status === 200) {
        dispatch(getActiveCashierInformation());
        Swal.fire({
          icon: "success",
          text: "Successfully Updated",
        });
        return { result: true, message: "Successfully Updated" };
      }
      Swal.fire({
        icon: "warning",
        text: res.data.message,
      });
      dispatch({ type: cashierConstant.GET_CASHIER_FAIL });
      return { result: false, message: res.data.message };
    } catch (e) {
      Swal.fire({
        icon: "warning",
        text: "Failed to Updated",
      });
      dispatch({ type: cashierConstant.GET_CASHIER_FAIL });
      return { result: false, message: "Failed to Updated" };
    }
  };
};

export const archivedCashierData = (data) => {
  return async (dispatch) => {
    try {
      const res = await axiosInstance.post("/change-status-cashier", data);
      if (res.status === 200) {
        dispatch(getActiveCashierInformation());
        dispatch(getArchivedBranchCashierData());
        Swal.fire({
          icon: "success",
          text: "Archived Data Success",
        });
        return true;
      }
      Swal.fire({
        icon: "warning",
        text: "Failed to Archived",
      });
      return false;
    } catch (e) {
      Swal.fire({
        icon: "error",
        text: "Check Internet Connection",
      });
      return false;
    }
  };
};
export const getArchivedBranchCashierData = () => {
  return async (dispatch) => {
    try {
      dispatch({ type: cashierConstant.CASHIER_REQUEST });
      const res = await axiosInstance.get("/get-archived-cashier");
      if (res.status === 200) {
        dispatch({
          type: cashierConstant.GET_ARCHIVED_CASHIER_SUCCESS,
          payload: { cashier: res.data.cashier },
        });
      }
      dispatch({ type: cashierConstant.GET_ARCHIVED_CASHIER_FAIL });
    } catch {
      dispatch({ type: cashierConstant.GET_ARCHIVED_CASHIER_FAIL });
      return false;
    }
  };
};
export const removeCashierBranch = (data) => {
  return async (dispatch) => {
    try {
      const res = await axiosInstance.post("/removed-branch-cashier", data);
      if (res.status === 200) {
        Swal.fire({
          icon: "success",
          text: "Successfully removed",
        });
        dispatch(getActiveCashierInformation());
        dispatch(getArchivedBranchCashierData());
        return;
      }

      Swal.fire({
        icon: "error",
        text: res.data.message,
      });
      return;
    } catch (e) {
      Swal.fire({
        icon: "error",
        text: "Failed to deleted",
      });
      return;
    }
  };
};

export const UpdateSchedule = (data) => {
  return async (dispatch) => {
    try {
      const res = await axiosInstance.post(
        "/update-schedule-cashier-info",
        data
      );
      if (res.status === 200) {
        Swal.fire({
          icon: "success",
          text: "Successfully Updated Cashier ShiftingSchedule",
        });
        dispatch(getActiveCashierInformation());
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
        text: "Failed to Updated Schedule",
      });
      return false;
    }
  };
};
export const updateStatus = (data) => {
  return async (dispatch) => {
    try {
      const res = await axiosInstance.post(
        "/update-status-cashier-information",
        data
      );
      if (res.status === 200) {
        Swal.fire({
          icon: "success",
          text: "Roles Success Fully Updated",
        });
        dispatch(getActiveCashierInformation());
        dispatch(getBannedPendingCashierBranch());
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
        text: "Failed to Updated",
      });
      return false;
    }
  };
};

export const getBannedPendingCashierBranch = (data) => {
  return async (dispatch) => {
    try {
      dispatch({ type: cashierConstant.CASHIER_REQUEST });
      const res = await axiosInstance.get("/get-banned-pending-cashier-branch");
      if (res.status === 200) {
        dispatch({
          type: cashierConstant.GET_CASHIER_BANNED_PENDING_SUCCESS,
          payload: res.data.cashier,
        });
        return;
      }
      dispatch({ type: cashierConstant.GET_CASHIER_BANNED_PENDING_FAIL });
      return;
    } catch (e) {
      dispatch({ type: cashierConstant.GET_CASHIER_BANNED_PENDING_FAIL });
      return;
    }
  };
};
