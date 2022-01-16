import React, { useState, useEffect, useRef } from "react";
import { RiGovernmentLine } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { getRemittedTax, remitTaxCollection } from "src/redux/action";
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
import Swal from "sweetalert2";
import PrintRP from "./printRP";
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
const productField = [
  { key: "product", label: "Product" },
  { key: "taxCollected", label: `Tax Collected` },
];
const RemittedTax = (props) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState([]);
  const [tax, setTax] = useState([]);
  const [recipient, setRecipient] = useState("");
  const [remitInfo, setRemitInfo] = useState(null);
  const componentRef = useRef();
  const remitRef = useRef();
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
  const handleRemitData = (item) => {
    if (item.total < 1) {
      Swal.fire("Warning", "Zero Amount to remit", "warning");
      return;
    }
    Swal.fire({
      title: "Are you sure ?",
      text: `you wont revert this action`,
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "No, cancel!",
      confirmButtonText: "Yes, proceed remit the tax",
      reverseButtons: true,
      allowOutsideClick: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setRemitInfo(item);
        const { value } = await Swal.fire({
          input: "text",
          inputLabel: "Enter Recipient Full Name",
          inputPlaceholder: "Ex (Juan Dela Cruz)",
          inputAttributes: {
            maxlength: 50,
            autocapitalize: "off",
            autocorrect: "off",
          },
          showCancelButton: true,
          cancelButtonText: "No, cancel!",
          confirmButtonText: "Proceed",
          reverseButtons: true,
        });
        if (value) {
          if (value.length < 5)
            return Swal.fire("Warning", "Name is required", "warning");
          setRecipient(value);
          setLoading(true);
          const res = await dispatch(
            remitTaxCollection({
              tax: item._id,
              total: item.total,
              product: item.product,
              recipient: value,
            })
          );
          setLoading(false);
          if (res.result) {
            handleRemitPrint();
            handleGetData();
            return;
          }
        } else {
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener("mouseenter", Swal.stopTimer);
              toast.addEventListener("mouseleave", Swal.resumeTimer);
            },
          });

          Toast.fire({
            icon: "info",
            title: "Transaction Cancelled",
          });
        }
      }
    });
  };
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
  const handleRemitPrint = useReactToPrint({
    content: () => remitRef.current,
  });
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
                    onClick={() => handleRemitData(item)}
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
                  <CCardBody className={"p-2"}>
                    <div className=" card shadow p-2">
                      <CDataTable
                        items={[...item.product]}
                        fields={productField}
                        columnFilter={false}
                        tableFilter={{ placeholder: "search product" }}
                        footer={false}
                        itemsPerPageSelect={true}
                        itemsPerPage={5}
                        hover
                        sorter
                        pagination
                      />
                    </div>
                  </CCardBody>
                </CCollapse>
              );
            },
          }}
        />
      </div>
      <div style={{ display: "none" }}>
        <PrintingTax ref={componentRef} user={user} tax={tax} />
        <PrintRP
          ref={remitRef}
          user={user}
          remitInfo={remitInfo}
          recipient={recipient}
        />
      </div>
    </div>
  );
};
export default RemittedTax;
