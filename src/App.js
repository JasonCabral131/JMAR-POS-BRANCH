import React, { useEffect } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import "./scss/style.scss";
import { useSelector, useDispatch } from "react-redux";
import { checkIsStillValidOwner, logout } from "./redux/action";
import io from "socket.io-client";
import { apiConfig } from "./helpers/apiConfig";
import {
  disconnectSocketConnect,
  socketConnection,
} from "./redux/action/socket.action";
import { CounterArea } from "./views/counter";

// Containers
import TheLayout from "./containers/TheLayout";

import CashierLayout from "./CashierContainer/TheLayout";
// Pages
import HomePage from "./views/pages/Home/index";

import Page404 from "./views/pages/page404/Page404";

const App = (props) => {
  const dispatch = useDispatch();
  const { isAuthenticated, user, token } = useSelector((state) => state.auth);

  const handleToken = () => {
    if (token) {
      const { status, _id } = user;
      if (typeof status !== "undefined") {
        if (status === "owner") {
          dispatch(checkIsStillValidOwner({ token, _id }));
        } else if (status === "cashier") {
        } else {
          dispatch(logout());
        }
      } else {
        dispatch(logout());
      }
    } else {
      dispatch(logout());
    }
  };

  useEffect(() => {
    handleToken();
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    if (token) {
      const newSocket = io(apiConfig.socketApi, {
        query: {
          token,
        },
      });

      newSocket.on("disconnect", () => {
        dispatch(disconnectSocketConnect());
      });
      newSocket.on("connect", () => {
        newSocket.emit("AddToActive", { user }, (data) => {});
        dispatch(socketConnection(newSocket));
      });
    } else {
      dispatch(disconnectSocketConnect());
    }
    // eslint-disable-next-line
  }, [token]);

  return (
    <BrowserRouter>
      <Switch>
        <Route
          path="/JARM/"
          name="JARM"
          render={(props) => {
            return isAuthenticated ? (
              <Redirect to="/branch/dashboard" {...props} />
            ) : (
              <HomePage {...props} />
            );
          }}
        />

        <Route
          exact
          path="/404"
          name="Page 404"
          render={(props) => <Page404 {...props} />}
        />
        <Route
          exact
          path="/counter-area"
          name="Counter Area"
          render={(props) => {
            return !isAuthenticated ? (
              <Redirect to="/JARM/home" {...props} />
            ) : (
              <CounterArea {...props} />
            );
          }}
        />
        <Route
          path="/branch/"
          name="Home"
          render={(props) => {
            return !isAuthenticated ? (
              <Redirect to="/JARM/home" {...props} />
            ) : user && user.status === "owner" ? (
              <TheLayout {...props} />
            ) : (
              <Redirect to="/cashier/dashboard" />
            );
          }}
        />
        <Route
          path="/cashier/"
          name="Cashier"
          render={(props) => {
            return !isAuthenticated ? (
              <Redirect to="/JARM/home" {...props} />
            ) : user && user.status === "cashier" ? (
              <CashierLayout {...props} />
            ) : (
              <Redirect to="/branch/dashboard" />
            );
          }}
        />
        <Redirect to="/branch/dashboard" />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
