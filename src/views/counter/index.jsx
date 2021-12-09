import React, { useEffect, useState } from "react";
import { CounterAreaData } from "./counterAreaData";
import { CounterAreaPay } from "./counterAreaPay";
import { CImg } from "@coreui/react";
import { useSelector } from "react-redux";
import "./counter.scss";
import { IoMdClose } from "react-icons/io";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getProductByBrandOwner } from "src/redux/action/product.action";
import Swal from "sweetalert2";
import { AddSearchProduct } from "./AddSearchProduct";

export const CounterArea = (props) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { socket } = useSelector((state) => state.socket);
  const { tax } = useSelector((state) => state.tax);
  const { products } = useSelector((state) => state.product);
  const [addPurchaseModal, setAddPurchaseModal] = useState(false);
  const [purchase, setPurchase] = useState([]);
  const [paymentMethod, setPaymethod] = useState(true);
  const [payment, setPayment] = useState({ payment: "", isvalid: false });
  const [search, setSearch] = useState(null);
  const [payer, setPayer] = useState(null);
  useEffect(() => {
    window.addEventListener("beforeunload", alertUser);
    return () => {
      window.removeEventListener("beforeunload", alertUser);
    };
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    dispatch(getProductByBrandOwner());
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
  return (
    <div className="counterArea_container">
      <div className="counter-area-header shadow">
        <Link to="/branch/dashboard">
          <IoMdClose size={50} className="back-to-main shadow" />
        </Link>

        <h1 className="brand-information-header">
          <CImg
            src="https://res.cloudinary.com/seven-eleven-grocery-netlify-com/image/upload/v1633504263/logo_umwwru.png"
            className="c-sidebar-brand-full"
            name="logo"
            height="35"
            alt="Logo"
          />
          <p>
            {" "}
            {user
              ? user.status === "owner"
                ? user.branch_name + " Branch"
                : user.Owner.branch_name + " Branch"
              : null}{" "}
          </p>
        </h1>
      </div>
      <div className="counter-area-body">
        <CounterAreaData
          tax={tax}
          purchase={purchase}
          setPurchase={setPurchase}
          products={products}
          addPurchaseModal={addPurchaseModal}
          setAddPurchaseModal={setAddPurchaseModal}
          search={search}
          setSearch={setSearch}
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
          setPayer={setPayer}
        />
        <AddSearchProduct
          addPurchaseModal={addPurchaseModal}
          setAddPurchaseModal={setAddPurchaseModal}
          search={search}
          setPurchase={setPurchase}
          setSearch={setSearch}
        />
      </div>
    </div>
  );
};
