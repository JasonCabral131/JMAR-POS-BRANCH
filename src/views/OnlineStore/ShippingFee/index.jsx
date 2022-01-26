import React from "react";
import { CDataTable, CCollapse, CCardBody, CButton } from "@coreui/react";
import { useEffect } from "react";
import { useState } from "react";
import axiosInstance from "src/helpers/axios";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";
import { Modal } from "react-bootstrap";
import Swal from "sweetalert2";
const shippingField = [
  { key: "check", label: "Select", _style: { width: "1%" } },
  { key: "province", label: "Province" },
  { key: "Municipalities", label: "Municipality", _style: { width: "3%" } },
  { key: "show_details", label: "Details", _style: { width: "2%" } },
];
const municipalities = [
  { key: "check", label: "Select", _style: { width: "1%" } },
  { key: "mun", label: "Municipality" },
  { key: "fee", label: "Shipping Fee", _style: { width: "15%" } },
];
const initialState = {
  prov: "",
  mun: [],
  all: false,
  fee: 0,
};
const ShippingFee = (props) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [details, setDetails] = useState([]);
  const [check, setCheck] = useState([]);
  const [munCheck, setMunCheck] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [updateByProvince, setUpdateByProvince] = useState(initialState);
  const [UpdateByProvModal, setUpdateByProvModal] = useState(false);
  const fetch = async () => {
    try {
      setCheck([]);
      setMunCheck([]);
      setLoading(true);
      const res = await axiosInstance.get("/get-shipping-fee");
      setLoading(false);

      if (res.status === 200) {
        setData(res.data);
        return;
      }
    } catch (e) {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetch();
    // eslint-disable-next-line
  }, []);
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
  const checkDetails = (index) => {
    const position = check.indexOf(index);
    let newDetails = check.slice();
    if (position !== -1) {
      newDetails.splice(position, 1);
    } else {
      newDetails = [...check, index];
    }
    setCheck(newDetails);
  };
  const munCheckMe = (index) => {
    const position = munCheck.indexOf(index);
    let newDetails = munCheck.slice();
    if (position !== -1) {
      newDetails.splice(position, 1);
    } else {
      newDetails = [...munCheck, index];
    }
    setMunCheck(newDetails);
  };
  const handleUpdateViaProvince = (item) => {
    let toUpdate = [];
    let allx = false;
    const isProvinceCheck = check.includes(item.province);
    if (isProvinceCheck) {
      toUpdate.push(...item.municipality);
      allx = true;
    } else {
      for (let mun of item.municipality) {
        const isIn = munCheck.includes(mun._id);
        if (isIn) {
          toUpdate.push(mun);
        }
      }
      allx = false;
    }
    if (allx) {
      setUpdateByProvince({
        prov: item.province,
        mun: toUpdate,
        all: allx,
        fee: 0,
      });
      setUpdateByProvModal(true);
      return;
    }
    if (toUpdate.length > 0) {
      setUpdateByProvince({
        prov: item.province,
        mun: toUpdate,
        all: allx,
        fee: 0,
      });
      setUpdateByProvModal(true);
      return;
    }
    Swal.fire({
      icon: "warning",
      text: "No Data Found",
    });
  };
  const allUpdateAll = async (item) => {};
  const feeOnChange = (_id, value) => {
    const newData = updateByProvince.mun.map((prev) => {
      if (prev._id === _id) {
        return { ...prev, fee: value };
      }
      return { ...prev };
    });
    setUpdateByProvince((prev) => {
      return { ...prev, mun: newData };
    });
  };
  return (
    <div className="card p-2 shadow" style={{ position: "relative" }}>
      <div className="col-md-3">
        <h1 className="header-card-information">
          <span>Shipping Fee</span>
        </h1>
      </div>
      {check.length > 0 ? (
        <div style={{ position: "absolute", top: 10, right: 10 }}>
          <CButton
            color="info"
            onClick={() => {
              allUpdateAll();
            }}
          >
            Update Fee
          </CButton>
        </div>
      ) : null}
      <CDataTable
        items={data}
        fields={shippingField}
        columnFilter={false}
        tableFilterValue={null}
        tableFilter={{ placeholder: "search Province" }}
        footer={false}
        itemsPerPageSelect={true}
        itemsPerPage={15}
        hover
        sorter
        pagination
        loading={loading}
        scopedSlots={{
          show_details: (item, index) => (
            <td>
              <div className="d-flex justify-content-center">
                {details.includes(index) ? (
                  <AiOutlineDown
                    onClick={() => {
                      toggleDetails(index);
                    }}
                    className="hover mt-1 ml-4"
                  />
                ) : (
                  <AiOutlineUp
                    onClick={() => {
                      toggleDetails(index);
                    }}
                    className="hover mt-1 ml-4"
                  />
                )}
              </div>
            </td>
          ),
          check: (item, index) => (
            <td className="text-center ">
              <input
                className="form-check-input"
                type="checkbox"
                checked={check.includes(item.province)}
                onClick={(e) => {
                  checkDetails(item.province);
                }}
                onChange={(e) => {}}
              />
            </td>
          ),
          details: (item, index) => {
            return (
              <CCollapse show={details.includes(index)}>
                <CCardBody className={"p-2"}>
                  <h4 className="ml-2">{item.province + " Shipping Fee"}</h4>
                  <div
                    className="card shadow p-2"
                    style={{ position: "relative" }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        zIndex: 2,
                      }}
                    >
                      <CButton
                        color="info"
                        onClick={() => {
                          handleUpdateViaProvince(item);
                        }}
                      >
                        Update Fee in {item.province}
                      </CButton>
                    </div>

                    <div className="card-body mt-3">
                      <CDataTable
                        items={item.municipality}
                        fields={municipalities}
                        columnFilter={false}
                        tableFilterValue={null}
                        tableFilter={{
                          placeholder: "search municipality",
                        }}
                        itemsPerPageSelect={true}
                        itemsPerPage={10}
                        hover
                        sorter
                        pagination
                        scopedSlots={{
                          check: (item, index) => (
                            <td className="text-center ">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={
                                  munCheck.includes(item._id) ||
                                  check.includes(item.prov)
                                }
                                onClick={(e) => {
                                  munCheckMe(item._id);
                                  console.log(munCheck);
                                }}
                                onChange={(e) => {}}
                              />
                            </td>
                          ),
                        }}
                      />
                    </div>
                  </div>
                </CCardBody>
              </CCollapse>
            );
          },
        }}
      />
      <Modal
        show={UpdateByProvModal}
        size="lg"
        onHide={() => setUpdateByProvModal(false)}
      >
        <Modal.Header closeButton>
          <div className="d-flex">
            <h1 className="header-card-information">
              <span>{updateByProvince.prov}</span>
            </h1>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            {updateByProvince.all ? (
              <div>
                <div className="col-md-12 percent-container mt-1 bg-white">
                  <label>Shipping Fee</label>
                  <input
                    min={0}
                    type="number"
                    value={updateByProvince.fee}
                    className=""
                    onChange={(e) => {
                      setUpdateByProvince({
                        ...updateByProvince,
                        fee: e.target.value,
                      });
                    }}
                    onKeyPress={(e) => {
                      const theEvent = e || window.event;
                      if (e.target.value.length === 0 && e.which === 48) {
                        theEvent.preventDefault();
                      }
                    }}
                    onBlur={(e) => {
                      const { value } = e.target;
                      if (value.length === 0) {
                        setUpdateByProvince({
                          ...updateByProvince,
                          fee: 0,
                        });
                      }
                    }}
                    style={{ backgroundColor: "#fff" }}
                  />
                </div>
              </div>
            ) : (
              updateByProvince.mun.map((data) => {
                return (
                  <div className="col-md-12 row">
                    <div className="col-md-6 percent-container mt-1 bg-white">
                      <label>Municipality</label>
                      <input
                        value={data.mun}
                        className=""
                        disabled
                        style={{ backgroundColor: "#fff" }}
                      />
                    </div>
                    <div className="col-md-6  mt-1 bg-white">
                      <label>Shipping Fee</label>
                      <div className="percent-container">
                        <input
                          value={data.fee}
                          type="number"
                          style={{ backgroundColor: "#fff" }}
                          onChange={(e) => {
                            feeOnChange(data._id, e.target.value);
                          }}
                          onKeyPress={(e) => {
                            const theEvent = e || window.event;
                            if (e.target.value.length === 0 && e.which === 48) {
                              theEvent.preventDefault();
                            }
                          }}
                          onBlur={(e) => {
                            const { value } = e.target;
                            if (value.length === 0) {
                              feeOnChange(data._id, 0);
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-md-4"></div>
                  </div>
                );
              })
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <CButton
            color={"secondary"}
            onClick={() => {
              setUpdateByProvModal(false);
            }}
          >
            close
          </CButton>
          <CButton
            color={"info"}
            onClick={() => {
              try {
                if (updateByProvince.all) {
                  const update = async () => {
                    setFetching(true);
                    const res = await axiosInstance.post(
                      "/update-all-mun-fee-by-prov",
                      updateByProvince
                    );
                    setFetching(false);
                    if (res.status === 200) {
                      Swal.fire({
                        icon: "success",
                        title: "Successfully Updated",
                      });
                      setUpdateByProvModal(false);
                      setUpdateByProvince(initialState);
                      fetch();
                      return;
                    }
                    Swal.fire({
                      icon: "warning",
                      title: res.data.msg,
                    });
                  };
                  update();
                } else {
                  const update = async () => {
                    setFetching(true);
                    const res = await axiosInstance.post(
                      "/update-mun-fee-by-prov",
                      { municipality: updateByProvince.mun }
                    );
                    setFetching(false);
                    if (res.status === 200) {
                      Swal.fire({
                        icon: "success",
                        title: "Successfully Updated",
                      });
                      setUpdateByProvModal(false);
                      setUpdateByProvince(initialState);
                      fetch();
                      return;
                    }
                    Swal.fire({
                      icon: "warning",
                      title: res.data.msg,
                    });
                  };
                  update();
                }
              } catch (e) {
                Swal.fire({
                  icon: "warning",
                  text: "Internet Connection Lost",
                });
              }
            }}
            disabled={fetching}
          >
            {fetching ? "Loading" : "Update"}
          </CButton>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default ShippingFee;
