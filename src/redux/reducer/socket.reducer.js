import { socketConstant } from "../constant";

const INITIAL_STATE = {
  socket: null,
  request: false,
};
const socketReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case socketConstant.LOGIN_SOCKET_CONNECTION:
      return (state = {
        ...state,
        socket: action.payload.socket,
      });
    case socketConstant.DISCONNECT_SOCKET_CONNECTION:
      return (state = {
        ...state,
        socket: null,
      });
    default:
      return state;
  }
};
export default socketReducer;
