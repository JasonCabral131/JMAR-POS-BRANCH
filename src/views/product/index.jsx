import React, { useEffect, useState } from "react";
import { Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import { CButton, CCardBody, CCollapse, CDataTable } from "@coreui/react";
import { RiFileAddLine, RiDeviceRecoverLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Select from "react-select";
import { IoTrash, IoPencilOutline } from "react-icons/io5";
import { ImageGallery, ProductSubFields } from "src/reusable";
import CreateProduct from "./createProduct";
import UpdateProductInformation from "./updateProduct";
import { MdSubdirectoryArrowRight } from "react-icons/md";
import {
  changeProductStatus,
  getProductByBrandOwner,
} from "src/redux/action/product.action";
import { AiOutlineBarcode, AiOutlineDown, AiOutlineUp } from "react-icons/ai";
import { EditorState, ContentState } from "draft-js";
import htmlToDraft from "html-to-draftjs";
import CreateBarcode from "./createBarcode";
import Swal from "sweetalert2";
import Loader from "react-loader-spinner";
import ImageGalleryShow from "src/reusable/ImageGalleryShow";
import { Chart } from "react-google-charts";
import axiosInstance from "src/helpers/axios";
const initialSupplyState = {
  product: "",
  merchantdiser: "",
  distributor: "",
  originalPrice: 0,
  originalQuantity: 0,
  saleQuantity: 0,
  salesSupply: 0,
  expense: 0,
  productName: "",
};
const TheProduct = (props) => {
  const dispatch = useDispatch();
  const { products, loading, chartdata } = useSelector(
    (state) => state.product
  );
  const { brand } = useSelector((state) => state.brand);
  const [details, setDetails] = useState([]);
  const { subcategory } = useSelector((state) => state.subcategory);
  const [addModal, setAddModal] = useState(false);
  const [deleteLoading, setDeletingLoading] = useState(false);
  const [barcodeModal, setBarcodeModal] = useState(false);
  const [addingLoading, setAddingLoading] = useState(false);
  const [updateModal, setupdateModal] = useState(false);
  const [UpdatingLoading, setUpdatingLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [optionsBrandPresented, setOptionBrandPresented] = useState(null);
  const [updateImages, setUpdateImages] = useState([]);
  const [addingUpdateImages, setAddingUpdateImages] = useState([]);
  const [updateEditorState, setUpdateEditorState] = useState(null);
  const [updateSubBrand, setUpdateSubBrand] = useState(null);
  const [updateBrand, setUpdateBrand] = useState(null);
  const [updateProduct, setUpdateProduct] = useState(null);
  const [selectedSub, setSelectSub] = useState([]);
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [cData, setCData] = useState({ search: false, data: [] });
  const [supplyModal, setSupplyModal] = useState(false);
  const [supplierInfo, setSupplyInfo] = useState(initialSupplyState);
  const [credentialImage, setCredentialImage] = useState([]);
  const [reviewModal, setReviewModal] = useState(false);
  const [supplyLoading, setSupplyLoading] = useState(false);
  const [viewCredentials, setViewCredentials] = useState([]);
  const [credentialModal, setCredentialModal] = useState(false);
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
  useEffect(() => {
    const html = `<span></span>`;
    const contentBlock = htmlToDraft(html);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );
      const editorState = EditorState.createWithContent(contentState);
      setUpdateEditorState(editorState);
    }
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    const bra = brand.map((data) => {
      const value = { brand: data.brand, _id: data._id };
      return { value: value, label: data.brand };
    });
    setOptions(bra);
    // eslint-disable-next-line
  }, [brand, subcategory]);
  const handleFilterByBrand = (val) => {
    if (val.value) {
      const newFiltering = products.filter(
        (datax) => datax.brandOf === val.value.brand
      );
      let chartx = [["Product", "Sale"]];
      const cdt = chartdata
        .filter((xx) => xx.brand === val.value.brand)
        .map((mp) => {
          return [mp.product, mp.amount];
        });
      if (cdt.length > 0) {
        setCData({ search: true, data: [...chartx, ...cdt] });
      } else {
        setCData({ search: true, data: [...chartx] });
      }
      setOptionBrandPresented(newFiltering);
    } else {
      setOptionBrandPresented(null);
      setCData({ search: false, data: [] });
    }
  };
  const handleEdit = (item) => {
    setupdateModal(true);
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
    console.log(item);
    const subx = item.brandSubcategory;
    const brandx = item.brandSubcategory.brand;
    setUpdateSubBrand({
      value: { sub: subx.subcategory, _id: subx._id },
      label: `${subx.subcategory}`,
    });
    setUpdateBrand({
      value: { brand: brandx.brand, _id: brandx._id },
      label: `${brandx.brand}`,
    });

    setUpdateProduct(item);
    const subFilter = subcategory
      .filter((data) => data.brand._id === brandx._id)
      .map((data) => {
        return {
          value: { sub: data.subcategory, _id: data._id },
          label: data.subcategory,
        };
      });
    setSelectSub(subFilter);
  };
  const archivedProduct = (item) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to Archived this Product?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Archived it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
      allowOutsideClick: false,
    }).then(async (result) => {
      setDeleteProduct(item);
      if (result.isConfirmed) {
        setDeletingLoading(true);
        const res = await dispatch(
          changeProductStatus({ _id: item._id, deleted: "yes" })
        );
        if (res.result) {
          Swal.fire({
            icon: "success",
            text: "Successfully deleted",
            timer: 2000,
            allowOutsideClick: false,
          });
          setDeletingLoading(false);
          setDeleteProduct(null);
          return;
        }
        Swal.fire({
          icon: "warning",
          text: res.message,
          timer: 2000,
          allowOutsideClick: false,
        });
        setDeletingLoading(false);
        setDeleteProduct(null);
        return;
      }
      setDeletingLoading(false);
    });
  };
  const getChartData = () => {
    let chartx = [["Product", "Sale"]];
    chartdata.forEach((cx) => {
      chartx.push([cx.product, cx.amount]);
    });
    return chartx;
  };
  const handleReviewData = () => {
    if (!supplierInfo.merchantdiser) {
      Swal.fire({
        icon: "warning",
        text: "Merchant Dise Required",
      });
      return;
    }
    if (!supplierInfo.distributor) {
      Swal.fire({
        icon: "warning",
        text: "Distributor Required",
      });
      return;
    }
    if (supplierInfo.originalPrice < 1) {
      Swal.fire({
        icon: "warning",
        text: "Original Price  Required",
      });
      return;
    }
    if (supplierInfo.originalQuantity < 1) {
      Swal.fire({
        icon: "warning",
        text: "Original Quantity  Required",
      });
      return;
    }
    if (
      supplierInfo.expense <
      parseFloat(supplierInfo.originalQuantity * supplierInfo.originalPrice)
    ) {
      Swal.fire({
        icon: "warning",
        text: "Double the Check Expenses",
      });
      return;
    }
    if (credentialImage.length < 0) {
      Swal.fire({
        icon: "warning",
        text: "Credential Required",
      });
      return;
    }
    setReviewModal(true);
    setSupplyModal(false);
    setCredentialImage((prev) => {
      return prev.map((data) => {
        return { ...data, url: data.dataUrl };
      });
    });
  };
  const handleSaveSupply = async () => {
    const form = new FormData();
    form.append("product", supplierInfo.product);
    form.append("merchantdiser", supplierInfo.merchantdiser);
    form.append("distributor", supplierInfo.distributor);
    form.append("originalPrice", supplierInfo.originalPrice);
    form.append("originalQuantity", supplierInfo.originalQuantity);
    form.append("expense", supplierInfo.expense);

    for (let file of credentialImage) {
      form.append("credentials", file.file);
    }
    Swal.fire({
      title: "Are you sure?",
      text: "You Wont revert this action",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, proceed it",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
      allowOutsideClick: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setSupplyLoading(true);
          const res = await axiosInstance.post(
            "/create-new-supply-product",
            form
          );

          if (res.status === 200) {
            setSupplyLoading(false);
            setReviewModal(false);
            setSupplyInfo(initialSupplyState);
            dispatch(getProductByBrandOwner());
          } else if (res.status === 203) {
            setSupplyLoading(false);
            Swal.fire({
              title: "Are you sure?",
              text: res.data.msg,
              icon: "warning",
              showCancelButton: true,
              confirmButtonText: "Yes, proceed it",
              cancelButtonText: "No, cancel!",
              reverseButtons: true,
              allowOutsideClick: false,
            }).then(async (result) => {
              if (result.isConfirmed) {
                try {
                  setSupplyLoading(true);
                  const overRide = await axiosInstance.post(
                    "/override-new-supply-product",
                    form
                  );
                  if (overRide.status === 200) {
                    Swal.fire({
                      icon: "success",
                      text: "New Supply Has been Added",
                    });
                    setSupplyLoading(false);
                    setReviewModal(false);
                    setSupplyInfo(initialSupplyState);
                    dispatch(getProductByBrandOwner());
                    return;
                  }
                  Swal.fire({
                    icon: "warning",
                    text: "Failed to Add New Supply",
                  });
                  setSupplyLoading(false);
                } catch (e) {
                  Swal.fire({
                    icon: "warning",
                    text: "Failed to Add New Supply",
                  });
                  setSupplyLoading(false);
                }
              } else {
                setReviewModal(false);
                setSupplyInfo(initialSupplyState);
              }
            });
          } else {
            Swal.fire({
              icon: "warning",
              text: "Failed to Add New Supplu",
            });
            setSupplyLoading(false);
          }
        } catch (e) {
          Swal.fire({
            icon: "warning",
            text: "Failed to Add New Supply",
          });
          setSupplyLoading(false);
        }
      }
    });
  };
  return (
    <div className="card">
      <div className="card-header  ">
        <div className="row">
          <div className="col-md-3">
            <h1 className="header-card-information">
              <span>Product</span>
            </h1>
          </div>
          <div className="col-md-9 w-100  d-flex justify-content-end">
            <div className="mt-auto">
              <CButton
                color="success"
                variant="outline"
                shape="square"
                size="sm"
                onClick={() => setBarcodeModal(true)}
              >
                <AiOutlineBarcode size="15" className="text-dark" />
              </CButton>
              <CButton
                className="ml-1"
                color="danger"
                variant="outline"
                shape="square"
                size="sm"
              >
                <Link
                  to="/branch/inventory-item/product/archived-product"
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
        <div className="col-md-4 ">
          Filter by Brand:{" "}
          <Select
            options={[{ value: null, label: "All Brands" }, ...options]}
            cacheOptions
            placeholder={"Filter By Brands..."}
            onChange={(e) => handleFilterByBrand(e)}
            menuPortalTarget={document.body}
          />
        </div>
        <br />
        {getChartData().length > 1 ? (
          <Chart
            width="100%"
            height="400px"
            chartType="Bar"
            data={cData.search ? cData.data : getChartData()}
            legendToggle
            options={{
              // Material design options
              chart: {
                title: `Product  Sale Performance`,
              },
              vAxis: {
                title: `Product`,
              },
              series: {
                0: { curveType: "function" },
              },
            }}
          />
        ) : null}
        <br />
        <CDataTable
          items={optionsBrandPresented ? optionsBrandPresented : products}
          fields={ProductSubFields}
          columnFilter={false}
          tableFilterValue={null}
          tableFilter={{ placeholder: "search information..." }}
          footer={false}
          itemsPerPageSelect={false}
          itemsPerPage={5}
          hover
          sorter
          pagination
          loading={loading}
          scopedSlots={{
            product: (item, index) => (
              <td className="brandnametable">
                <OverlayTrigger
                  key={"bottom"}
                  placement={"top"}
                  overlay={
                    <Tooltip id={`tooltip-bottom`}>
                      View Data Of {item.product}
                    </Tooltip>
                  }
                >
                  <Link
                    to={`/branch/inventory-item/product/${item._id}`}
                    className="a-link-none"
                  >
                    {item.product}
                  </Link>
                </OverlayTrigger>
              </td>
            ),
            price: (item) => (
              <td>₱ {new Intl.NumberFormat().format(item.price)}</td>
            ),
            quantity: (item) => (
              <td>{new Intl.NumberFormat().format(item.quantity)}</td>
            ),
            brandOf: (item) => (
              <td>
                <label className="d-block text-center text-bold fs-6 font-weight-bold">
                  {item.brandOf}
                </label>
                <label className="d-block text-center">
                  <MdSubdirectoryArrowRight /> {item.subcategoryOf}
                </label>
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
                    onClick={() => archivedProduct(item)}
                    disabled={deleteLoading}
                  >
                    {deleteProduct ? (
                      item._id === deleteProduct._id ? (
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
                <br />
                <div className="d-flex justify-content-center">
                  {details.includes(item._id) ? (
                    <div className="w-100">
                      <AiOutlineDown
                        onClick={() => {
                          toggleDetails(item._id);
                        }}
                        className="hover mt-1 ml-4"
                      />
                      <span className="ml-2 mt-1">Supply</span>
                    </div>
                  ) : (
                    <div className="w-100">
                      <AiOutlineUp
                        onClick={() => {
                          toggleDetails(item._id);
                        }}
                        className="hover mt-1 ml-4"
                      />
                      <span className="ml-2 mt-1">Supply</span>
                    </div>
                  )}
                </div>
              </td>
            ),
            details: (item, findex) => {
              return (
                <CCollapse show={details.includes(item._id)}>
                  <CCardBody className={"p-2"}>
                    <div className="w-100 card p-2">
                      <div className="card-header  ">
                        <div className="row">
                          <div className="col-md-3">
                            <h1 className="header-card-information">
                              <span>{item.product} Supply</span>
                            </h1>
                          </div>
                          <div className="col-md-9 w-100  d-flex justify-content-end">
                            <div className="mt-auto">
                              <CButton
                                className="ml-1"
                                color="success"
                                shape="square"
                                size="sm"
                                onClick={() => {
                                  setSupplyInfo((prev) => {
                                    return {
                                      ...prev,
                                      productName: item.product,
                                      product: item._id,
                                    };
                                  });
                                  setSupplyModal(true);
                                  setCredentialImage([]);
                                }}
                                disabled={addingLoading}
                              >
                                <RiFileAddLine size="15" /> Supply
                              </CButton>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="card-body">
                        <CDataTable
                          items={item.supply}
                          fields={supplierField}
                          columnFilter={false}
                          tableFilterValue={null}
                          tableFilter={{ placeholder: "search supply..." }}
                          footer={false}
                          itemsPerPageSelect={false}
                          itemsPerPage={5}
                          hover
                          sorter
                          pagination
                          scopedSlots={{
                            merchantdiser: (supply, index) => (
                              <td
                                className="brandnametable"
                                onClick={(e) => {
                                  setViewCredentials(
                                    supply.credential?.map((data, index) => {
                                      if (index === 0) {
                                        return { url: data.url, active: true };
                                      }
                                      return { url: data.url, active: false };
                                    })
                                  );
                                  setCredentialModal(true);
                                }}
                              >
                                {supply.merchantdiser}
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
      </div>
      <CreateProduct
        addModal={addModal}
        setAddModal={setAddModal}
        addingLoading={addingLoading}
        setAddingLoading={setAddingLoading}
        subcategory={subcategory}
        brand={options}
      />
      <UpdateProductInformation
        subcategory={subcategory}
        brand={options}
        updateModal={updateModal}
        setupdateModal={setupdateModal}
        UpdatingLoading={UpdatingLoading}
        setUpdatingLoading={setUpdatingLoading}
        updateImages={updateImages}
        setUpdateImages={setUpdateImages}
        addingUpdateImages={addingUpdateImages}
        setAddingUpdateImages={setAddingUpdateImages}
        updateEditorState={updateEditorState}
        setUpdateEditorState={setUpdateEditorState}
        updateSubBrand={updateSubBrand}
        setUpdateSubBrand={setUpdateSubBrand}
        updateBrand={updateBrand}
        setUpdateBrand={setUpdateBrand}
        updateProduct={updateProduct}
        setUpdateProduct={setUpdateProduct}
        selectedSub={selectedSub}
        setSelectSub={setSelectSub}
      />
      <CreateBarcode
        barcodeModal={barcodeModal}
        setBarcodeModal={setBarcodeModal}
      />
      <Modal
        show={supplyModal}
        onHide={() => setSupplyModal(false)}
        size="lg"
        backdrop="static"
      >
        <Modal.Header>
          <h1 className="header-card-information">
            <span>{supplierInfo.productName} Supply</span>
          </h1>
        </Modal.Header>
        <Modal.Body>
          <div className="w-100 row">
            <div className="col-md-6">
              <div className="form-group">
                <label className="label-name">Marchant Dise</label>
                <input
                  value={supplierInfo.merchantdiser}
                  onChange={(e) =>
                    setSupplyInfo((prev) => {
                      return { ...prev, merchantdiser: e.target.value };
                    })
                  }
                  type="text"
                  className="inputvalue"
                  placeholder="Marchant Dise Information"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label className="label-name">Distributer FullName</label>
                <input
                  value={supplierInfo.distributor}
                  onChange={(e) =>
                    setSupplyInfo((prev) => {
                      return { ...prev, distributor: e.target.value };
                    })
                  }
                  type="text"
                  className="inputvalue"
                  placeholder="distributor full name"
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label className="label-name">Original Price</label>
                <input
                  value={supplierInfo.originalPrice}
                  onChange={(e) =>
                    setSupplyInfo((prev) => {
                      return { ...prev, originalPrice: e.target.value };
                    })
                  }
                  onKeyPress={(e) => {
                    const theEvent = e || window.event;
                    if (e.target.value.length === 0 && e.which === 48) {
                      theEvent.preventDefault();
                    }
                  }}
                  type="number"
                  className="inputvalue"
                  placeholder="original price"
                  onBlur={(e) => {
                    if (e.target.value === "" || e.target.value < 0) {
                      setSupplyInfo((prev) => {
                        return { ...prev, originalPrice: 1 };
                      });
                    }
                  }}
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label className="label-name">Supply Quantity</label>
                <input
                  type="number"
                  value={supplierInfo.originalQuantity}
                  onChange={(e) =>
                    setSupplyInfo((prev) => {
                      return { ...prev, originalQuantity: e.target.value };
                    })
                  }
                  className=" inputvalue"
                  min="1"
                  onBlur={(e) => {
                    if (e.target.value === "" || e.target.value < 0) {
                      setSupplyInfo((prev) => {
                        return { ...prev, originalQuantity: 1 };
                      });
                    }
                  }}
                  max="50000"
                  placeholder="Input product name"
                  onKeyPress={(e) => {
                    const theEvent = e || window.event;
                    if (e.target.value.length === 0 && e.which === 48) {
                      theEvent.preventDefault();
                    }
                  }}
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label className="label-name">
                  Expense (initial Exp:{" "}
                  {parseFloat(
                    supplierInfo.originalPrice * supplierInfo.originalQuantity
                  )}{" "}
                  )
                </label>
                <input
                  type="number"
                  value={supplierInfo.expense}
                  onChange={(e) =>
                    setSupplyInfo((prev) => {
                      return { ...prev, expense: e.target.value };
                    })
                  }
                  className=" inputvalue"
                  min="1"
                  max="50000"
                  placeholder="0.00"
                  onKeyPress={(e) => {
                    const theEvent = e || window.event;
                    if (e.target.value.length === 0 && e.which === 48) {
                      theEvent.preventDefault();
                    }
                  }}
                />
              </div>
            </div>
            <div className="col-md-12">
              <div className="form-group">
                <label className="label-name">
                  Credential <span className="ml-2 text-danger">Required</span>{" "}
                  (receipt, payslip etc.)
                </label>
                <ImageGallery
                  images={credentialImage}
                  setImages={setCredentialImage}
                />
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="button-customer button-cancel"
            onClick={() => {
              setSupplyModal(false);
              setSupplyInfo(initialSupplyState);
              setCredentialImage([]);
            }}
          >
            Cancel
          </button>
          <button
            className="button-customer button-save"
            onClick={handleReviewData}
          >
            Review
          </button>
        </Modal.Footer>
      </Modal>
      <Modal
        size={"lg"}
        show={reviewModal}
        onHide={() => setReviewModal(false)}
        backdrop="static"
      >
        <Modal.Body>
          <div className="w-100 row">
            <div className="col-md-6">
              <div className="form-group">
                <label className="label-name">Marchant Dise</label>
                <input
                  value={supplierInfo.merchantdiser}
                  onChange={(e) =>
                    setSupplyInfo((prev) => {
                      return { ...prev, merchantdiser: e.target.value };
                    })
                  }
                  type="text"
                  className="inputvalue"
                  placeholder="Marchant Dise Information"
                  disabled
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label className="label-name">Distributer FullName</label>
                <input
                  value={supplierInfo.distributor}
                  onChange={(e) =>
                    setSupplyInfo((prev) => {
                      return { ...prev, distributor: e.target.value };
                    })
                  }
                  type="text"
                  className="inputvalue"
                  placeholder="distributor full name"
                  disabled
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label className="label-name">Original Price</label>
                <input
                  value={supplierInfo.originalPrice}
                  onChange={(e) =>
                    setSupplyInfo((prev) => {
                      return { ...prev, originalPrice: e.target.value };
                    })
                  }
                  onKeyPress={(e) => {
                    const theEvent = e || window.event;
                    if (e.target.value.length === 0 && e.which === 48) {
                      theEvent.preventDefault();
                    }
                  }}
                  type="number"
                  className="inputvalue"
                  placeholder="original price"
                  onBlur={(e) => {
                    if (e.target.value === "" || e.target.value < 0) {
                      setSupplyInfo((prev) => {
                        return { ...prev, originalPrice: 1 };
                      });
                    }
                  }}
                  disabled
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label className="label-name">Supply Quantity</label>
                <input
                  type="number"
                  value={supplierInfo.originalQuantity}
                  onChange={(e) =>
                    setSupplyInfo((prev) => {
                      return { ...prev, originalQuantity: e.target.value };
                    })
                  }
                  className=" inputvalue"
                  min="1"
                  onBlur={(e) => {
                    if (e.target.value === "" || e.target.value < 0) {
                      setSupplyInfo((prev) => {
                        return { ...prev, originalQuantity: 1 };
                      });
                    }
                  }}
                  max="50000"
                  placeholder="Input product name"
                  onKeyPress={(e) => {
                    const theEvent = e || window.event;
                    if (e.target.value.length === 0 && e.which === 48) {
                      theEvent.preventDefault();
                    }
                  }}
                  disabled
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label className="label-name">
                  Expense (initial Exp:{" "}
                  {parseFloat(
                    supplierInfo.originalPrice * supplierInfo.originalQuantity
                  )}{" "}
                  )
                </label>
                <input
                  type="number"
                  value={supplierInfo.expense}
                  onChange={(e) =>
                    setSupplyInfo((prev) => {
                      return { ...prev, expense: e.target.value };
                    })
                  }
                  className=" inputvalue"
                  min="1"
                  max="50000"
                  placeholder="0.00"
                  onKeyPress={(e) => {
                    const theEvent = e || window.event;
                    if (e.target.value.length === 0 && e.which === 48) {
                      theEvent.preventDefault();
                    }
                  }}
                  disabled
                />
              </div>
            </div>
            <div className="col-md-12">
              <div className="form-group">
                <label className="label-name">
                  Credential <span className="ml-2 text-danger">Required</span>{" "}
                  (receipt, payslip etc.)
                </label>
                <ImageGalleryShow
                  images={credentialImage}
                  setImages={setCredentialImage}
                />
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="button-customer button-cancel"
            onClick={() => {
              setSupplyModal(true);
              setReviewModal(false);
            }}
            disabled={supplyLoading}
          >
            Cancel
          </button>
          <button
            className="button-customer button-save"
            onClick={handleSaveSupply}
          >
            {supplyLoading ? (
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
          </button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={credentialModal}
        onHide={() => setCredentialModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <h1 className="header-card-information">
            <span>Credentials</span>
          </h1>
        </Modal.Header>
        <Modal.Body>
          <div className="w-100">
            <ImageGalleryShow
              images={viewCredentials}
              setImages={setViewCredentials}
            />
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};
export default TheProduct;
const supplierField = [
  { key: "merchantdiser", label: "Marchant Diser" },
  { key: "distributor", label: "Distributor" },
  { key: "originalPrice", label: "Original Price" },
  { key: "originalQuantity", label: "Quantity" },
  { key: "expense", label: "Expense" },
  { key: "createdAt", label: "Date" },
];
