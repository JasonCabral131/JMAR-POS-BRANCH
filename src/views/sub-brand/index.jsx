import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CButton, CDataTable } from "@coreui/react";
import { IoTrash, IoPencilOutline } from "react-icons/io5";
import { RiFileAddLine, RiDeviceRecoverLine } from "react-icons/ri";
import { BrandSubFields } from "src/reusable";
import Select from "react-select";
import { useSelector, useDispatch } from "react-redux";
import { getBrandByBranchOwner } from "src/redux/action/brand.action";
import { Carousel, Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import CreateSubcategory from "./createSubcategory";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import Swal from "sweetalert2";
import {
  createSubcategoryInfo,
  subCategoryRemoveImage,
  updateSubcategoryInfo,
  ArchivedSubcategoryStatus,
  getSubcategoryInfo,
} from "src/redux/action/subcategory.action";
import Loader from "react-loader-spinner";
import UpdateSubcategory from "./updateBrandSubcategory";

const SubBrand = (props) => {
  const dispatch = useDispatch();
  const { brand } = useSelector((state) => state.brand);
  const { subcategory } = useSelector((state) => state.subcategory);
  const [addModal, setAddModal] = useState(false);
  const [optionsPresented, setOptionPresented] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [addingLoading, setAddingLoading] = useState(false);
  const [deleteLoading, setDeletingLoading] = useState(false);
  const [deleteBrandSub, setDeleteBrandSub] = useState(null);
  const [editorState, setEditorState] = useState(null);
  const [options, setOptions] = useState([]);
  const [images, setImages] = useState([]);
  const [brandname, setBrandName] = useState("");
  const [subcategoryName, setSubcategoryName] = useState("");
  const [filterByBrand, setFilterByBrands] = useState(null);
  const [updateImages, setUpdateImages] = useState([]);
  const [addingUpdateImages, setAddingUpdateImages] = useState([]);
  const [updateEditorState, setUpdateEditorState] = useState(null);
  const [updateSubBrand, setUpdateSubBrand] = useState(null);
  const [updateBrand, setUpdatebrand] = useState(null);
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
    setAddModal(false);
    setImages([]);
    setBrandName("");
    setSubcategoryName("");
  };
  useEffect(() => {
    dispatch(getBrandByBranchOwner());
    handleDraftJs();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const bra = brand.map((data) => {
      const value = { brand: data.brand, _id: data._id };
      return { value: value, label: data.brand };
    });
    setOptions(bra);
    dispatch(getSubcategoryInfo());
    // eslint-disable-next-line
  }, [brand]);

  const handleSubmit = async () => {
    setAddingLoading(true);
    const description = editorState
      ? draftToHtml(convertToRaw(editorState.getCurrentContent()))
      : "<span></span>";
    const data = new FormData();
    if (description === "<p></p>" || description === "<span></span>") {
      Swal.fire({
        icon: "warning",
        text: "description required!",
        timer: 2500,
        allowOutsideClick: false,
      });
      setAddingLoading(false);
      return;
    }
    if (!brandname._id) {
      Swal.fire({
        icon: "warning",
        text: "Brand required!",
        timer: 2500,
        allowOutsideClick: false,
      });
      setAddingLoading(false);
      return;
    }
    if (subcategoryName === "") {
      Swal.fire({
        icon: "warning",
        text: `${brandname.brand} subcategory required`,
        timer: 2500,
        allowOutsideClick: false,
      });
      setAddingLoading(false);
      return;
    }

    if (images.length < 1) {
      Swal.fire({
        icon: "warning",
        text: `${subcategoryName} Images Required atleast 1`,
        timer: 2500,
        allowOutsideClick: false,
      });
      setAddingLoading(false);
      return;
    }
    data.append("subBrand", subcategoryName);
    data.append("brand", brandname._id);
    data.append("description", description);
    for (let file of images) {
      data.append("images", file.file);
    }
    const res = await dispatch(createSubcategoryInfo(data));

    if (res.result) {
      Swal.fire({
        icon: "success",
        text: "Created Successfully",
        timer: 2500,
        allowOutsideClick: false,
      });
      handleDraftJs();
      setAddingLoading(false);
      return;
    }
    Swal.fire({
      icon: "warning",
      text: res.message,
      timer: 2500,
      allowOutsideClick: false,
    });
    setAddingLoading(false);
    return;
  };

  const handleArchived = async (item) => {
    setDeleteBrandSub(item);
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
        const res = await dispatch(
          ArchivedSubcategoryStatus({ _id: item._id, deleted: "yes" })
        );
        if (res.result) {
          Swal.fire({
            icon: "success",
            text: "Successfully deleted",
            timer: 2000,
            allowOutsideClick: false,
          });
          setDeletingLoading(false);
          setDeleteBrandSub(null);
          return;
        }
        Swal.fire({
          icon: "warning",
          text: res.message,
          timer: 2000,
          allowOutsideClick: false,
        });
        setDeletingLoading(false);
        setDeleteBrandSub(null);
        return;
      }
    });
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
    setUpdateSubBrand({ subBrand: item.subcategory, _id: item._id });
    setUpdatebrand({
      value: { brand: item.brand.brand, _id: item.brand._id },
      label: item.brand.brand,
    });

    console.log(updateEditorState, updateImages, updateSubBrand, updateBrand);
  };
  const handleRemoveImages = (item) => {
    const { _id, status } = item;
    const subBrandID = updateSubBrand._id;
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
        const result = await dispatch(
          subCategoryRemoveImage({ ...item, subBrandId: subBrandID })
        );
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
  const handleUpdate = async () => {
    setUpdateLoading(true);

    const description = updateEditorState
      ? draftToHtml(convertToRaw(updateEditorState.getCurrentContent()))
      : "<span></span>";
    const { _id, subBrand } = updateSubBrand;
    const BrandId = updateBrand.value._id;
    const data = new FormData();
    data.append("_id", _id);
    data.append("brand", BrandId);
    data.append("subBrand", subBrand);
    data.append("description", description);
    for (let file of addingUpdateImages) {
      data.append("images", file.file);
    }
    if (subBrand.length < 3) {
      Swal.fire({
        icon: "warning",
        text: "Brand Subcategory Required",
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
        const res = await dispatch(updateSubcategoryInfo(data));
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
  const handleFilterByBrand = (val) => {
    if (val.value) {
      const filterByBrand = subcategory.filter(
        (data) => data.brand._id === val.value._id
      );
      setOptionPresented(filterByBrand);
    } else {
      setOptionPresented(null);
    }
    setFilterByBrands(val);
  };
  return (
    <div className="card shadow card-container">
      <div className="card-header  ">
        <div className="row">
          <div className="col-md-6">
            <h1 className="header-card-information">
              <span>Brand Subcategory</span>
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
                  to="/branch/inventory-item/sub-brand/archived-brand-sub"
                  className="a-link-none"
                >
                  <RiDeviceRecoverLine size="15" />
                </Link>
              </CButton>
              <CButton
                className="ml-1"
                color="info"
                shape="square"
                size="sm"
                onClick={() => setAddModal(true)}
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
      </div>
      <div className="card-body">
        <div className="list-information-to-show">
          <p>Filter By Brands:</p>
          <div className="css-b62m3t-containerx">
            <Select
              value={filterByBrand}
              options={[{ value: null, label: "All Brands" }, ...options]}
              onChange={(e) => handleFilterByBrand(e)}
              cacheOptions
              placeholder={"All Brands"}
            />
          </div>
        </div>
        <CDataTable
          items={optionsPresented ? optionsPresented : [...subcategory]}
          fields={BrandSubFields}
          columnFilter={false}
          tableFilter={{ placeholder: "search information..." }}
          footer={false}
          itemsPerPageSelect={true}
          itemsPerPage={5}
          hover
          sorter
          pagination
          loading={false}
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
            subcategory: (item, index) => (
              <td className="brandnametable">
                <OverlayTrigger
                  key={"bottom"}
                  placement={"top"}
                  overlay={
                    <Tooltip id={`tooltip-bottom`}>
                      View Data Of {item.subcategory}
                    </Tooltip>
                  }
                >
                  <Link
                    to={`/branch/inventory-item/sub-brand/${item._id}`}
                    className="a-link-none"
                  >
                    {item.subcategory}
                  </Link>
                </OverlayTrigger>
              </td>
            ),
            BrandOf: (item) => (
              <td className="largeText">
                <p> {item.BrandOf}</p>
              </td>
            ),
            Date: (item, index) => (
              <td className="text-center">
                <div> {item.Date}</div>
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
              </td>
            ),
            action: (item, index) => (
              <td>
                <div className="d-flex justify-content-center">
                  <CButton
                    color="danger"
                    shape="square"
                    size="sm"
                    variant="outline"
                    onClick={() => handleArchived(item)}
                    disabled={deleteLoading}
                  >
                    {deleteBrandSub ? (
                      item._id === deleteBrandSub._id ? (
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
        show={updateModal}
        onHide={() => setUpdateModal(false)}
        backdrop="static"
        dialogClassName="modal-cover-screen"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {" "}
            <h1 className="header-card-information">
              <span>Update Brand Subcategory</span>
            </h1>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-container">
          <UpdateSubcategory
            updateImages={updateImages}
            setUpdateImages={setUpdateImages}
            addingUpdateImages={addingUpdateImages}
            setAddingUpdateImages={setAddingUpdateImages}
            handleRemoveImages={handleRemoveImages}
            updateEditorState={updateEditorState}
            setUpdateEditorState={setUpdateEditorState}
            updateSubBrand={updateSubBrand}
            setUpdateSubBrand={setUpdateSubBrand}
            updateBrand={updateBrand}
            setUpdatebrand={setUpdatebrand}
            options={options}
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
            onClick={handleUpdate}
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

      {/* {adding Modal} */}
      <Modal
        show={addModal}
        onHide={() => setAddModal(false)}
        backdrop="static"
        dialogClassName="modal-cover-screen"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {" "}
            <h1 className="header-card-information">
              <span>Add Brand Subcategory</span>
            </h1>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-container">
          <CreateSubcategory
            images={images}
            setImages={setImages}
            editorState={editorState}
            setEditorState={setEditorState}
            options={options}
            brandname={brandname}
            setBrandName={setBrandName}
            subcategoryName={subcategoryName}
            setSubcategoryName={setSubcategoryName}
          />
        </Modal.Body>
        <Modal.Footer>
          <CButton
            color="secondary"
            variant="outline"
            shape="square"
            size="lg"
            onClick={() => setAddModal(false)}
            disabled={addingLoading}
          >
            Cancel
          </CButton>
          <CButton
            color="info"
            variant="outline"
            shape="square"
            size="lg"
            className="ml-1"
            onClick={handleSubmit}
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
    </div>
  );
};
export default SubBrand;
