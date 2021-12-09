import React, { useState } from "react";
import { RiMenu3Line, RiCloseLine } from "react-icons/ri";
import "./Navigation.scss";
import { Link, useHistory } from "react-router-dom";
const Menu = (props) => {
  return (
    <>
      <p>
        <Link
          to="/JARM/home"
          className={props.location.pathname === "/JARM/home" ? "active" : ""}
        >
          Home
        </Link>
      </p>
      <p>
        <Link
          to="/JARM/blog"
          className={props.location.pathname === "/JARM/log" ? "active" : ""}
        >
          Blog
        </Link>
      </p>
      <p>
        <Link
          to="/JARM/customer"
          className={
            props.location.pathname === "/JARM/customer" ? "active" : ""
          }
        >
          Customer
        </Link>
      </p>
    </>
  );
};
const Navbar = (props) => {
  let history = useHistory();
  const [toggleMenu, setToggleMenu] = useState(false);
  const logo =
    "https://res.cloudinary.com/seven-eleven-grocery-netlify-com/image/upload/v1633504263/logo_umwwru.png";
  return (
    <div className="gpt3__navbar">
      <div className="gpt3__navbar-links">
        <div className="gpt3__navbar-links_logo">
          <img src={logo} alt="logo" />
        </div>
        <div className="gpt3__navbar-links_container">
          <Menu {...props} />
        </div>
      </div>
      <div className="gpt__navbar-sign">
        <p
          className={
            props.location.pathname === "/JARM/sign-in" ? "sign-in-active" : ""
          }
          onClick={() => {
            history.push("/JARM/sign-in");
          }}
        >
          Sign in
        </p>
        <button type="button" onClick={() => history.push("/JARM/sign-up")}>
          Sign up
        </button>
      </div>
      <div className="gpt3__navbar-menu">
        {toggleMenu ? (
          <RiCloseLine
            color="#fff"
            size={27}
            onClick={() => setToggleMenu(false)}
          />
        ) : (
          <RiMenu3Line
            color="#fff"
            size={27}
            onClick={() => setToggleMenu(true)}
          />
        )}
        {toggleMenu && (
          <div className="gpt__navbar-menu_container scale-up-center">
            <div className="gpt__navbar-menu_container-links">
              <Menu {...props} />
              <div className="gpt__navbar-menu_container-links-sign">
                <p
                  className={
                    props.location.pathname === "/JARM/sign-in"
                      ? "sign-in-active"
                      : ""
                  }
                  onClick={() => {
                    history.push("/JARM/sign-in");
                  }}
                >
                  Sign in
                </p>
                <button
                  type="button"
                  onClick={() => history.push("/JARM/sign-up")}
                >
                  Sign up
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Navbar;
