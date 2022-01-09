import React, { useRef } from "react";
import "./Home.css";
import {
  Navbar,
  Header,
  Footer,
  Blog,
  Member,
  RegisterCustomer,
} from "./../components/";
import { Switch, Route, Redirect } from "react-router-dom";
import { AiOutlineArrowUp } from "react-icons/ai";
import Login from "../../login";
import Register from "../../register/Register";
import CustomerForgotPassword from "../components/Member/forgotPassword";
import CustomerChangePassword from "../components/Member/ChangePassword";
const App = (props) => {
  const toTopRef = useRef();
  const topFunction = () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  };
  window.onscroll = function () {
    scrollFunction();
  };

  function scrollFunction() {
    if (
      document.body.scrollTop > 20 ||
      document.documentElement.scrollTop > 20
    ) {
      if (toTopRef) {
        if (toTopRef.current) {
          if (toTopRef.current.style) {
            toTopRef.current.style.display = "block";
          }
        }
      }
    } else {
      if (toTopRef) {
        if (toTopRef.current) {
          if (toTopRef.current.style) {
            toTopRef.current.style.display = "none";
          }
        }
      }
    }
  }
  return (
    <div className="app-body">
      <button
        className="button-top gradient__bg"
        onClick={topFunction}
        ref={toTopRef}
      >
        <AiOutlineArrowUp color={"#fff"} size={20} />
      </button>
      <div className="gradient__bg pb-1">
        <Navbar {...props} />

        <Switch>
          <Route
            exact
            path="/JARM/home"
            name="Home Landing Page"
            render={(props) => <Header {...props} />}
          />
          <Route
            exact
            path="/JARM/blog"
            name="Blog Landing Page"
            render={(props) => <Blog {...props} />}
          />
          <Route
            exact
            path="/JARM/customer"
            name="Customer Member Landing Page"
            render={(props) => <Member {...props} />}
          />
          <Route
            exact
            path="/JARM/customer/register"
            name="Home"
            render={(props) => <RegisterCustomer {...props} />}
          />
          <Route
            exact
            path="/JARM/customer/forgot-password"
            name="Home"
            render={(props) => <CustomerForgotPassword {...props} />}
          />
          <Route
            exact
            path="/JARM/customer/change-password-info/:token"
            name="Home"
            render={(props) => <CustomerChangePassword {...props} />}
          />
          <Route
            exact
            path="/JARM/sign-in"
            name="Home"
            render={(props) => <Login {...props} />}
          />
          <Route
            exact
            path="/JARM/sign-up"
            name="Home"
            render={(props) => <Register {...props} />}
          />

          <Redirect from="/" to="/404" />
        </Switch>
      </div>
      <Footer {...props} />
    </div>
  );
};
export default App;
