import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Male from "src/assets/icons/male.jpg";
import { toCapitalized } from "src/reusable";
import "./style.scss";
const BranchView = (props) => {
  const { user } = useSelector((state) => state.auth);
  const { socket } = useSelector((state) => state.socket);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (socket) {
      socket.emit(
        "is-branch-owner-active",
        { branchId: user.branch._id },
        (data) => {
          setActive(data);
        }
      );
    }
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    if (socket) {
      socket.emit(
        "is-branch-owner-active",
        { branchId: user.branch._id },
        (data) => {
          setActive(data);
        }
      );
    }
    // eslint-disable-next-line
  }, [socket]);
  return (
    <div className="option-container-info scale-up-bl">
      <div className="users-container">
        <img
          src={
            user
              ? user.branch.branch_owner_profile.profile
                ? user.branch.branch_owner_profile.profile
                : Male
              : Male
          }
          alt="store-owner-profile"
          className="store-owner-img"
        />
        {active ? <span className="store-owner-is-active" /> : null}
      </div>
      <div className="text-center store-info-container">
        <h1 className="text-center gradient__text">
          {user ? toCapitalized(`${user.branch.branch_name} Store`) : ""}
        </h1>
        <h4>
          {" "}
          {user
            ? toCapitalized(
                `${JSON.parse(user.branch.branch_address).fullAddress} Store`
              )
            : ""}
        </h4>
      </div>
    </div>
  );
};
export default BranchView;
