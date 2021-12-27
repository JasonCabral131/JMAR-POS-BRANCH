import axiosInstance from "src/helpers/axios";
import { subcategoryConstant } from "../constant";

export const createSubcategoryInfo = (data) => {
  return async (dispatch) => {
    try {
      const res = await axiosInstance.post(
        "/create-subcategory-brand-branch-owner",
        data
      );

      if (res.status === 200) {
        dispatch(getSubcategoryInfo());
        return { result: true, message: "Successfully Added" };
      }
      return { result: false, message: res.data.message };
    } catch (e) {
      return { result: false, message: "Unsuccessful" };
    }
  };
};

export const getSubcategoryInfo = () => {
  return async (dispatch) => {
    try {
      dispatch({ type: subcategoryConstant.SUBCATEGORY_REQUEST });
      const res = await axiosInstance.get(
        "/get-brand-subcategory-branch-owner"
      );
      if (res.status === 200) {
        dispatch({
          type: subcategoryConstant.GET_SUBCATEGORY_SUCCESS,
          payload: { subcategory: res.data.subcategory },
        });
        return { result: true, message: "Suucess" };
      }
      return { result: false, message: "Unsuccessful" };
    } catch (e) {
      dispatch({ type: subcategoryConstant.GET_SUBCATEGORY_FAIL });
      return { result: false, message: "Unsuccessful" };
    }
  };
};
export const subCategoryRemoveImage = (data) => {
  return async (dispatch) => {
    try {
      const res = await axiosInstance.post(
        "/subcategory-branch-remove-image-owner",
        data
      );
      if (res.status === 200) {
        dispatch(getSubcategoryInfo());
        return { result: true, message: "Success" };
      }
      return { result: false, message: "Unsuccessful" };
    } catch (e) {
      return { result: false, message: "Something went Wrong" };
    }
  };
};
export const updateSubcategoryInfo = (data) => {
  return async (dispatch) => {
    try {
      const res = await axiosInstance.post(
        "/update-subcategory-brand-branch-owner",
        data
      );
      if (res.status === 200) {
        dispatch(getSubcategoryInfo());
        return { result: true, message: "Updated Successfully" };
      }
      return { result: false, message: res.data.message };
    } catch (error) {
      return { result: false, message: "Something went wrong" };
    }
  };
};
export const ArchivedSubcategoryStatus = (data) => {
  return async (dispatch) => {
    try {
      const res = await axiosInstance.post("/archived-subcategory-data", data);
      if (res.status === 200) {
        dispatch(getArchivedSubcategoryInfo());
        dispatch(getSubcategoryInfo());
        return { result: true, message: "Archived Success" };
      }
      return { result: false, message: res.data.message };
    } catch (error) {
      return { result: false, message: "Something went wrong" };
    }
  };
};
export const getArchivedSubcategoryInfo = () => {
  return async (dispatch) => {
    try {
      const res = await axiosInstance.get("/get-archived-subcategory-data");
      if (res.status === 200) {
        dispatch({
          type: subcategoryConstant.GET_DELETED_SUBCATEGORY_SUCCESS,
          payload: { archived: res.data.subcategory },
        });
        return { result: true, message: "Archived Success" };
      }

      return { result: false, message: res.data.message };
    } catch (error) {
      return { result: false, message: "Something went wrong" };
    }
  };
};
export const getSubCatSales = (data) => {
  return async (dispatch) => {
    try {
      const res = await axiosInstance.post(
        "/get-sub-brand-sales-information",
        data
      );
      if (res.status === 200) {
        return { result: true, POS: res.data.POS, subBrand: res.data.subBrand };
      }
      return { result: false };
    } catch (e) {
      return { result: false };
    }
  };
};
