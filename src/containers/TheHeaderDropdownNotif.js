import React, { useState, useEffect } from "react";
import {
  CBadge,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { useDispatch } from "react-redux";
import {
  deleteNotification,
  getNotification,
  updateNotification,
} from "src/redux/action";
import systemProfile from "src/assets/icons/system.jpg";
import { toCapitalized } from "src/reusable";
import moment from "moment";
import { BsFillTrashFill } from "react-icons/bs";
import { useHistory } from "react-router-dom";
const TheHeaderDropdownNotif = () => {
  const dispatch = useDispatch();
  const [notification, setNotification] = useState([]);
  const history = useHistory();
  const handleGetNotif = async () => {
    const res = await dispatch(getNotification());
    if (res.result) {
      setNotification(res.notif);
    }
  };
  useEffect(() => {
    handleGetNotif();
    setInterval(() => {
      handleGetNotif();
    }, 2000);
    // eslint-disable-next-line
  }, []);
  const handleGetImage = (data) => {
    if (data.admin) {
      return {
        url: data.admin.profile.ProfileImg,
        sendby: toCapitalized(
          `${data.admin.firstname} ${data.admin.lastname} - Administrative Management`
        ),
      };
    } else if (data.cashier) {
      return {
        url: data.cashier.profile.url,
        sendby: toCapitalized(
          `${data.cashier.firstname} ${data.cashier.lastname} - Cashier Staff`
        ),
      };
    } else {
      return { url: systemProfile, sendby: "System Dectection" };
    }
  };
  const handleRouting = (data) => {
    history.push(`${data.link}`);
    dispatch(updateNotification({ notifId: data._id }));
  };
  const deleteNotif = (data) => {
    dispatch(deleteNotification(data));
  };
  return (
    <CDropdown inNav className="c-header-nav-item mx-2">
      <CDropdownToggle className="c-header-nav-link" caret={false}>
        <CIcon name="cil-bell" />
        {notification.filter((data) => !data.seen).length > 0 ? (
          <CBadge shape="pill" color="danger">
            {notification.filter((data) => !data.seen).length}
          </CBadge>
        ) : null}
      </CDropdownToggle>
      <CDropdownMenu placement="bottom-end" className="pt-0 ">
        <CDropdownItem header tag="div" className="text-center" color="light">
          <strong>
            You have {notification.filter((data) => !data.seen).length}{" "}
            notifications
          </strong>
        </CDropdownItem>
        {notification.map((data, index) => {
          return (
            <div
              className={`notif-link p-2 ${!data.seen ? "bg-secondary" : ""} ${
                index === 0 ? "" : "border-top"
              }`}
              key={Math.random()}
            >
              <div
                className="c-avatar  mt-1 p-1"
                style={{ position: "relative" }}
              >
                <img
                  src={handleGetImage(data).url}
                  className="notif-img shadow "
                  alt="img-branch-profile"
                />
              </div>
              <div className="d-flex flex-column ml-2">
                <p
                  className="p-2"
                  dangerouslySetInnerHTML={{ __html: data.headingMessage }}
                />
                <div className="d-flex justify-content-between">
                  <span className="d-block text-left fw-bold">
                    {handleGetImage(data).sendby}
                  </span>
                  <p
                    className="text-info text-left"
                    onClick={() => handleRouting(data)}
                    style={{ cursor: "pointer" }}
                  >
                    {" "}
                    {`${moment(new Date(data.createdAt)).fromNow()} `}
                  </p>
                </div>
                {data.seen ? (
                  <BsFillTrashFill
                    className="delete-notif-request"
                    size={20}
                    color="#fb0a66"
                    onClick={() => deleteNotif({ notifId: data._id })}
                  />
                ) : null}
              </div>
            </div>
          );
        })}
      </CDropdownMenu>
    </CDropdown>
  );
};

export default TheHeaderDropdownNotif;
