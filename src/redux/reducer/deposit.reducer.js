import { depositConstant } from "../constant";
const initialState = {
  deposits: [],
  loading: false,
};

const depositReducer = (state = initialState, action) => {
  switch (action.type) {
    case depositConstant.CUSTOMER_DEPOSIT_REQUEST:
      return (state = {
        ...state,
        loading: true,
      });
    case depositConstant.GET_DEPOSIT_SUCCESS:
      return (state = {
        ...state,
        loading: false,
        deposits: action.payload.deposit,
      });
    case depositConstant.GET_DEPOSIT_FAIL:
      return (state = {
        ...state,
        loading: false,
      });
    default:
      return state;
  }
};
export default depositReducer;
