import React, { useState } from "react";

import { Modal } from "react-bootstrap";
import { CButton } from "@coreui/react";
import Swal from "sweetalert2";
export const AddSearchProduct = ({
  addPurchaseModal,
  setAddPurchaseModal,
  setPurchase,
  search,
  setSearch,
  searchRef,
}) => {
  const [quantity, setQuantity] = useState("1");

  const handleSaveSearch = () => {
    if (quantity === "") {
      Swal.fire({
        icon: "warning",
        text: "Quantity Required",
        timer: 2000,
      });
      return;
    }
    const purchaseObject = {
      _id: search._id,
      product: search.product,
      total_quantity: search.quantity,
      price: parseFloat(search.price),
      total: parseFloat(search.price * quantity),
      quantity: quantity,
    };
    setPurchase((prevstate) => {
      if (prevstate.length > 0) {
        const purchseExist = prevstate.filter(
          (val) => val._id === purchaseObject._id
        );
        if (purchseExist.length > 0) {
          let updateInfo = [];

          prevstate.map((data) => {
            if (data._id === purchaseObject._id) {
              data.quantity = quantity;
              data.total = parseInt(data.quantity) * parseFloat(data.price);
              updateInfo.push(data);
            } else {
              updateInfo.push(data);
            }
            return data;
          });
          return updateInfo;
        } else {
          return [...prevstate, purchaseObject];
        }
      } else {
        return [...prevstate, purchaseObject];
      }
    });

    setAddPurchaseModal(false);
    setQuantity("1");
    setSearch(null);
    searchRef.current.value = "";
    setTimeout(() => {
      searchRef
        ? searchRef.current
          ? searchRef.current.blur()
          : console.log("")
        : console.log("");
    }, 400);
  };
  return (
    <Modal
      show={addPurchaseModal}
      onHide={() => {
        setQuantity("1");
        setAddPurchaseModal(false);
      }}
      backdrop="static"
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <h1 className="header-card-information">
            <span>{search ? search.product : ""}</span>
          </h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="col-md-6">
            <label className="label-name text-left">Price</label>
            <input
              type="text"
              name="searchProduct"
              className="inputvalue"
              placeholder="product"
              value={search ? search.price : ""}
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
              value={
                search
                  ? quantity === ""
                    ? "00.00"
                    : Math.round(
                        (parseInt(quantity) * search.price + Number.EPSILON) *
                          100
                      ) / 100
                  : 0
              }
              disabled={true}
            />
          </div>
        </div>

        <label className="label-name text-left">Quantity</label>
        <input
          type="number"
          min="0"
          value={quantity}
          name="searchProduct"
          className="inputvalue"
          onChange={(e) => {
            const { value } = e.target;
            if (value > search.quantity) {
              setQuantity(search.quantity);
            } else {
              setQuantity(value);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSaveSearch();
            }
          }}
          placeholder="Enter Quantity"
          onKeyPress={(e) => {
            if (
              e.key === "-" ||
              e.key === "+" ||
              e.key === "E" ||
              e.key === "." ||
              e.key === "e"
            ) {
              e.preventDefault();
            }
            if (quantity < 1) {
              if (e.key === "0") {
                e.preventDefault();
              }
            }
          }}
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
      </Modal.Body>
      <Modal.Footer>
        <CButton
          color="secondary"
          variant="outline"
          className="text-dark"
          onClick={() => {
            setQuantity("1");
            setAddPurchaseModal(false);
          }}
        >
          Cancel
        </CButton>
        <CButton color="info" onClick={handleSaveSearch}>
          Save
        </CButton>
      </Modal.Footer>
    </Modal>
  );
};
