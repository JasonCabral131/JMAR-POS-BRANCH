import React, { useState } from "react";
import { CreateCashierAndCustomer } from "src/reusable/cashierAndCustomer";
import { informationObject, imagesObject } from "src/reusable";
import { useDispatch } from "react-redux";
import { createCashierBranchInfo } from "src/redux/action";
import Swal from "sweetalert2";
const AddBranchCashier = ({
  addingLoading,
  setAddingLoading,
  showAddModal,
  setShowAddModal,
}) => {
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
      resume,
      civilStatus,
    } = information;
    const form = new FormData();
    form.append("lastname", lastname);
    form.append("firstname", firstname);
    form.append("middlename", middlename);
    form.append("email", email.email);
    form.append("phone", phone.phone);
    form.append("birthday", birthday);
    form.append("sex", sex);
    form.append("address", JSON.stringify(address));
    form.append("password", password);

    form.append("civilStatus", civilStatus);
    form.append("resume", resume);
    form.append("profile", images.profile.file);
    form.append("backId", images.BackId.file);
    form.append("frontId", images.FrontId.file);
    console.log(resume);
    console.log(images.profile.file);
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
        const res = await dispatch(createCashierBranchInfo(form));
        if (res.result) {
          setReviewModal(false);
          setAddingLoading(false);
          setInformation(informationObject);
          setImages(imagesObject);
        }
        setAddingLoading(false);
      }
    });
  };
  return (
    <CreateCashierAndCustomer
      handleCreateSubmit={handleCreateSubmit}
      addingLoading={addingLoading}
      setAddingLoading={setAddingLoading}
      showAddModal={showAddModal}
      setShowAddModal={setShowAddModal}
      resume={true}
      info={"Cashier"}
      images={images}
      setImages={setImages}
      information={information}
      setInformation={setInformation}
      reviewModal={reviewModal}
      setReviewModal={setReviewModal}
    />
  );
};
export default AddBranchCashier;
