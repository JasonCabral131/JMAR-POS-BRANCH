import React, { useState } from "react";
import "src/views/BranchChat/style.scss";
import FullWidthLogo from "src/assets/icons/hamburger_logo_expand.png";
import { Switch, useHistory, Route, Redirect } from "react-router-dom";
import option1 from "src/assets/icons/cashier.jpg";
import option2 from "src/assets/icons/storeKo.jpg";
import BranchChatContent from "./component/Branch";
import BranchView from "./UserView/BranchView.js";

const CashierChatSystem = (props) => {
  const [option, setOption] = useState({
    option1: false,
    option2: true,
  });
  const history = useHistory();
  return (
    <div className="branch-chat-container">
      <div className="branch-chat-heading shadow">
        <div
          className="logo-container"
          onClick={() => {
            history.push("/cashier/dashboard");
          }}
        >
          <img alt="logo-jarm" src={FullWidthLogo} />
          <h1 className="chat-system-h1"> Chat System</h1>
        </div>
      </div>
      <div className="body-chat-system">
        <div className="chat-sidebar-container">
          <div className="list-option-container shadow">
            <div
              className={`list-option-info ${
                option.option2 ? "active-option" : ""
              }`}
              onClick={() => {
                setOption({
                  option1: false,
                  option2: true,
                });
                history.push("/jarm-chat-system/my-store-owner");
              }}
            >
              <img alt="cashier-logo" src={option2} />
            </div>
            <div
              className={`list-option-info ${
                option.option1 ? "active-option" : ""
              }`}
              onClick={() => {
                setOption({
                  option1: true,
                  option2: false,
                });
                history.push("/jarm-chat-system/cashier");
              }}
            >
              <img alt="cashier-logo" src={option1} />
            </div>
          </div>
          {option.option2 ? <BranchView /> : null}
        </div>
        <div className="chat-body-container">
          <Switch>
            <Route
              exact
              component={BranchChatContent}
              path={"/jarm-chat-system/my-store-owner"}
            />
            <Redirect to={"/jarm-chat-system/my-store-owner"} />
          </Switch>
        </div>
      </div>
    </div>
  );
};
export default CashierChatSystem;
