import React, { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
import axiosInstance from "src/helpers/axios";
import Loader from "react-loader-spinner";
import { useHistory } from "react-router-dom";
import Female from "src/assets/icons/female.jpg";
import { Collapse } from "react-bootstrap";
import Male from "src/assets/icons/male.jpg";
import { toCapitalized } from "src/reusable";
import UnseenCustomer from "./unseen/UnseenCustomer";
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai";
import { useSelector } from "react-redux";
const Customer = ({ customerActive, setCustomerActive }) => {
  // const { socket } = useSelector((state) => state.socket);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [customerList, setCustomerList] = useState([]);
  const [open, setOpen] = useState(true);
  const [room, setRoom] = useState([]);
  const history = useHistory();
  const { socket } = useSelector((state) => state.socket);
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
  const getCustomerChat = async () => {
    try {
      const response = await axiosInstance.get(
        "/get-all-chat-room-by-branch-xx"
      );
      if (response.status === 200) {
        setRoom(response.data);
      }
    } catch (e) {}
  };
  useEffect(() => {
    getCustomerChat();
    getCustomerBranch();
    if (socket) {
      socket.on("new-message-send-by-customer", async (data) => {
        getCustomerChat();
      });
    }
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
  const isActiveChat = (chats) => {
    if (chats.length > 0) {
      if (chats[0].byme) {
        return false;
      } else {
        if (chats[0].status) {
          return false;
        } else {
          return true;
        }
      }
    } else {
      return false;
    }
  };
  const mesageType = (chats) => {
    if (chats.length > 0) {
      if (chats[0].images.length > 0) {
        if (chats[0].images.length > 1) {
          return "sent a new photos";
        } else {
          return "sent a new photo";
        }
      } else {
        return chats[0].message;
      }
    } else {
      return "new message sends";
    }
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
      {open ? (
        <div className="w-100 d-flex mt-1 justify-content-start align-items-center">
          <AiOutlineMenuUnfold
            size={40}
            color="#f74343"
            onClick={() => {
              setOpen(!open);
            }}
            style={{ cursor: "pointer" }}
          />
          <label className="text-white ml-1 fw-bold mt-1 w-50">Show</label>
        </div>
      ) : (
        <div className="w-100 d-flex mt-1 justify-content-start align-items-center">
          <AiOutlineMenuFold
            size={40}
            color="#f74343"
            onClick={() => {
              setOpen(!open);
            }}
            style={{ cursor: "pointer" }}
          />
          <label className="text-white ml-1 fw-bold mt-1">Hide</label>
        </div>
      )}
      <label className=" ml-1 fw-bold mt-1 w-50" style={{ color: "#f47a36" }}>
        List Customer Member
      </label>
      <Collapse in={open}>
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
      </Collapse>
      <hr />

      {room.length > 0 ? (
        <label
          className=" ml-1 fw-bold mt-1 w-50 mt-2"
          style={{ color: "#20ff1e" }}
        >
          Chat Room
        </label>
      ) : null}

      <div className="users-container" key={Math.random()}>
        {room.map((data) => {
          return (
            <div
              className={`online-field-container`}
              onClick={() =>
                history.push(`/jarm-chat-system/customer/${data.key}`)
              }
            >
              <div className="online-avatar-container">
                <img
                  className="online-avatar"
                  alt="avatar-logo"
                  src={data.profile}
                />
              </div>
              <div className="chat-room-name-con">
                <label
                  className={`room-sender ${
                    isActiveChat(data.chats) ? "is-unseen-chat" : "is-seen-chat"
                  }`}
                >
                  {data.sender}
                </label>
                <br />
                <label
                  className={`room-message  ${
                    isActiveChat(data.chats) ? "is-unseen-chat" : "is-seen-chat"
                  }`}
                >
                  {mesageType(data.chats)}
                </label>
              </div>
            </div>
          );
        })}
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
