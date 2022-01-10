import React from "react";
import { CBadge, CDropdown, CDropdownToggle } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { useHistory } from "react-router-dom";

const TheHeaderDropdownMssg = () => {
  const itemsCount = 4;
  const history = useHistory();
  return (
    <CDropdown inNav className="c-header-nav-item mx-2" direction="down">
      <CDropdownToggle
        className="c-header-nav-link"
        caret={false}
        onClick={() => history.push("/jarm-chat-system")}
      >
        <CIcon name="cil-speech" />
        <CBadge shape="pill" color="info">
          {itemsCount}
        </CBadge>
      </CDropdownToggle>
    </CDropdown>
  );
};

export default TheHeaderDropdownMssg;
