import { CButton } from "@coreui/react";
import React, { useEffect, useState } from "react";

import {
  IoTrash,
  IoAddOutline,
  IoRemoveOutline,
  IoPencilOutline,
} from "react-icons/io5";
import { Modal } from "react-bootstrap";
import Swal from "sweetalert2";
export const CounterAreaData = ({
  tax,
  purchase,
  setPurchase,
  setAddPurchaseModal,
  setSearch,
  products,
  searchRef,
}) => {
  const [filterProduct, setFilterProduct] = useState({
    product: "",
    hastoShow: false,
  });
  const [editPurchaseId, setEditPurchaseId] = useState({ id: "", product: "" });
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    if (purchase.length === 0) {
      setFilterProduct({
        product: "",
        hastoShow: false,
      });
    }
    return () => {
      if (purchase.length === 0) {
        setFilterProduct({
          product: "",
          hastoShow: false,
        });
      }
    };
    // eslint-disable-next-line
  }, [purchase]);
  useEffect(() => {
    document.getElementById("searchProduct-counter").blur();
    // eslint-disable-next-line
  }, []);
  const handleKeyDown = (e) => {
    const { name, value } = e.target;
    if (e.key === "Enter") {
      if (name === "filterProduct") {
        const hastoShow = purchase.filter((data) => data.product === value);
        setFilterProduct({
          product: value,
          hastoShow: hastoShow.length > 0 ? true : false,
        });
      } else if (name === "searchProduct") {
        const product = products.filter((data) => data.productId === value);
        if (product.length > 0) {
          setSearch(product[0]);
          setAddPurchaseModal(true);
        } else {
          Swal.fire({
            icon: "warning",
            text: "Product Not Found",
            allowOutsideClick: false,
          });
          return;
        }
      }
    }
  };
  const ToFilter = ({ data, index }) => {
    return (
      <tr key={data._id}>
        <td className="fs-6 text-left">{data.product}</td>
        <td className="fs-6 text-center ">₱ {data.price}</td>
        <td className="fs-6  ">
          <div className="data-change-container">
            <CButton
              color="danger"
              variant="outline"
              onClick={() => AddMinus(-1, data._id)}
            >
              <IoRemoveOutline />
            </CButton>
            <input
              type="number"
              value={data.quantity}
              min="1"
              disabled={true}
            />
            <CButton
              color="success"
              variant="outline"
              onClick={() => AddMinus(+1, data._id)}
            >
              <IoAddOutline />
            </CButton>
          </div>
        </td>
        <td className="fs-6 text-center">
          ₱ {new Intl.NumberFormat().format(data.total)}
        </td>
        <td className="text-center">
          <IoTrash
            onClick={() => handleRemovePurchase(data._id)}
            className="text-danger mr-1"
            style={{ cursor: "pointer" }}
          />
          <IoPencilOutline
            onClick={() => {
              setShowModal(true);
              setEditPurchaseId({ id: data._id, product: data.product });
            }}
            className="text-info mr-1"
            style={{ cursor: "pointer" }}
          />
        </td>
      </tr>
    );
  };
  const handleRemovePurchase = (_id) => {
    Swal.fire({
      icon: "warning",
      title: "Are you sure?",
      text: "Data will not be reverted",
      confirmButtonText: "Yes, Remove it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
      showCancelButton: true,
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        const removedData = purchase.filter((val) => val._id !== _id);
        setPurchase(removedData);
      }
    });
  };
  const AddMinus = (val, id) => {
    let updateData = [];
    for (let data of purchase) {
      if (data._id === id) {
        if (data.quantity > 1) {
          data.quantity =
            parseInt(data.quantity) + val > data.total_quantity
              ? data.total_quantity
              : parseInt(data.quantity) + val;
          data.total = parseInt(data.quantity) * parseFloat(data.price);
          updateData.push(data);
        } else {
          if (val === +1) {
            data.quantity =
              parseInt(data.quantity) + val > data.total_quantity
                ? data.total_quantity
                : parseInt(data.quantity) + val;
            data.total = parseInt(data.quantity) * parseFloat(data.price);
            updateData.push(data);
          }
        }
      } else {
        updateData.push(data);
      }
    }
    setPurchase(updateData);
  };
  const onChangeQuantity = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setPurchase((prevState) => {
      let newUpdated = [];
      if (prevState.length > 0) {
        prevState.map((data) => {
          if (data._id === name) {
            data.quantity =
              value > data.total_quantity ? data.total_quantity : value;
            data.total = parseFloat(data.quantity) * parseFloat(data.price);
            newUpdated.push(data);
          } else {
            newUpdated.push(data);
          }
          return data;
        });
        return newUpdated;
      }
    });
  };
  return (
    <div className="CounterAreaData">
      <div className=" w-100 row ">
        <div className="col-md-6 form-group d-flex flex-column percent-container">
          <label className="label-name text-left">
            Search Product Barcode ID
          </label>
          <input
            type="number"
            min="0"
            ref={searchRef}
            name="searchProduct"
            id="searchProduct-counter"
            className=""
            placeholder="product barcode Id...."
            onKeyPress={handleKeyDown}
            onPaste={(e) => {
              const data = e.clipboardData.getData("Text");
              if (!isNaN(data)) {
                if (data < 0) {
                  e.preventDefault();
                }
              } else {
                e.preventDefault();
              }
            }}
          />
        </div>
        <div className="col-md-6 form-group d-flex flex-column justify-content-end  percent-container">
          <label className="label-name text-left">Filter Product</label>
          <input
            type="text"
            name="filterProduct"
            className="filter-input"
            placeholder="product name"
            onKeyDown={handleKeyDown}
            value={filterProduct.product}
            onChange={(e) => {
              const { value } = e.target;
              const hastoShow = purchase.filter((data) =>
                data.product.toUpperCase().includes(value.toUpperCase())
              );
              console.log(hastoShow);
              setFilterProduct({
                product: value,
                hastoShow: hastoShow.length > 0 ? true : false,
              });
            }}
            disabled={purchase.length > 0 ? false : true}
            style={{ cursor: purchase.length > 0 ? "text" : "not-allowed" }}
          />
          {purchase.length < 1 ? (
            <small className="text-danger toshow-data">No Data Available</small>
          ) : null}
        </div>
      </div>
      <div className="data-information-counter card shadow p-2">
        <table className="table table-borderless">
          <thead>
            <tr>
              <th className="text-left">Product</th>
              <th className="text-center">Price</th>
              <th className="text-center">Quantity</th>
              <th className="text-center">Amount</th>
              <th className="text-center"></th>
            </tr>
          </thead>
          <tbody>
            {purchase.length > 0
              ? purchase.map((data, index) => {
                  if (filterProduct.product !== "") {
                    if (
                      data.product
                        .toLowerCase()
                        .includes(filterProduct.product.toLowerCase())
                    ) {
                      return (
                        <ToFilter data={data} index={index} key={data._id} />
                      );
                    }
                    return null;
                  } else {
                    return (
                      <ToFilter data={data} index={index} key={data._id} />
                    );
                  }
                })
              : null}
            {purchase.length > 0 ? (
              filterProduct.product !== "" ? (
                filterProduct.hastoShow ? null : (
                  <tr>
                    <td colSpan="6">
                      <div className="w-100 d-block no-data-purchase">
                        <p className="text-center fs-2"> No Data Found !!!</p>
                      </div>
                    </td>
                  </tr>
                )
              ) : null
            ) : null}
            {purchase.length > 0 ? (
              <>
                <tr>
                  <th colSpan="4" className="text-right fs-6">
                    <span className="mt-1">SubTotal :</span>
                  </th>
                  <th className="text-left fs-5">{`₱ ${new Intl.NumberFormat().format(
                    purchase.reduce(function (accumulator, currentValue) {
                      return accumulator + currentValue.total;
                    }, 0)
                  )}`}</th>
                </tr>

                <tr>
                  <th colSpan="2" className="text-left fs-6 text-dark">
                    Tax
                  </th>
                  <th className="fs-6 text-dark text-center"></th>
                  <th className="fs-6 text-dark text-center">Amount</th>
                </tr>
              </>
            ) : (
              <tr>
                <td colSpan="5">
                  <div className="w-100 d-block no-data-purchase">
                    <p className="text-center fs-2"> No Data Available !!!</p>
                  </div>
                </td>
              </tr>
            )}

            {purchase.length > 0
              ? tax.length > 0
                ? tax.map((data, key) => {
                    return (
                      <tr key={key}>
                        <td colSpan="2" className="text-left fs-6">
                          {data.tax}
                        </td>
                        <td className="fs-6 text-left"> {data.percentage} %</td>
                        <td className="fs-6 text-center">{`₱ ${parseFloat(
                          parseFloat(data.percentage / 100) *
                            purchase.reduce(function (
                              accumulator,
                              currentValue
                            ) {
                              return accumulator + currentValue.total;
                            },
                            0)
                        ).toFixed(2)} `}</td>
                      </tr>
                    );
                  })
                : null
              : null}
          </tbody>
        </table>
      </div>
      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
        }}
        backdrop="static"
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <h1 className="header-card-information">
              <span>{editPurchaseId.product}</span>
            </h1>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {purchase.length > 0
            ? purchase.map((data) => {
                if (data._id === editPurchaseId.id) {
                  return (
                    <div className="row" key={data._id}>
                      <div className="col-md-6">
                        <label className="label-name text-left">Price</label>
                        <input
                          type="text"
                          name="searchProduct"
                          className="inputvalue"
                          placeholder="product"
                          value={data.product}
                          disabled={true}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="label-name text-left">Total</label>
                        <input
                          type="text"
                          name="searchProduct"
                          className="inputvalue"
                          placeholder="product"
                          disabled={true}
                        />
                      </div>
                      <div className="col-md-12">
                        <label className="label-name text-left">Quantity</label>
                        <input
                          type={"number"}
                          className="inputvalue"
                          min="1"
                          value={data.quantity}
                          name={data._id}
                          onChange={onChangeQuantity}
                          onBlur={(e) => {
                            const { name, value } = e.target;
                            console.log(name, value);
                            setPurchase((prevState) => {
                              let newUpdated = [];
                              if (prevState.length > 0) {
                                prevState.map((data) => {
                                  if (data._id === name) {
                                    data.quantity =
                                      value > data.total_quantity
                                        ? data.total_quantity
                                        : value === ""
                                        ? 1
                                        : value;
                                    data.total =
                                      parseFloat(data.quantity) *
                                      parseFloat(data.price);
                                    newUpdated.push(data);
                                  } else {
                                    newUpdated.push(data);
                                  }
                                  return data;
                                });
                                return newUpdated;
                              }
                            });
                          }}
                          onKeyPress={(e) => {
                            const { value } = e.target;
                            if (
                              e.key === "-" ||
                              e.key === "+" ||
                              e.key === "E" ||
                              e.key === "." ||
                              e.key === "e"
                            ) {
                              e.preventDefault();
                            }
                            if (value < 1) {
                              if (e.key === "0") {
                                e.preventDefault();
                              }
                            }
                          }}
                        />
                      </div>
                    </div>
                  );
                }
                return null;
              })
            : null}
          <div className="row">
            <div className="col-md-6"></div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};
