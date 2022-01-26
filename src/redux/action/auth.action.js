import { authConstant } from "./../constant";
import axiosInstance from "src/helpers/axios";
import Swal from "sweetalert2";
import cashierAxios from "src/helpers/cashierAxios";
import { disconnectSocketConnect } from "./socket.action";
import { Store } from "../store";
import axios from "axios";
import { apiConfig } from "src/helpers/apiConfig";
export const login = (user_info) => {
  return async (dispatch) => {
    try {
      dispatch({ type: authConstant.LOGIN_REQUEST });
      const res = await axiosInstance.post("/login-branch", {
        ...user_info,
      });

      if (res.status === 200) {
        const { token, user } = res.data;
        await dispatch({
          type: authConstant.LOGIN_SUCCESS,
          payload: {
            token,
            user,
          },
        });
        return { result: true, user };
      } else {
        dispatch({ type: authConstant.LOGIN_FAILURE });
        return { result: false, message: res.data.message };
      }
    } catch (e) {
      return { result: false, message: "Something went wrong" };
    }
  };
};
export const logout = () => {
  return async (dispatch) => {
    const user = Store.getState().auth.user;
    if (user) {
      if (user.status === "cashier") {
        await cashierAxios.post("/logout-cashier-from-server", {
          user: user,
        });
      }
    }
    dispatch({ type: authConstant.LOGOUT_SUCCESS });
    dispatch(disconnectSocketConnect());
  };
};

export const checkIsStillValidOwner = (data) => {
  return async (dispatch) => {
    try {
      const res = await axiosInstance.post("/is-grant-access-owner", {
        ...data,
      });
      if (res.status === 200) {
        const { user, token } = res.data;
        await dispatch({
          type: authConstant.LOGIN_SUCCESS,
          payload: {
            token,
            user,
          },
        });
        return { result: true };
      } else {
        dispatch(logout());
        return { result: false };
      }
    } catch (e) {
      dispatch(logout());
      return { result: false };
    }
  };
};

export const checkIsStillValidcashier = (data) => {
  return async (dispatch) => {
    try {
      const res = await cashierAxios.post("/is-access-granted-cashier", {
        ...data,
      });
      if (res.status === 200) {
        const { user, token } = res.data;
        await dispatch({
          type: authConstant.LOGIN_SUCCESS,
          payload: {
            token,
            user,
          },
        });
        return { result: true };
      } else {
        dispatch(logout());
        return { result: false };
      }
    } catch (e) {
      dispatch(logout());
      return { result: false };
    }
  };
};
export const checkAuthenicatingPassword = (data) => {
  return async (dispatch) => {
    try {
      const res = await axiosInstance.post(
        "/check-authentication-to-next",
        data
      );
      if (res.status === 200) {
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
        text: "Invalid Password",
      });
      return false;
    }
  };
};

export const loginCashier = (data) => {
  return async (dispatch) => {
    try {
      dispatch({ type: authConstant.LOGIN_REQUEST });
      const res = await cashierAxios.post("/login-store-cashier", data);
      if (res.status === 200) {
        const { token, user } = res.data;
        await dispatch({
          type: authConstant.LOGIN_SUCCESS,
          payload: {
            token,
            user,
          },
        });
        return { result: true, user };
      } else {
        dispatch({ type: authConstant.LOGIN_FAILURE });
        return { result: false, message: res.data.message };
      }
    } catch (e) {
      return { result: false, message: e.response.data.message };
    }
  };
};
export const getNotification = (data) => {
  return async (dispatch) => {
    try {
      const res = await axiosInstance.get("/get-notification-branch");
      if (res.status === 200) {
        return { result: true, notif: res.data };
      }
      return { result: false };
    } catch (e) {
      return { result: false };
    }
  };
};
export const updateNotification = (data) => {
  return async (dispatch) => {
    try {
      await axiosInstance.post("/update-notification-branch", data);
    } catch (e) {
      return false;
    }
  };
};
export const deleteNotification = (data) => {
  return async (dispatch) => {
    try {
      await axiosInstance.post("/delete-notification-branch", data);
    } catch (e) {
      return false;
    }
  };
};
export const signUpBranch = (data) => {
  return async (dispatch) => {
    try {
      const res = await axios.post(
        `${apiConfig.socketApi}/api-7-11-administrative/sign-up-store-membership`,
        data
      );
      if (res.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Successfully Created",
          text: "You'll recieved an email After We accept Your Membership",
        });
        return { result: true };
      }
      Swal.fire({
        icon: "warning",
        title: "Failed Submission",
        text: res.data.message,
      });
      return { result: false };
    } catch (e) {
      Swal.fire({
        icon: "warning",
        text: "Under Maintenance In Backend We will back in a few minutes",
      });
      return { result: false };
    }
  };
};

export const forgotStoreOwnerPassword = (data) => {
  return async (dispatch) => {
    try {
      const res = await axiosInstance.post(
        "/store-owner-email-verification",
        data
      );
      if (res.status === 200) {
        Swal.fire({
          icon: "success",
          text: "Check your email",
        });
        return true;
      }
      Swal.fire({
        icon: "warning",
        text: res.data.msg,
      });
      return true;
    } catch (e) {
      Swal.fire({
        icon: "warning",
        text: "Email Not Found",
      });
      return false;
    }
  };
};
