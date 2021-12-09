import { customerConstant } from "../constant";
const initialState = {
  customers: [],
  archived: [],
  loading: false,
  loadingCashierDetails: false,
  allCustomer: [],
};
const customerReducer = (state = initialState, action) => {
  switch (action.type) {
    case customerConstant.CUSTOMER_REQUEST:
      return (state = {
        ...state,
        loading: true,
      });
    case customerConstant.CUSTOMER_CREATE_SUCCESS:
      return (state = {
        ...state,
        customers: [...state.customers, action.payload.customers],
        loading: false,
      });
    case customerConstant.CUSTOMER_CREATE_FAIL:
      return (state = {
        ...state,
        loading: false,
      });
    case customerConstant.GET_CUSTOMER_SUCCESS:
      return (state = {
        ...state,
        customers: action.payload.customers,
        loading: false,
      });
    case customerConstant.GET_CUSTOMER_FAIL:
      return (state = {
        ...state,
        loading: false,
      });
    case customerConstant.GET_ARCHIVED_CUSTOMER_SUCCESS:
      return (state = {
        ...state,
        loading: false,
        archived: action.payload.customers,
      });
    case customerConstant.GET_ARCHIVED_CUSTOMER_FAIL:
      return (state = {
        ...state,
        loading: false,
      });
    case customerConstant.GET_CUSTOMER_ALL_FAIL:
      return (state = {
        ...state,
        loading: false,
      });
    case customerConstant.GET_CUSTOMER_ALL_SUCCESS:
      return (state = {
        ...state,
        loading: false,
        allCustomer: action.payload,
      });
    default:
      return state;
  }
};
export default customerReducer;
