import { taxConstant } from "../constant";

const initialState = {
  tax: [],
  archivedTax: [],
  request: false,
};
const taxReducer = (state = initialState, action) => {
  switch (action.type) {
    case taxConstant.TAX_REQUEST:
      return (state = {
        ...state,
        loading: true,
      });
    case taxConstant.TAX_CREATE_SUCCESS:
      return (state = {
        ...state,
        loading: false,
        tax: [...state.tax, action.payload.governmentTax],
      });
    case taxConstant.TAX_CREATE_FAIL:
      return (state = {
        ...state,
        loading: false,
      });
    case taxConstant.GET_TAX_SUCCESS:
      return (state = {
        ...state,
        loading: false,
        tax: action.payload.governmentTax,
      });
    case taxConstant.GET_TAX_FAIL:
      return (state = {
        ...state,
        loading: false,
      });
    case taxConstant.GET_ARCHIVED_TAX_SUCCESS:
      return (state = {
        ...state,
        loading: false,
        archivedTax: action.payload.governmentTax,
      });
    case taxConstant.GET_ARCHIVED_TAX_FAIL:
      return (state = {
        ...state,
        loading: false,
      });
    default:
      return state;
  }
};

export default taxReducer;
