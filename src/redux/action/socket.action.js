import { socketConstant } from "../constant";

export const socketConnection = (socket) => {
  return (dispatch) => {
    dispatch({
      type: socketConstant.LOGIN_SOCKET_CONNECTION,
      payload: { socket },
    });
  };
};

export const disconnectSocketConnect = () => {
  return (dispatch) => {
    dispatch({ type: socketConstant.DISCONNECT_SOCKET_CONNECTION });
  };
};
