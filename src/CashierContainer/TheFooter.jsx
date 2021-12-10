import React from "react";
import { CFooter } from "@coreui/react";

const TheFooter = () => {
  return (
    <CFooter fixed={false}>
      <div>Welcome{"!! "}</div>
      <div className="mfs-auto"></div>
    </CFooter>
  );
};

export default React.memo(TheFooter);
