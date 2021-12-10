import { cashierConstant } from "../constant";
const initialState = {
  cashier: [],
  archived: [],
  loading: false,
  loadingCashierDetails: false,
  bannedPending: [],
};

const cashierReducer = (state = initialState, action) => {
  switch (action.type) {
    case cashierConstant.CASHIER_REQUEST:
      return (state = {
        ...state,
        loading: true,
      });
    case cashierConstant.CASHIER_CREATE_SUCCESS:
      return (state = {
        ...state,
        cashier: [...state.cashier, action.payload.cashier],
        loading: false,
      });
    case cashierConstant.CASHIER_CREATE_FAIL:
      return (state = {
        ...state,
        loading: false,
      });
    case cashierConstant.GET_CASHIER_SUCCESS:
      return (state = {
        ...state,
        cashier: action.payload.cashier,
        loading: false,
      });
    case cashierConstant.GET_CASHIER_FAIL:
      return (state = {
        ...state,
        loading: false,
      });
    case cashierConstant.GET_ARCHIVED_CASHIER_SUCCESS:
      return (state = {
        ...state,
        loading: false,
        archived: action.payload.cashier,
      });
    case cashierConstant.GET_CASHIER_BANNED_PENDING_FAIL:
      return (state = {
        ...state,
        loading: false,
      });
    case cashierConstant.GET_CASHIER_BANNED_PENDING_SUCCESS:
      return (state = {
        ...state,
        loading: false,
        bannedPending: action.payload,
      });
    case cashierConstant.GET_ARCHIVED_CASHIER_FAIL:
      return (state = {
        ...state,
        loading: false,
      });
    default:
      return state;
  }
};
export default cashierReducer;
