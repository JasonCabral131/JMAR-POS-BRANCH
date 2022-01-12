import { productConstant } from "../constant";

const initialState = {
  products: [],
  archives: [],
  chartdata: [],
  loading: false,
};

const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case productConstant.PRODUCT_REQUEST:
      return (state = {
        ...state,
        loading: true,
      });
    case productConstant.PRODUCT_CREATE_SUCCESS:
      return (state = {
        ...state,
        loading: false,
        products: [...state.products, action.payload.product],
      });
    case productConstant.PRODUCT_CREATE_FAIL:
      return (state = {
        ...state,
        loading: false,
      });
    case productConstant.GET_PRODUCT_SUCCESS:
      return (state = {
        ...state,
        products: [...action.payload.products],
        chartdata: action.payload.chartdata,
        loading: false,
      });
    case productConstant.GET_PRODUCT_FAIL:
      return (state = {
        ...state,
        loading: false,
      });
    case productConstant.GET_DELETED_PRODUCT_SUCCESS:
      return (state = {
        ...state,
        archives: action.payload.archives,
        loading: false,
      });
    case productConstant.GET_DELETED_PRODUCT_FAIL:
      return (state = {
        ...state,
        loading: false,
      });
    default:
      return state;
  }
};
export default productReducer;
