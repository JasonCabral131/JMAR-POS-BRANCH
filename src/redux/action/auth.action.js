import { authConstant } from "./../constant";
import axiosInstance from "src/helpers/axios";
import Swal from "sweetalert2";

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

export const checkIsStillValidInventorycashier = (data) => {
  return async (dispatch) => {
    try {
      const res = await axiosInstance.post("/is-access-granted", { ...data });
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
