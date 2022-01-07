import React, { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { CButton, CDataTable } from "@coreui/react";
import { RiFileAddLine, RiDeviceRecoverLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Select from "react-select";
import { IoTrash, IoPencilOutline } from "react-icons/io5";
import { ProductSubFields } from "src/reusable";
import CreateProduct from "./createProduct";
import UpdateProductInformation from "./updateProduct";
import { MdSubdirectoryArrowRight } from "react-icons/md";
import {
  changeProductStatus,
  getProductByBrandOwner,
} from "src/redux/action/product.action";
import { AiOutlineBarcode } from "react-icons/ai";
import { EditorState, ContentState } from "draft-js";
import htmlToDraft from "html-to-draftjs";
import CreateBarcode from "./createBarcode";
import Swal from "sweetalert2";
import Loader from "react-loader-spinner";
const TheProduct = (props) => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.product);
  const { brand } = useSelector((state) => state.brand);
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
    dispatch(getProductByBrandOwner());
    // eslint-disable-next-line
  }, [brand, subcategory]);
  const handleFilterByBrand = (val) => {
    if (val.value) {
      const newFiltering = products.filter(
        (datax) => datax.brandOf === val.value.brand
      );
      setOptionBrandPresented(newFiltering);
    } else {
      setOptionBrandPresented(null);
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
              </td>
            ),
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
    </div>
  );
};
export default TheProduct;
