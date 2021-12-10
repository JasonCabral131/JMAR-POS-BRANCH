import { salesConstant } from "../constant";
const initialState = {
  sales: null,
  loading: false,
};
const salesReducer = (state = initialState, action) => {
  switch (action.type) {
    case salesConstant.SALES_REQUEST:
      return (state = {
        ...state,
        loading: true,
      });
    case salesConstant.GET_SALES_SUCCESS:
      return (state = {
        ...state,
        loading: false,
        sales: action.payload,
      });
    case salesConstant.GET_SALES_FAIL:
      return (state = {
        ...state,
        loading: false,
      });
    default:
      return state;
  }
};
export default salesReducer;
