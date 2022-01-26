import React, { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
import axiosInstance from "src/helpers/axios";
import Loader from "react-loader-spinner";
import { useHistory } from "react-router-dom";
import Female from "src/assets/icons/female.jpg";
import Male from "src/assets/icons/male.jpg";
import { toCapitalized } from "src/reusable";
import UnseenCustomer from "./unseen/UnseenCustomer";
const Customer = ({ customerActive, setCustomerActive }) => {
  // const { socket } = useSelector((state) => state.socket);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [customerList, setCustomerList] = useState([]);
  const getCustomerBranch = async () => {
    try {
      if (customerList.length < 1) {
        setLoading(true);
      }
      const res = await axiosInstance.get("/get-all-customer-list");
      setLoading(false);
      if (res.status === 200) {
        console.log(res.data);
        setCustomerList(res.data);
      }
    } catch (e) {
      setLoading(false);
    }
  };
  useEffect(() => {
    getCustomerBranch();
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    getCustomerBranch();
    // eslint-disable-next-line
  }, [customerActive]);
  const activeNotActive = () => {
    let Active = [];
    let Unactive = [];
    customerList.map((custo) => {
      const isActive = customerActive
        ? customerActive.filter(
            (xx) => xx._id.toString() === custo._id.toString()
          )
        : [];
      if (isActive.length > 0) {
        Active.push(custo);
        return custo;
      } else {
        Unactive.push(custo);
        return custo;
      }
    });
    return [...Active, ...Unactive];
  };
  return (
    <div className="option-container-info scale-up-hor-right">
      <div className="searh-bar-container">
        <input
          type="text"
          placeholder="Search"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
        />
      </div>
      <div className="users-container">
        {loading ? (
          <div className="w-100 d-flex flex-column justify-content-center align-items-center">
            <Loader type="Circles" />
            <p>Loading</p>
          </div>
        ) : (
          activeNotActive().map((user) => {
            const isActive = customerActive
              ? customerActive.filter(
                  (xx) => xx._id.toString() === user._id.toString()
                )
              : [];
            const name = toCapitalized(`${user.firstname} ${user.lastname}`);
            if (name.toLowerCase().includes(search.toLowerCase())) {
              return (
                <UserDetails
                  key={Math.random()}
                  user={user}
                  isActive={isActive}
                />
              );
            }
            return null;
          })
        )}
      </div>
    </div>
  );
};

export default Customer;
const UserDetails = ({ isActive, user }) => {
  const history = useHistory();

  return (
    <div
      className={`online-field-container`}
      onClick={() => history.push(`/jarm-chat-system/customer/${user._id}`)}
    >
      <div className="online-avatar-container">
        <img
          className="online-avatar"
          alt="avatar-logo"
          src={
            user.profile.url
              ? user.profile.url
              : user.profile.sex === "Male"
              ? Female
              : Male
          }
        />
      </div>
      <div className="online-profile-container">
        {toCapitalized(`${user.firstname} ${user.lastname}`)}
      </div>
      <UnseenCustomer customerId={user._id} />
      {isActive.length > 0 ? <span className="is-active-circle" /> : null}
    </div>
  );
};
