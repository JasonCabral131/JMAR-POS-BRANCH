import React from "react";
import { Modal } from "react-bootstrap";
import { CButton } from "@coreui/react";
import { imageUploadCallBack, UpdateGallery } from "src/reusable";
import Swal from "sweetalert2";
import Select from "react-select";
import { Editor } from "react-draft-wysiwyg";
import { convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteProductImage,
  updateProductInfo,
} from "src/redux/action/product.action";
const UpdateProductInformation = ({
  updateModal,
  setupdateModal,
  UpdatingLoading,
  setUpdatingLoading,
  updateImages,
  setUpdateImages,
  addingUpdateImages,
  setAddingUpdateImages,
  updateEditorState,
  setUpdateEditorState,
  updateSubBrand,
  setUpdateSubBrand,
  updateBrand,
  setUpdateBrand,
  updateProduct,
  setUpdateProduct,
  subcategory,
  brand,
  selectedSub,
  setSelectSub,
}) => {
  const dispatch = useDispatch();
  const { socket } = useSelector((state) => state.socket);
  const handleSubmit = () => {
    setUpdatingLoading(true);
    const { _id, product, productId, quantity, price } = updateProduct;
    const description = updateEditorState
      ? draftToHtml(convertToRaw(updateEditorState.getCurrentContent()))
      : "<span></span>";
    if (product === "") {
      Swal.fire({
        icon: "error",
        text: "Product Name Required!",
        timer: 3000,
      });
      setUpdatingLoading(false);
      return;
    }
    if (price === "" || parseFloat(price) < 1) {
      console.log(price);
      Swal.fire({
        icon: "error",
        text: "Price Required!",
        timer: 3000,
      });
      setUpdatingLoading(false);
      return;
    }
    // if (quantity === "" || parseFloat(quantity) < 10) {
    //   Swal.fire({
    //     icon: "error",
    //     text: "Quantity Required!",
    //     timer: 3000,
    //   });
    //   setUpdatingLoading(false);
    //   return;
    // }
    if (productId === "") {
      Swal.fire({
        icon: "error",
        text: "Product Barcode Id Required!",
        timer: 3000,
      });
      setUpdatingLoading(false);
      return;
    }
    if (!updateSubBrand) {
      Swal.fire({
        icon: "error",
        text: `${updateBrand.value.brand} Subcategory is required`,
        timer: 3000,
      });
      setUpdatingLoading(false);
      return;
    }
    const data = new FormData();
    data.append("_id", _id);
    data.append("description", description);
    data.append("product", product);
    data.append("price", price);
    data.append("quantity", quantity);
    data.append("productId", productId);
    data.append("brandsubcat", updateSubBrand.value._id);
    for (let file of addingUpdateImages) {
      data.append("images", file.file);
    }
    Swal.fire({
      title: "Are you sure want to Update?",
      text: "Data wont be reverted to orginal ",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Update it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
      allowOutsideClick: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await dispatch(updateProductInfo(data));
        if (res.result) {
          Swal.fire({
            icon: "success",
            text: "Updated Successfully",
            timer: 2000,
          });
          setUpdatingLoading(false);
          setAddingUpdateImages([]);
          setupdateModal(false);
          if (socket) {
            socket.emit(
              "update-socket-product-store",
              { description: "asdasd" },
              (data) => {}
            );
          }
          return;
        }
        Swal.fire({
          icon: "error",
          text: res.message,
          timer: 2000,
        });
        setUpdatingLoading(false);

        return;
      }
      setUpdatingLoading(false);
    });
  };
  const handleRemoveImages = (item) => {
    const { _id, status } = item;
    const productId = updateProduct._id;
    if (status === "new") {
      const adding = addingUpdateImages.filter((val) => val._id !== _id);
      let updateImg = updateImages.filter((val) => val._id !== _id);
      updateImg[updateImg.length - 1].active = true;
      setAddingUpdateImages(adding);
      setUpdateImages(updateImg);
      return;
    }

    const old = updateImages.filter((val) => val.status === "old");
    if (old.length <= 1) {
      Swal.fire({
        icon: "error",
        timer: 1500,
        text: "Image Required Atleast 1",
      });
      return;
    }
    Swal.fire({
      title: "Are you sure?",
      text: "This Image Will be Deleted In Database",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
      allowOutsideClick: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await dispatch(deleteProductImage({ ...item, productId }));
        if (res.result) {
          let updateImg = updateImages.filter((val) => val._id !== _id);
          updateImg[updateImg.length - 1].active = true;
          setUpdateImages(updateImg);
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Remove Success",
            allowOutsideClick: false,
            timer: 2500,
          });
          if (socket) {
            socket.emit(
              "update-socket-product-store",
              { description: "asdasd" },
              (data) => {}
            );
          }
          return;
        }
        Swal.fire({
          icon: "warning",
          text: "UnSuccessful",
          allowOutsideClick: false,
          timer: 1500,
        });
        return;
      }
    });
  };
  const handleBrandOnChange = (val) => {
    setSelectSub([]);
    const subFilter = subcategory
      .filter((data) => data.brand._id === val.value._id)
      .map((data) => {
        return {
          value: { sub: data.subcategory, _id: data._id },
          label: data.subcategory,
        };
      });
    setSelectSub(subFilter);
    setUpdateBrand(val);
    setUpdateSubBrand(null);
  };
  return (
    <Modal
      show={updateModal}
      onHide={() => setupdateModal(false)}
      backdrop="static"
      dialogClassName="modal-cover-screen"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {" "}
          <h1 className="header-card-information">
            <span>Update Product</span>
          </h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body-container">
        <div className="brand-modal-container">
          <div className="row">
            <div className="col-md-5">
              <label className="label-name update-label">
                <span>Brand Subcategory Images</span>
              </label>
              <div className="d-block d-flex justify-content-center">
                <UpdateGallery
                  images={updateImages}
                  handlingRemove={handleRemoveImages}
                  setImages={setUpdateImages}
                  addingUpdateImages={addingUpdateImages}
                  setAddingUpdateImages={setAddingUpdateImages}
                />
              </div>
            </div>
            <div className="col-md-7 mt-2">
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="label-name">Select Brand</label>
                    <Select
                      value={updateBrand}
                      options={[...brand]}
                      cacheOptions
                      placeholder={"Select Brand"}
                      onChange={handleBrandOnChange}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="label-name">
                      Select{" "}
                      {`${updateBrand ? updateBrand.value.brand : "Brand"}`}{" "}
                      Subcategory
                    </label>
                    <Select
                      value={updateSubBrand}
                      options={[...selectedSub]}
                      cacheOptions
                      placeholder={`Select ${
                        updateBrand ? updateBrand.value.brand : "Brand"
                      } Subcategory`}
                      onChange={(e) => setUpdateSubBrand(e)}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="label-name">Product Name</label>
                    <input
                      value={updateProduct ? updateProduct.product : ""}
                      onChange={(e) =>
                        setUpdateProduct((prev) => {
                          return { ...prev, product: e.target.value };
                        })
                      }
                      onKeyPress={(e) => {
                        console.log(e.key);
                      }}
                      type="text"
                      name="product"
                      className=" inputvalue"
                      placeholder="Input product name"
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="label-name">Product Quantity</label>
                    <input
                      value={updateProduct ? updateProduct.quantity : ""}
                      onChange={(e) =>
                        setUpdateProduct((prev) => {
                          return { ...prev, quantity: e.target.value };
                        })
                      }
                      type="number"
                      className=" inputvalue"
                      min="1"
                      name="quantity"
                      max="50000"
                      placeholder="Input product name"
                      onKeyPress={(e) => {
                        const theEvent = e || window.event;
                        if (e.target.value.length === 0 && e.which === 48) {
                          theEvent.preventDefault();
                        }
                      }}
                      disabled={true}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="label-name">Product Price</label>
                    <input
                      value={updateProduct ? updateProduct.price : ""}
                      onChange={(e) =>
                        setUpdateProduct((prev) => {
                          return { ...prev, price: e.target.value };
                        })
                      }
                      type="number"
                      min="1"
                      name="price"
                      className=" inputvalue"
                      onKeyPress={(e) => {
                        const theEvent = e || window.event;
                        if (e.target.value.length === 0 && e.which === 48) {
                          theEvent.preventDefault();
                        }
                      }}
                      placeholder="Input product name"
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="label-name">Product Barcode Number</label>
                    <input
                      value={updateProduct ? updateProduct.productId : ""}
                      onChange={(e) =>
                        setUpdateProduct((prev) => {
                          return { ...prev, productId: e.target.value };
                        })
                      }
                      type="number"
                      className=" inputvalue"
                      placeholder="Input product name"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="label-name">Product Description</label>

                  <Editor
                    editorState={updateEditorState}
                    onEditorStateChange={(content) =>
                      setUpdateEditorState(content)
                    }
                    toolbar={{
                      image: {
                        className: undefined,
                        component: undefined,
                        popupClassName: undefined,
                        urlEnabled: true,
                        uploadEnabled: true,
                        alignmentEnabled: true,
                        uploadCallback: imageUploadCallBack,
                        previewImage: true,
                        inputAccept: "image/*",
                        defaultSize: {
                          height: "400px",
                          width: "400px",
                        },
                      },
                    }}
                    placeholder="product description"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <CButton
          color="secondary"
          variant="outline"
          shape="square"
          size="lg"
          onClick={() => setupdateModal(false)}
          disabled={UpdatingLoading}
        >
          Cancel
        </CButton>
        <CButton
          color="info"
          variant="outline"
          shape="square"
          size="lg"
          className="ml-1"
          disabled={UpdatingLoading}
          onClick={handleSubmit}
        >
          {UpdatingLoading ? (
            <>
              <span
                className="spinner-border spinner-border-sm mr-1"
                role="status"
                aria-hidden="true"
              ></span>
              Loading...
            </>
          ) : (
            "Update"
          )}
        </CButton>
      </Modal.Footer>
    </Modal>
  );
};
export default UpdateProductInformation;
