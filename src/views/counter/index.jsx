import React, { useEffect, useState, useRef } from "react";
import { CounterAreaData } from "./counterAreaData";
import { CounterAreaPay } from "./counterAreaPay";

import { useSelector } from "react-redux";
import "./counter.scss";
import { IoMdClose } from "react-icons/io";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  getProductByBrandOwner,
  getCounterProductByCashier,
} from "src/redux/action/product.action";
import Swal from "sweetalert2";
import { AddSearchProduct } from "./AddSearchProduct";
import { LoaderSpinner } from "src/reusable/";
import { getTaxInfo } from "src/redux/action";
export const CounterArea = (props) => {
  const dispatch = useDispatch();
  const searchRef = useRef();
  const { user } = useSelector((state) => state.auth);
  const { socket } = useSelector((state) => state.socket);
  const { tax } = useSelector((state) => state.tax);
  const { products, loading } = useSelector((state) => state.product);
  const [addPurchaseModal, setAddPurchaseModal] = useState(false);
  const [purchase, setPurchase] = useState([]);
  const [paymentMethod, setPaymethod] = useState(true);
  const [payment, setPayment] = useState({ payment: "", isvalid: false });
  const [search, setSearch] = useState(null);
  const [payer, setPayer] = useState(null);
  useEffect(() => {
    window.addEventListener("beforeunload", alertUser);
    window.focus();
    if (user) {
      if (user.status === "owner") {
        dispatch(getProductByBrandOwner());
        dispatch(getTaxInfo());
        console.log("requesting");
      } else if (user.status === "cashier") {
        dispatch(getCounterProductByCashier({ branch_id: user.branch._id }));
      }
    }

    return () => {
      window.removeEventListener("beforeunload", alertUser);
    };

    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    if (socket) {
      socket.on("receiving-to-connected-device", async ({ product }) => {
        console.log(product);
        if (product.quantity === 0) {
          Swal.fire({
            icon: "warning",
            text: "Product Inventory Out Of stock",
            timer: 2500,
            allowOutsideClick: false,
          });
          return;
        } else {
          const purchaseObject = {
            _id: product._id,
            product: product.product,
            total_quantity: product.quantity,
            price: parseFloat(product.price),
            total: parseFloat(product.price * 1),
            quantity: 1,
          };
          setPurchase((prevstate) => {
            if (prevstate.length > 0) {
              const purchseExist = prevstate.filter(
                (val) => val._id === product._id
              );
              if (purchseExist.length > 0) {
                let updateInfo = [];
                prevstate.map((data) => {
                  if (data._id === product._id) {
                    data.quantity =
                      parseInt(data.quantity) + 1 > data.total_quantity
                        ? data.total_quantity
                        : parseInt(data.quantity) + 1;
                    data.total =
                      parseInt(data.quantity) * parseFloat(data.price);
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
        }
      });
    }
    // eslint-disable-next-line
  }, [socket]);

  const alertUser = (e) => {
    e.preventDefault();
    e.returnValue = "";
  };
  let lastScannedBarcode = "";
  const onGlobalKeyPressed = async (e) => {
    let charCode = typeof e.which === "number" ? e.which : e.keyCode;
    if (charCode !== 13) {
      lastScannedBarcode += String.fromCharCode(charCode);
    } else {
      console.log(lastScannedBarcode);
      const filterProduct = await products.filter(
        (data) => data.productId === lastScannedBarcode
      );
      console.log(filterProduct);
      if (filterProduct.length < 1) {
        setTimeout(() => {
          searchRef
            ? searchRef.current
              ? searchRef.current.blur()
              : console.log("")
            : console.log("");
        }, 400);

        lastScannedBarcode = "";
        return;
      } else {
        setTimeout(() => {
          searchRef
            ? searchRef.current
              ? searchRef.current.blur()
              : console.log("")
            : console.log("");
        }, 400);
        const productInfo = { ...filterProduct[0] };
        if (productInfo.quantity === 0) {
          Swal.fire({
            icon: "warning",
            text: "Product Inventory Out Of stock",
            timer: 2500,
            allowOutsideClick: false,
          });
          lastScannedBarcode = "";

          return;
        } else {
          const purchaseObject = {
            _id: productInfo._id,
            product: productInfo.product,
            total_quantity: productInfo.quantity,
            price: parseFloat(productInfo.price),
            total: parseFloat(productInfo.price * 1),
            quantity: 1,
          };
          setPurchase((prevstate) => {
            if (prevstate.length > 0) {
              const purchseExist = prevstate.filter(
                (val) => val._id === productInfo._id
              );
              if (purchseExist.length > 0) {
                let updateInfo = [];
                prevstate.map((data) => {
                  if (data._id === productInfo._id) {
                    data.quantity =
                      parseInt(data.quantity) + 1 > data.total_quantity
                        ? data.total_quantity
                        : parseInt(data.quantity) + 1;
                    data.total =
                      parseInt(data.quantity) * parseFloat(data.price);
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
          lastScannedBarcode = "";

          return;
        }
      }
    }
  };
  useEffect(() => {
    window.onkeypress = onGlobalKeyPressed;
    // eslint-disable-next-line
  }, [window.onkeypress]);
  return (
    <div className="counterArea_container">
      <div className="counter-area-header shadow">
        <Link to="/branch/dashboard">
          <IoMdClose size={50} className="back-to-main shadow" />
        </Link>

        <h1 className="brand-information-header">
          <p>
            {" "}
            {user
              ? user.status === "owner"
                ? user.branch_name + " Store"
                : user.branch.branch_name + " Store"
              : null}{" "}
          </p>
        </h1>
      </div>
      <div className="counter-area-body">
        {loading ? (
          <div className="w-100 mt-5">
            <LoaderSpinner height={"400px"} />
          </div>
        ) : (
          <>
            <CounterAreaData
              tax={tax}
              purchase={purchase}
              setPurchase={setPurchase}
              products={products}
              addPurchaseModal={addPurchaseModal}
              setAddPurchaseModal={setAddPurchaseModal}
              search={search}
              setSearch={setSearch}
              searchRef={searchRef}
            />
            <CounterAreaPay
              tax={tax}
              purchase={purchase}
              setPurchase={setPurchase}
              paymentMethod={paymentMethod}
              setPaymethod={setPaymethod}
              payment={payment}
              setPayment={setPayment}
              payer={payer}
              searchRef={searchRef}
              setPayer={setPayer}
            />
            <AddSearchProduct
              addPurchaseModal={addPurchaseModal}
              setAddPurchaseModal={setAddPurchaseModal}
              search={search}
              searchRef={searchRef}
              setPurchase={setPurchase}
              setSearch={setSearch}
            />
          </>
        )}
      </div>
    </div>
  );
};
