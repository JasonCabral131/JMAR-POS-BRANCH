import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./auth.reducer";

import coreUiReducer from "./coreui.reducer";
import brandReducer from "./brand.reducer";
import subcategoryReducer from "./subcategory.reducer";
import productReducer from "./product.reducer";
import taxReducer from "./tax.reducer";
import socketReducer from "./socket.reducer";
import cashierReducer from "./cashier.reducer";
import customerReducer from "./customer.reducer";
import depositReducer from "./deposit.reducer";
import salesReducer from "./sales.reducers";
export const rootReducer = combineReducers({
  coreUiState: coreUiReducer,
  auth: authReducer,
  brand: brandReducer,
  subcategory: subcategoryReducer,
  product: productReducer,
  tax: taxReducer,
  socket: socketReducer,
  cashier: cashierReducer,
  customer: customerReducer,
  deposit: depositReducer,
  sales: salesReducer,
});
const configStorage = {
  key: "root",
  storage,
  blacklist: [
    "socket",
    "coreUiState",
    "brand",
    "subcategory",
    "product",
    "tax",
    "socket",
    "cashier",
    "customer",
    "deposit",
    "sales",
  ],
};
export default persistReducer(configStorage, rootReducer);
