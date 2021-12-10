import React, { useEffect, useState } from "react";
import { Modal, Carousel, OverlayTrigger, Tooltip } from "react-bootstrap";
import CreateBrand from "./createBrand";
import { CDataTable, CButton } from "@coreui/react";

import { IoTrash, IoPencilOutline } from "react-icons/io5";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import {
  brandRemoveImage,
  createBrandByOwner,
  deleteBrandInfo,
  UpdateBrandInfo,
} from "src/redux/action/brand.action";
import { BrandFields } from "src/reusable";
import UpdateBrand from "./updateBrand";
import { RiDeviceRecoverLine, RiFileAddLine } from "react-icons/ri";
import Loader from "react-loader-spinner";
import { Link } from "react-router-dom";
const Brand = (props) => {
  const dispatch = useDispatch();
  const { brand, loading } = useSelector((state) => state.brand);
  const [show, setShow] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeletingLoading] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [images, setImages] = useState([]);
  const [addingLoading, setAddingLoading] = useState(false);
  const [brandName, setBrandName] = useState("");
  const [editorState, setEditorState] = useState(null);
  const [updateEditorState, setUpdateEditorState] = useState(null);
  const [updateImages, setUpdateImages] = useState([]);
  const [addingUpdateImages, setAddingUpdateImages] = useState([]);
  const [updateBrand, setUpdateBrand] = useState(null);
  const [deleteBrand, setDeleteBrand] = useState(null);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleDraftJs = () => {
    const html = "<span></span>";
    const contentBlock = htmlToDraft(html);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );
      const editorState = EditorState.createWithContent(contentState);
      setEditorState(editorState);
      setUpdateEditorState(editorState);
    }
    setImages([]);
    setShow(false);
    setBrandName("");
  };
  useEffect(() => {
    handleDraftJs();
    // eslint-disable-next-line
  }, []);
  const handleSubmit = async () => {
    const description = editorState
      ? draftToHtml(convertToRaw(editorState.getCurrentContent()))
      : "<span></span>";
    const form = new FormData();
    setAddingLoading(true);
    if (brandName.length < 3) {
      Swal.fire({
        icon: "warning",
        text: "Brand Name Required",
        timer: 1500,
      });
      setAddingLoading(false);
      return;
    }
    if (description === "<p></p>" || description === "<span></span>") {
      Swal.fire({
        icon: "warning",
        text: "Description Required",
        timer: 1500,
      });
      setAddingLoading(false);
      return;
    }
    if (images.length < 1) {
      Swal.fire({
        icon: "warning",
        text: "Brand Picture Required",
        timer: 1500,
      });
      setAddingLoading(false);
      return;
    }

    form.append("brand", brandName);
    form.append("description", description);
    for (let img of images) {
      form.append("images", img.file);
    }
    const result = await dispatch(createBrandByOwner(form));
    if (result.result) {
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Successfully Added",
      });
      setAddingLoading(false);
      handleDraftJs();
      return;
    }
    Swal.fire({
      icon: "warning",
      title: "UnSuccessful",
      text: result.message,
    });

    setAddingLoading(false);
    return;
  };

  const handleEdit = (item) => {
    setAddingUpdateImages([]);
    const newImages = item.images.map((data, index) => {
      if (index === 0) {
        return { ...data, active: true, status: "old" };
      }
      return { ...data, active: false, status: "old" };
    });
    setUpdateImages(newImages);
    const html = item.description;
    const contentBlock = htmlToDraft(html);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );
      const editorState = EditorState.createWithContent(contentState);
      setUpdateEditorState(editorState);
    }
    setUpdateModal(true);
    setUpdateBrand(item);
  };
  const handleRemoveImages = (item) => {
    const { _id, status } = item;
    const BrandId = updateBrand._id;
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
        const result = await dispatch(brandRemoveImage({ ...item, BrandId }));
        if (result.result) {
          let updateImg = updateImages.filter((val) => val._id !== _id);
          updateImg[updateImg.length - 1].active = true;
          setUpdateImages(updateImg);
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Remove Success",
            allowOutsideClick: false,
            timer: 1500,
          });
          return;
        }
      }
    });
    return;
  };
  const handleUpdateBrand = async () => {
    setUpdateLoading(true);
    const description = updateEditorState
      ? draftToHtml(convertToRaw(updateEditorState.getCurrentContent()))
      : "<span></span>";
    const upbrand = updateBrand.brand;
    const data = new FormData();

    data.append("brand", upbrand);
    data.append("_id", updateBrand._id);
    data.append("description", description);
    for (let file of addingUpdateImages) {
      data.append("images", file.file);
    }
    if (upbrand.length < 3) {
      Swal.fire({
        icon: "warning",
        text: "Brand Name Required",
        timer: 1500,
      });
      setUpdateLoading(false);
      return;
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
        const res = await dispatch(UpdateBrandInfo(data));
        if (res.result) {
          Swal.fire({
            icon: "success",
            text: "Updated Successfully",
            timer: 2000,
            allowOutsideClick: false,
          });
          setUpdateModal(false);
          setAddingUpdateImages([]);
          setUpdateLoading(false);
          return;
        }
        Swal.fire({
          icon: "warning",
          text: res.message,
          timer: 2000,
          allowOutsideClick: false,
        });
        setUpdateLoading(false);
        return;
      }
      setUpdateLoading(false);
    });
  };
  const handleDelete = async (item) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Archived in Database",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Archived it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
      allowOutsideClick: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setDeletingLoading(true);
        setDeleteBrand(item);
        const res = await dispatch(
          deleteBrandInfo({ _id: item._id, deleted: "yes" })
        );
        if (res.result) {
          Swal.fire({
            icon: "success",
            text: "Successfully deleted",
            timer: 2000,
            allowOutsideClick: false,
          });
          setDeletingLoading(false);
          setDeleteBrand(null);
          return;
        }
        Swal.fire({
          icon: "warning",
          text: res.message,
          timer: 2000,
          allowOutsideClick: false,
        });
        setDeletingLoading(false);
        setDeleteBrand(null);
        return;
      }
      setDeletingLoading(false);
    });
  };
  return (
    <div className="card shadow card-container">
      <div className="card-header  ">
        <div className="row">
          <div className="col-md-6">
            <h1 className="header-card-information">
              <span>Product Brand</span>
            </h1>
          </div>
          <div className="col-md-6 w-100  d-flex justify-content-end">
            <div className="mt-auto">
              <CButton
                color="danger"
                variant="outline"
                shape="square"
                size="sm"
              >
                <Link
                  to="/branch/inventory-item/brand/archived-brand"
                  className="a-link-none"
                >
                  <RiDeviceRecoverLine size="15" />
                </Link>
              </CButton>
              <CButton
                className="ml-1"
                color="info"
                shape="square"
                variant="outline"
                size="sm"
                onClick={handleShow}
                disabled={addingLoading}
              >
                {addingLoading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm mr-1"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Wait...
                  </>
                ) : (
                  <>
                    {" "}
                    <RiFileAddLine size="15" />
                  </>
                )}
              </CButton>
            </div>
          </div>
        </div>
        <div className="mt-2" />
      </div>
      <div className="card-body">
        <CDataTable
          items={[...brand]}
          fields={BrandFields}
          columnFilter={false}
          tableFilter={{ placeholder: "search brand" }}
          footer={false}
          itemsPerPageSelect={true}
          itemsPerPage={5}
          hover
          sorter
          pagination
          loading={loading}
          scopedSlots={{
            Index: (item, index) => (
              <td>
                <p>{item.Index}</p>
              </td>
            ),
            images: (item, index) => (
              <td className="carousel_container">
                <Carousel fade indicators={false} variant="dark">
                  {Array.isArray(item.images) ? (
                    item.images.length > 0 ? (
                      item.images.map((data, index) => {
                        return (
                          <Carousel.Item key={data._id}>
                            <img
                              className="d-block carousel_images"
                              src={data.img}
                              alt="First slide"
                            />
                          </Carousel.Item>
                        );
                      })
                    ) : (
                      <Carousel.Item>
                        <img
                          className="d-block carousel_images"
                          src="https://cdn1.iconfinder.com/data/icons/image-1-0/1024/image_block-512.png"
                          alt="First slide"
                        />
                      </Carousel.Item>
                    )
                  ) : (
                    <Carousel.Item>
                      <img
                        className="d-block carousel_images"
                        src="https://cdn1.iconfinder.com/data/icons/image-1-0/1024/image_block-512.png"
                        alt="First slide"
                      />
                    </Carousel.Item>
                  )}
                </Carousel>
              </td>
            ),
            brand: (item) => (
              <td className="brandnametable">
                <OverlayTrigger
                  key={"bottom"}
                  placement={"top"}
                  overlay={
                    <Tooltip id={`tooltip-bottom`}>
                      View Data Of {item.brand}
                    </Tooltip>
                  }
                >
                  <p> {item.brand}</p>
                </OverlayTrigger>
              </td>
            ),
            Date: (item, index) => (
              <td className="text-center">
                <div> {new Date(item.createdAt).toLocaleString()}</div>
                {item.inventoryStaff ? null : (
                  <div className="small text-muted">
                    <span>
                      <img
                        src={item.Owner.branch_owner_profile.profile}
                        className="icon_profile"
                        alt={`${item.Owner._id + index}`}
                      />
                    </span>{" "}
                    |{" "}
                    {`${item.Owner.branch_owner_lname} , ${item.Owner.branch_owner_fname}`}{" "}
                    - Owner
                  </div>
                )}
              </td>
            ),
            action: (item, index) => (
              <td style={{ width: "150px" }}>
                <div className="d-flex justify-content-center">
                  <CButton
                    color="danger"
                    shape="square"
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(item)}
                    disabled={deleteLoading}
                  >
                    {deleteBrand ? (
                      item._id === deleteBrand._id ? (
                        deleteLoading ? (
                          <Loader
                            type="ThreeDots"
                            color="#00BFFF"
                            height={20}
                            width={20}
                          />
                        ) : (
                          <IoTrash size="15" />
                        )
                      ) : (
                        <IoTrash size="15" />
                      )
                    ) : (
                      <IoTrash size="15" />
                    )}
                  </CButton>

                  <CButton
                    color="info"
                    variant="outline"
                    shape="square"
                    size="sm"
                    className="ml-1"
                    onClick={() => {
                      handleEdit(item);
                    }}
                  >
                    <IoPencilOutline size="15" />
                  </CButton>
                </div>
              </td>
            ),
          }}
        />
      </div>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        dialogClassName="modal-cover-screen"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {" "}
            <h1 className="header-card-information">
              <span>Create Brand</span>
            </h1>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-container">
          <CreateBrand
            images={images}
            setImages={setImages}
            editorState={editorState}
            setEditorState={setEditorState}
            Editor={Editor}
            brandName={brandName}
            setBrandName={setBrandName}
          />
        </Modal.Body>
        <Modal.Footer>
          <CButton
            color="secondary"
            variant="outline"
            shape="square"
            size="lg"
            onClick={handleClose}
          >
            Cancel
          </CButton>
          <CButton
            color="success"
            shape="square"
            size="lg"
            onClick={handleSubmit}
            disabled={addingLoading}
          >
            {addingLoading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm mr-1"
                  role="status"
                  aria-hidden="true"
                ></span>
                Loading...
              </>
            ) : (
              "Save"
            )}
          </CButton>
        </Modal.Footer>
      </Modal>

      <Modal
        show={updateModal}
        onHide={() => setUpdateModal(false)}
        backdrop="static"
        dialogClassName="modal-cover-screen"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {" "}
            <h1 className="header-card-information">
              <span>Update Brand</span>
            </h1>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-container">
          <UpdateBrand
            updateEditorState={updateEditorState}
            setUpdateEditorState={setUpdateEditorState}
            updateImages={updateImages}
            setUpdateImages={setUpdateImages}
            addingUpdateImages={addingUpdateImages}
            setAddingUpdateImages={setAddingUpdateImages}
            updateBrand={updateBrand}
            setUpdateBrand={setUpdateBrand}
            handleRemoveImages={handleRemoveImages}
            Editor={Editor}
          />
        </Modal.Body>
        <Modal.Footer>
          <CButton
            color="secondary"
            variant="outline"
            shape="square"
            size="lg"
            onClick={() => setUpdateModal(false)}
            disabled={updateLoading}
          >
            Cancel
          </CButton>
          <CButton
            color="info"
            variant="outline"
            shape="square"
            size="lg"
            className="ml-1"
            onClick={handleUpdateBrand}
            disabled={updateLoading}
          >
            {updateLoading ? (
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
    </div>
  );
};
export default Brand;
