import axiosInstance from "src/helpers/axios";
import { brandConstant } from "./../constant";

export const createBrandByOwner = (data) => {
  return async (dispatch) => {
    try {
      dispatch({ type: brandConstant.BRAND_REQUEST });
      const res = await axiosInstance.post("/create-brand-owner", data);

      if (res.status === 200) {
        dispatch(getBrandByBranchOwner());
        return { result: true, message: "Successfully Created" };
      }
      return { result: false, message: res.data.message };
    } catch (e) {
      return { result: false, message: "Something went Wrong!" };
    }
  };
};

export const getBrandByBranchOwner = () => {
  return async (dispatch) => {
    try {
      dispatch({ type: brandConstant.BRAND_REQUEST });
      const res = await axiosInstance.get("/get-brand-branch-owner");

      if (res.status === 200) {
        dispatch({
          type: brandConstant.GET_BRAND_SUCCESS,
          payload: { brand: res.data.brand },
        });
        return { result: true, message: "Success" };
      }
      dispatch({ type: brandConstant.GET_BRAND_FAIL });
      return { result: false, message: "Fail" };
    } catch (e) {
      dispatch({ type: brandConstant.GET_BRAND_FAIL });
      return { result: false, message: "Fail" };
    }
  };
};

export const brandRemoveImage = (data) => {
  return async (dispatch) => {
    try {
      const res = await axiosInstance.post(
        "/brand-branch-remove-image-owner",
        data
      );

      if (res.status === 200) {
        dispatch(getBrandByBranchOwner());
        return { result: true, message: "Success" };
      }
      return { result: false, message: "Unsuccessful" };
    } catch (e) {
      return { result: false, message: "Something went Wrong" };
    }
  };
};

export const UpdateBrandInfo = (data) => {
  return async (dispatch) => {
    try {
      const res = await axiosInstance.post("/update-brand-branch-owner", data);
      if (res.status === 200) {
        dispatch(getBrandByBranchOwner());
        return { result: true, message: "Updated Successfully" };
      }
      return { result: false, message: res.data.message };
    } catch (e) {
      return { result: false, message: "Something went Wrong" };
    }
  };
};
export const deleteBrandInfo = (data) => {
  return async (dispatch) => {
    try {
      const res = await axiosInstance.post("/deleted-brand-branch-owner", data);
      if (res.status === 200) {
        dispatch(getBrandByBranchOwner());
        dispatch(getDeleteBrandInfo());
        return { result: true, message: "Updated Successfully" };
      }
      return { result: false, message: res.data.message };
    } catch (e) {
      return { result: false, message: "Something went Wrong" };
    }
  };
};

export const getDeleteBrandInfo = () => {
  return async (dispatch) => {
    try {
      dispatch({ type: brandConstant.BRAND_REQUEST });
      const res = await axiosInstance.get("/get-deleted-brand-branch-owner");

      if (res.status === 200) {
        dispatch({
          type: brandConstant.GET_DELETED_BRAND_SUCCESS,
          payload: { brand: res.data.brand },
        });
        return { result: true, message: "Success" };
      }
      dispatch({ type: brandConstant.GET_DELETED_BRAND_FAIL });
      return { result: false, message: "Fail" };
    } catch (e) {
      dispatch({ type: brandConstant.GET_DELETED_BRAND_FAIL });
      return { result: false, message: "Fail" };
    }
  };
};
