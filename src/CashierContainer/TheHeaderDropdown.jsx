import React from "react";
import {
  CBadge,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CImg,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "src/redux/action";
import { AiOutlineLogout } from "react-icons/ai";
import { toCapitalized } from "src/reusable";
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
              user ? (user.profile.url ? user.profile.url : profile) : profile
            }
            style={{ width: "35px", height: "35px", borderRadius: "50px" }}
            className="c-avatar-img"
            alt="cashier information"
          />
        </div>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownItem header tag="div" color="light" className="text-center">
          <strong>
            {" "}
            {user
              ? toCapitalized(
                  user.lastname + ", " + user.firstname + " " + user.middlename
                )
              : null}
          </strong>
        </CDropdownItem>
        <CDropdownItem>
          <CIcon name="cil-user" className="mfe-2" />
          Profile
        </CDropdownItem>
        <CDropdownItem>
          <CIcon name="cil-bell" className="mfe-2" />
          Updates
          <CBadge color="info" className="mfs-auto">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownItem>
          <CIcon name="cil-envelope-open" className="mfe-2" />
          Messages
          <CBadge color="success" className="mfs-auto">
            42
          </CBadge>
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
