import { authConstant } from "./../constant";
import axiosInstance from "src/helpers/axios";
import Swal from "sweetalert2";
import cashierAxios from "src/helpers/cashierAxios";

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
    dispatch({ type: authConstant.LOGOUT_SUCCESS });
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
