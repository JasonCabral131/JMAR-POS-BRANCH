import axios from "axios";
import { apiConfig } from "src/helpers/apiConfig";
import axiosInstance from "src/helpers/axios";
import Swal from "sweetalert2";
import { customerConstant } from "../constant";

export const createCustomerInfo = (data) => {
  return async (dispatch) => {
    try {
      const res = await axiosInstance.post("/create-branch-customer", data);
      if (res.status === 200) {
        dispatch(getCustomerInfo());
        Swal.fire({
          icon: "success",
          titleText: "Account still pending",
          text: "Wait for administrative response",
        });
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
        text: "Failed to create",
      });
      dispatch({ type: customerConstant.CUSTOMER_CREATE_FAIL });
    }
  };
};
export const getCustomerInfo = () => {
  return async (dispatch) => {
    try {
      dispatch({ type: customerConstant.CUSTOMER_REQUEST });
      const res = await axiosInstance.get("/get-branch-customer");
      if (res.status === 200) {
        dispatch({
          type: customerConstant.GET_CUSTOMER_SUCCESS,
          payload: { customers: res.data.customers },
        });
        return true;
      }
      dispatch({ type: customerConstant.GET_CUSTOMER_FAIL });
      return true;
    } catch (e) {
      dispatch({ type: customerConstant.GET_CUSTOMER_FAIL });
      return false;
    }
  };
};
export const changeCustomerStatus = (data) => {
  return async (dispatch) => {
    try {
      const res = await axiosInstance.post(
        "/change-status-branch-customer",
        data
      );
      if (res.status === 200) {
        dispatch(getCustomerInfo());
        dispatch(getArhivedCustomerData());
        Swal.fire({
          icon: "success",
          text: "Successfully Archived",
        });
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
        text: "Failed to Archived this Data",
      });
      return false;
    }
  };
};
export const getArhivedCustomerData = () => {
  return async (dispatch) => {
    try {
      dispatch({ type: customerConstant.CUSTOMER_REQUEST });
      const res = await axiosInstance.get("/get-archived-branch-customer");
      if (res.status === 200) {
        dispatch({
          type: customerConstant.GET_ARCHIVED_CUSTOMER_SUCCESS,
          payload: { customers: res.data.customers },
        });
        return true;
      }
      dispatch({ type: customerConstant.GET_ARCHIVED_CUSTOMER_FAIL });
      return false;
    } catch (e) {
      dispatch({ type: customerConstant.GET_ARCHIVED_CUSTOMER_FAIL });
      return false;
    }
  };
};
export const searchExistingCustomer = (data) => {
  return async (dispatch) => {
    try {
      const res = await axiosInstance.post(
        "/get-branch-customer-exist-save",
        data
      );
      if (res.status === 200) {
        return { result: true, data: res.data.customer };
      }
      Swal.fire({
        icon: "warning",
        title: res.data.heading,
        text: res.data.message,
      });
      return { result: false };
    } catch (e) {
      Swal.fire({
        icon: "warning",
        title: "Failed",
        text: "Failed to Create",
      });
      return { result: false };
    }
  };
};

export const registeredCustomer = (data) => {
  return async (dispatch) => {
    try {
      const api = apiConfig.landingPage + "/registering-customer-information";
      const res = await axios.post(api, data);
      if (res.status === 200) {
        Swal.fire({
          icon: "success",
          titleText: "Account still pending",
          text: "Wait for administrative response, Will Send An Email Back To You",
        });
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
        text: "Failed to create",
      });
      return false;
    }
  };
};
export const verifyCustomerToken = (data) => {
  return async (dispatch) => {
    try {
      const api = apiConfig.landingPage + "/customer-token-verification";
      const res = await axios.post(api, data);
      if (res.status === 200) {
        return true;
      }
      Swal.fire({
        icon: "error",
        text: "Invalid Customer Information",
      });
      return false;
    } catch (e) {
      Swal.fire({
        icon: "error",
        text: "Invalid Customer Information",
      });
      return false;
    }
  };
};
export const verifyCustomerEmail = (data) => {
  return async (dispatch) => {
    try {
      const api = apiConfig.landingPage + "/customer-email-verification";
      const res = await axios.post(api, data);
      if (res.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Successfully",
          text: "Please Check your email",
        });
        return true;
      }
      Swal.fire({
        icon: "error",
        text: "Email not found",
      });
      return false;
    } catch (e) {
      Swal.fire({
        icon: "warning",
        text: "Email not found",
      });
      return false;
    }
  };
};
export const verifyCustomerUpdatePasswordToken = (data) => {
  return async (dispatch) => {
    try {
      const api =
        apiConfig.landingPage + "/customer-password-token-verification";
      const res = await axios.post(api, data);
      if (res.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Successfully",
          text: "Password Successfully changed",
        });
        return true;
      }
      Swal.fire({
        icon: "error",
        text: "Failed to Updated Customer Password Information",
      });
      return false;
    } catch (e) {
      Swal.fire({
        icon: "warning",
        text: "Failed to Updated Customer Password Information",
      });
      return false;
    }
  };
};
export const getRegisteredCustomerInformationToQrcode = (data) => {
  return async (dispatch) => {
    try {
      const api =
        apiConfig.landingPage +
        "/get-registered-customer-information-to-qrcode";
      const res = await axios.post(api, data);
      if (res.status === 200) {
        return { result: true, customer: res.data.customer };
      }
      Swal.fire({
        icon: "warning",
        text: res.data.message,
      });
      return { result: false };
    } catch (e) {
      Swal.fire({
        icon: "warning",
        text: "No Data Found",
      });
      return { result: false };
    }
  };
};
export const getRegisteredCustomerInformationPurchase = (data) => {
  return async (dispatch) => {
    try {
      const api =
        apiConfig.landingPage +
        "/get-registered-customer-information-to-purchase";
      const res = await axios.post(api, data);
      if (res.status === 200) {
        return { result: true, purchase: res.data.purchase };
      }
      Swal.fire({
        icon: "warning",
        text: res.data.message,
      });
      return { result: false };
    } catch (e) {
      Swal.fire({
        icon: "warning",
        text: "Not Data Found",
      });
      return { result: false };
    }
  };
};
export const addExistingCustomerToBranch = (data) => {
  return async (dispatch) => {
    try {
      const res = await axiosInstance.post(
        "/add-customer-to-branch-owner",
        data
      );
      if (res.status === 200) {
        dispatch(getCustomerInfo());
        Swal.fire({
          icon: "success",
          text: "Successfully Created",
        });
        return true;
      }
      Swal.fire({
        icon: "warning",
        title: res.data.heading,
        text: res.data.message,
      });
      return false;
    } catch (e) {
      Swal.fire({
        icon: "error",
        text: "Failed to Add",
      });
      return false;
    }
  };
};

export const getAllCustomer = () => {
  return async (dispatch) => {
    try {
      dispatch({ type: customerConstant.CUSTOMER_REQUEST });
      const res = await axiosInstance.get("/get-banned-active-customer-branch");
      if (res.status === 200) {
        dispatch({
          type: customerConstant.GET_CUSTOMER_ALL_SUCCESS,
          payload: res.data.customers,
        });
        return;
      }
      dispatch({ type: customerConstant.GET_CUSTOMER_FAIL });
    } catch (e) {
      dispatch({ type: customerConstant.GET_CUSTOMER_FAIL });
    }
  };
};
export const updateStatusPermissionOfCustomer = (data) => {
  return async (dispatch) => {
    try {
      const res = await axiosInstance.post(
        "/update-customer-role-status-branch",
        data
      );
      if (res.status === 200) {
        dispatch(getAllCustomer());
        dispatch(getCustomerInfo());
        Swal.fire({
          icon: "success",
          text: "Successfully Status Permission",
        });
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
