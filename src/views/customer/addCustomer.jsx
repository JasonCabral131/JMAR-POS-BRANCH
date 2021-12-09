import React, { useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { createCustomerInfo } from "src/redux/action";

import { imagesObject, informationObject } from "src/reusable";
import { CreateCashierAndCustomer } from "src/reusable/cashierAndCustomer";
import Swal from "sweetalert2";
const AddCustomerInformation = ({
  addingLoading,
  setAddingLoading,
  showAddModal,
  setShowAddModal,
}) => {
  const { socket } = useSelector((state) => state.socket);
  const dispatch = useDispatch();
  const [images, setImages] = useState(imagesObject);
  const [reviewModal, setReviewModal] = useState(false);
  const [information, setInformation] = useState(informationObject);
  const handleCreateSubmit = async (information, credentials) => {
    const {
      lastname,
      firstname,
      middlename,
      email,
      phone,
      birthday,
      sex,
      address,
      password,
      civilStatus,
    } = information;
    const form = new FormData();
    form.append("lastname", lastname);
    form.append("firstname", firstname);
    form.append("middlename", middlename);
    form.append("email", email.email.toLowerCase());
    form.append("phone", phone.phone);
    form.append("birthday", birthday);
    form.append("sex", sex);
    form.append("address", JSON.stringify(address));
    form.append("password", password);
    form.append("civilStatus", civilStatus);
    form.append("profile", images.profile.file);
    form.append("backId", images.BackId.file);
    form.append("frontId", images.FrontId.file);
    Swal.fire({
      title: "Are you sure?",
      text: "Check The Review information",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, proceed it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
      allowOutsideClick: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setAddingLoading(true);
        const res = await dispatch(createCustomerInfo(form));
        if (res) {
          if (socket) {
            socket.emit("pull-new-request", {}, (data) => {});
          }
          setReviewModal(false);
          setAddingLoading(false);
          setInformation(informationObject);
          setImages(imagesObject);
          return;
        }
        setAddingLoading(false);
      }
    });
  };
  return (
    <>
      <CreateCashierAndCustomer
        handleCreateSubmit={handleCreateSubmit}
        addingLoading={addingLoading}
        setAddingLoading={setAddingLoading}
        showAddModal={showAddModal}
        setShowAddModal={setShowAddModal}
        resume={false}
        info={"Customer"}
        images={images}
        setImages={setImages}
        information={information}
        setInformation={setInformation}
        reviewModal={reviewModal}
        setReviewModal={setReviewModal}
      />
    </>
  );
};
export default AddCustomerInformation;
