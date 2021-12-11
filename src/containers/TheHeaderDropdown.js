import React from "react";
import {
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CImg,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineLogout } from "react-icons/ai";
import { logout } from "src/redux/action";
const TheHeaderDropdown = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const profile =
    "https://res.cloudinary.com/seven-eleven-grocery-netlify-com/image/upload/v1632895905/blank_vwt551.jpg";
  return (
    <CDropdown inNav className="c-header-nav-items mx-2" direction="down">
      <CDropdownToggle className="c-header-nav-link" caret={false}>
        <div className="c-avatar">
          <CImg
            src={
              user
                ? user.branch_owner_profile.profile
                  ? user.branch_owner_profile.profile
                  : profile
                : profile
            }
            style={{ width: "35px", height: "35px", borderRadius: "50px" }}
            className="c-avatar-img"
            alt="admin@bootstrapmaster.com"
          />
        </div>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownItem header tag="div" color="light" className="text-center">
          <strong>
            {user
              ? user.branch_owner_lname + ", " + user.branch_owner_fname
              : null}
          </strong>
        </CDropdownItem>
        <CDropdownItem>
          <CIcon name="cil-user" className="mfe-2" />
          Profile
        </CDropdownItem>
        <CDropdownItem divider />
        <CDropdownItem
          onClick={() => {
            dispatch(logout());
          }}
        >
          <AiOutlineLogout size="20" className="mfe-2" />
          Sign out
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  );
};

export default TheHeaderDropdown;
