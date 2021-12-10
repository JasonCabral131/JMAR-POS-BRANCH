import axios from "axios";
import { Store } from "../redux/store";
import { apiConfig } from "./apiConfig";
const token = Store.getState().auth.token;
const cashierAxios = axios.create({
  baseURL: apiConfig.cashierApi,
  headers: { authorization: token ? `Bearer ${token}` : "" },
});
cashierAxios.interceptors.request.use((req) => {
  const { auth } = Store.getState();
  if (auth.token) {
    req.headers.authorization = `Bearer ${auth.token}`;
  }
  return req;
});

export default cashierAxios;
