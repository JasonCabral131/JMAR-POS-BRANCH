import "bootstrap/dist/css/bootstrap.min.css";
import "react-loading-skeleton/dist/skeleton.css";
import "@react-page/editor/lib/index.css";
import "draft-js/dist/Draft.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import "react-app-polyfill/ie11"; // For IE 11 support
import "react-app-polyfill/stable";

import "core-js";
import "./polyfill";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

import { icons } from "./assets/icons";

import { Provider } from "react-redux";
import { Store, persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
React.icons = icons;

ReactDOM.render(
  <Provider store={Store}>
    <PersistGate persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
