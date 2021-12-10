import React from "react";
import { CFooter } from "@coreui/react";
import { useSelector } from "react-redux";

const TheFooter = () => {
  const { user } = useSelector((state) => state.auth);
  return (
    <CFooter fixed={false}>
      <div>
        Welcome{"!! "}
        <span className="ml-1 text-success">
          {" "}
          {user
            ? user.status === "owner"
              ? ` ${user.branch_owner_lname}, ${user.branch_owner_fname}`
              : user.Owner.branch_name + " Branch"
            : null}{" "}
        </span>
      </div>
      <div className="mfs-auto"></div>
    </CFooter>
  );
};

export default React.memo(TheFooter);
