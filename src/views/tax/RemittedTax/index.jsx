import React, { useState, useEffect, useRef } from "react";
import { RiGovernmentLine } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { getRemittedTax } from "src/redux/action";
import { CButton, CDataTable, CCollapse, CCardBody } from "@coreui/react";
import {
  AiOutlineEye,
  AiOutlinePrinter,
  AiOutlineArrowUp,
  AiOutlineArrowDown,
} from "react-icons/ai";
import PrintingTax from "./printingTaxData";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";

import "./style.scss";
const fields = [
  { key: "index", label: "No." },
  { key: "tax", label: "Tax" },
  { key: "percentage", label: `Percentage` },
  { key: "total", label: `Amount to Remitted` },
  { key: "date", label: `Date` },

  {
    key: "show_details",
    label: "",
    sorter: false,
    filter: false,
  },
];
const RemittedTax = (props) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState([]);
  const [tax, setTax] = useState([]);
  const componentRef = useRef();
  const handleGetData = async () => {
    setLoading(true);
    const res = await dispatch(getRemittedTax());
    setLoading(false);
    if (res.result) {
      setTax(res.data);
    }
  };
  useEffect(() => {
    handleGetData();
    // eslint-disable-next-line
  }, []);
  const handleViewData = (item) => {};
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const toggleDetails = (index) => {
    const position = details.indexOf(index);
    let newDetails = details.slice();
    if (position !== -1) {
      newDetails.splice(position, 1);
    } else {
      newDetails = [...details, index];
    }
    setDetails(newDetails);
  };
  return (
    <div className="card" style={{ position: "relative" }}>
      <div className="card-header">
        <h1 className="header-card-information p-1">
          <span>
            <RiGovernmentLine size={40} className="p-1" /> Tax To be Remitted
          </span>
        </h1>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "flex-end",
            position: "absolute",
            right: 10,
            top: 20,
          }}
        >
          <CButton
            color="secondary"
            size="sm"
            variant="outline"
            onClick={handlePrint}
          >
            <AiOutlinePrinter size="25" color="#06e4d1" />
          </CButton>
        </div>
      </div>
      <div className="card-body">
        <CDataTable
          items={[...tax]}
          fields={fields}
          columnFilter={false}
          tableFilter={{ placeholder: "search tax" }}
          footer={false}
          itemsPerPageSelect={true}
          itemsPerPage={5}
          hover
          sorter
          pagination
          loading={loading}
          scopedSlots={{
            total: (item) => (
              <td>
                {`₱ ${new Intl.NumberFormat().format(
                  Math.round((item.total + Number.EPSILON) * 100) / 100
                )}`}
              </td>
            ),
            show_details: (item, index) => (
              <td>
                <div className="d-flex justify-content-center">
                  <CButton
                    color="info"
                    variant="outline"
                    size="sm"
                    className={"mr-2 "}
                    onClick={() => handleViewData(item)}
                  >
                    <AiOutlineEye size="15" /> Remit
                  </CButton>
                  {details.includes(index) ? (
                    <AiOutlineArrowDown
                      onClick={() => {
                        toggleDetails(index);
                      }}
                      className="hover mt-1"
                    />
                  ) : (
                    <AiOutlineArrowUp
                      onClick={() => {
                        toggleDetails(index);
                      }}
                      className="hover mt-1"
                    />
                  )}
                </div>
              </td>
            ),
            details: (item, index) => {
              return (
                <CCollapse show={details.includes(index)}>
                  <CCardBody>
                    {JSON.stringify(item.data)}
                    <CButton size="sm" color="info">
                      User Settings
                    </CButton>
                    <CButton size="sm" color="danger" className="ml-1">
                      Delete
                    </CButton>
                  </CCardBody>
                </CCollapse>
              );
            },
          }}
        />
      </div>
      <div style={{ display: "none" }}>
        <PrintingTax ref={componentRef} user={user} tax={tax} />
      </div>
    </div>
  );
};
export default RemittedTax;
