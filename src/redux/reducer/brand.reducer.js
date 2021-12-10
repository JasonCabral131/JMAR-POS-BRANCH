import { brandConstant } from "../constant";

const initialState = {
  brand: [],
  deletedBrandItemHistory: [],
  loading: false,
};

const brandReducer = (state = initialState, action) => {
  switch (action.type) {
    case brandConstant.BRAND_REQUEST:
      return (state = {
        ...state,
        loading: true,
      });
    case brandConstant.BRAND_CREATE_SUCCESS:
      return (state = {
        ...state,
        loading: false,
        brand: [...state.brand, action.payload.brand],
      });
    case brandConstant.BRAND_CREATE_FAIL:
      return (state = {
        ...state,
        loading: false,
      });
    case brandConstant.GET_BRAND_SUCCESS:
      return (state = {
        ...state,
        brand: action.payload.brand,
        loading: false,
      });
    case brandConstant.GET_BRAND_FAIL:
      return (state = {
        ...state,
        loading: false,
      });
    case brandConstant.GET_DELETED_BRAND_SUCCESS:
      return (state = {
        ...state,
        deletedBrandItemHistory: action.payload.brand,
        loading: false,
      });
    case brandConstant.GET_DELETED_BRAND_FAIL:
      return (state = {
        ...state,
        loading: false,
      });
    default:
      return state;
  }
};

export default brandReducer;
