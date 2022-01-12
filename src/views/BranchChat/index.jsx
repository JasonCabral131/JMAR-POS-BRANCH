import React, { useState } from "react";
import "./style.scss";
import FullWidthLogo from "src/assets/icons/hamburger_logo_expand.png";
import option1 from "src/assets/icons/cashier.jpg";
import option2 from "src/assets/icons/branch.jpg";
import option3 from "src/assets/icons/customer.png";
import option4 from "src/assets/icons/admin.jpg";
import { Route, Switch, useHistory, Redirect } from "react-router-dom";
import Admin from "./OptionInfo/Admin";
import Cashier from "./OptionInfo/Cashier";
import Branch from "./OptionInfo/Branch";
import Customer from "./OptionInfo/Customer";
import CashierInboxView from "./component/CashierInbox/CashierInboxView";
import BranchInboxView from "./component/BranchInbox/BranchInboxView";
import BranchView from "./component/BranchInbox/index";
import CashierView from "./component/CashierInbox";
import AdminView from "./component/AdminInbox";
import AdminInboxView from "./component/AdminInbox/AdminIbox";
import CustomerView from "./component/CustomerInbox";
import CustomerInboxView from "./component/CustomerInbox/CustomerInboxView";
const BranchChat = (props) => {
  const history = useHistory();
  const [option, setOption] = useState({
    option1: true,
    option2: false,
    option3: false,
    option4: false,
  });
  return (
    <div className="branch-chat-container">
      <div className="branch-chat-heading shadow">
        <div
          className="logo-container"
          onClick={() => {
            history.push("/branch/dashboard");
          }}
        >
          <img alt="logo-jarm" src={FullWidthLogo} />
          <h1> Chat System</h1>
        </div>
      </div>
      <div className="body-chat-system">
        <div className="chat-sidebar-container">
          <div className="list-option-container shadow">
            <div
              className={`list-option-info ${
                option.option1 ? "active-option" : ""
              }`}
              onClick={() => {
                setOption({
                  option1: true,
                  option2: false,
                  option3: false,
                  option4: false,
                });
                history.push("/jarm-chat-system/cashier");
              }}
            >
              <img alt="cashier-logo" src={option1} />
              <div className="status-check">
                <span>1</span>
              </div>
            </div>
            <div
              className={`list-option-info ${
                option.option2 ? "active-option" : ""
              }`}
              onClick={() => {
                setOption({
                  option1: false,
                  option2: true,
                  option3: false,
                  option4: false,
                });
                history.push("/jarm-chat-system/branch");
              }}
            >
              <img alt="cashier-logo" src={option2} />
              <div className="status-check">
                <span>1</span>
              </div>
            </div>
            <div
              className={`list-option-info ${
                option.option3 ? "active-option" : ""
              }`}
              onClick={() => {
                setOption({
                  option1: false,
                  option2: false,
                  option3: true,
                  option4: false,
                });
                history.push("/jarm-chat-system/customer");
              }}
            >
              <img alt="cashier-logo" src={option3} />
              <div className="status-check">
                <span>1</span>
              </div>
            </div>
            <div
              className={`list-option-info ${
                option.option4 ? "active-option" : ""
              }`}
              onClick={() => {
                setOption({
                  option1: false,
                  option2: false,
                  option3: false,
                  option4: true,
                });
                history.push("/jarm-chat-system/admin");
              }}
            >
              <img alt="cashier-logo" src={option4} />
              <div className="status-check">
                <span>1</span>
              </div>
            </div>
          </div>
          {option.option1 ? <Cashier /> : null}
          {option.option2 ? <Branch /> : null}
          {option.option3 ? <Customer /> : null}
          {option.option4 ? <Admin /> : null}
        </div>
        <div className="chat-body-container">
          <Switch>
            <Route
              exact
              component={CashierInboxView}
              path={"/jarm-chat-system/cashier"}
            />
            <Route
              exact
              component={CashierView}
              path={"/jarm-chat-system/cashier/:cashierId"}
            />
            <Route
              exact
              component={BranchView}
              path={"/jarm-chat-system/branch"}
            />
            <Route
              exact
              component={BranchInboxView}
              path={"/jarm-chat-system/branch/:branchId"}
            />
            <Route
              exact
              component={CustomerView}
              path={"/jarm-chat-system/customer"}
            />
            <Route
              exact
              component={CustomerInboxView}
              path={"/jarm-chat-system/customer/:customerId"}
            />
            <Route
              exact
              component={AdminView}
              path={"/jarm-chat-system/admin"}
            />
            <Route
              exact
              component={AdminInboxView}
              path={"/jarm-chat-system/admin/:adminId"}
            />
            <Redirect to={"/jarm-chat-system/cashier"} />
          </Switch>
        </div>
      </div>
    </div>
  );
};
export default BranchChat;
