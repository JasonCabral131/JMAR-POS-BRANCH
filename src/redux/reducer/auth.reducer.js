import { authConstant } from "./../constant/";

const INITIAL_STATE = {
  token: null,
  user: null,
  isAuthenticated: false,
  authenticating: false,
};

const authReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case authConstant.LOGIN_REQUEST:
      return (state = {
        ...state,
        authenticating: true,
      });

    case authConstant.LOGIN_SUCCESS:
      return (state = {
        ...state,
        token: action.payload.token,
        isAuthenticated: true,
        authenticating: false,
        user: action.payload.user,
      });

    case authConstant.LOGOUT_SUCCESS:
      return (state = {
        ...INITIAL_STATE,
      });

    default:
      return state;
  }
};

export default authReducer;
