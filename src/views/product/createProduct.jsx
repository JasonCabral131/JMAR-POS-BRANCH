import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { CButton } from "@coreui/react";
import { ImageGallery } from "src/reusable";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import Select from "react-select";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import {
  createProductInfo,
  getProductByBrandOwner,
} from "src/redux/action/product.action";
import { DraftJsToolBar } from "src/reusable/EditorStateComponent";
const CreateProduct = ({
  addModal,
  setAddModal,
  addingLoading,
  setAddingLoading,
  subcategory,
  brand,
}) => {
  const dispatch = useDispatch();
  const [images, setImages] = useState([]);
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [productId, setProductId] = useState("");
  const [editorState, setEditorState] = useState(null);
  const [selectSubcategory, setSelectSubcategory] = useState([]);
  const [selectBrand, setSelectBrand] = useState(null);
  const [subcatSelect, setSubcatSelect] = useState(null);
  const handleReset = () => {
    const html = "<span></span>";
    const contentBlock = htmlToDraft(html);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );
      const editorState = EditorState.createWithContent(contentState);
      setEditorState(editorState);
    }
    setSubcatSelect(null);
    setSelectBrand(null);
    setSelectSubcategory([]);
    setProductId("");
    setPrice("");
    setQuantity("");
    setProduct("");
    setImages([]);
  };
  useEffect(() => {
    handleReset();
  }, []);
  const handleSubmit = async () => {
    setAddingLoading(true);
    const description = editorState
      ? draftToHtml(convertToRaw(editorState.getCurrentContent()))
      : "<span></span>";
    if (product === "") {
      Swal.fire({
        icon: "warning",
        text: "Product Name Required!",
        timer: 3000,
      });
      setAddingLoading(false);
      return;
    }
    if (price === "" || parseFloat(price) < 1) {
      Swal.fire({
        icon: "warning",
        text: "Price Required!",
        timer: 3000,
      });
      setAddingLoading(false);
      return;
    }
    if (quantity === "" || parseFloat(quantity) < 10) {
      Swal.fire({
        icon: "warning",
        text: "Quantity Required!",
        timer: 3000,
      });
      setAddingLoading(false);
      return;
    }
    if (productId === "") {
      Swal.fire({
        icon: "warning",
        text: "Product Barcode Id Required!",
        timer: 3000,
      });
      setAddingLoading(false);
      return;
    }
    if (!selectBrand) {
      Swal.fire({
        icon: "warning",
        text: "Select Brand",
        timer: 3000,
      });
      setAddingLoading(false);
      return;
    }
    if (!subcatSelect) {
      Swal.fire({
        icon: "warning",
        text: `${selectBrand.value.brand} Subcategory is required`,
        timer: 3000,
      });
      setAddingLoading(false);
      return;
    }
    if (images.length < 1) {
      Swal.fire({
        icon: "warning",
        text: `Image  required atleast 1`,
        timer: 3000,
      });
      setAddingLoading(false);
      return;
    }
    const data = new FormData();
    data.append("description", description);
    data.append("product", product);
    data.append("price", price);
    data.append("quantity", quantity);
    data.append("productId", productId);
    data.append("brandsubcat", subcatSelect.value._id);
    for (let file of images) {
      data.append("images", file.file);
    }

    const res = await dispatch(createProductInfo(data));

    if (res.result) {
      Swal.fire({
        icon: "success",
        text: "Successfully Created!",
        timer: 3000,
      });
      dispatch(getProductByBrandOwner());
      handleReset();
      setAddingLoading(false);
      return;
    }
    Swal.fire({
      icon: "warning",
      text: res.message,
      timer: 3000,
    });
    setAddingLoading(false);
    return;
  };

  const handleBrandOnChange = (val) => {
    setSelectSubcategory(null);
    setSubcatSelect(null);
    setSelectBrand(val);
    const { _id } = val.value;
    const subcategoryList = subcategory
      .filter((data) => data.brand._id === _id)
      .map((data) => {
        return {
          value: { subcat: data.subcategory, _id: data._id },
          label: data.subcategory,
        };
      });
    setSelectSubcategory(subcategoryList);
  };
  return (
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
            <span>Create Product</span>
          </h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body-container">
        <div className="brand-modal-container">
          <div className="row">
            <div className="col-md-5 d-flex justify-content-center">
              <ImageGallery images={images} setImages={setImages} />
            </div>
            <div className="col-md-7 mt-2">
              <form>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="label-name">Select Brand</label>
                      <Select
                        value={selectBrand}
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
                        Select Brand Subcategory
                      </label>
                      <Select
                        value={subcatSelect}
                        options={[...selectSubcategory]}
                        cacheOptions
                        placeholder={`Select  ${
                          selectBrand ? selectBrand.value.brand : "Brand"
                        } subcategory`}
                        onChange={(e) => setSubcatSelect(e)}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="label-name">Product Name</label>
                      <input
                        value={product}
                        onChange={(e) => setProduct(e.target.value)}
                        type="text"
                        className="form-control inputvalue"
                        placeholder="Input product name"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="label-name">Product Quantity</label>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="form-control inputvalue"
                        min="1"
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
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="label-name">Product Price</label>
                      <input
                        type="number"
                        min="1"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="form-control inputvalue"
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
                      <label className="label-name">
                        Product Barcode Number
                      </label>
                      <input
                        type="number"
                        value={productId}
                        onChange={(e) => setProductId(e.target.value)}
                        className="form-control inputvalue"
                        placeholder="product barcode number"
                      />
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label className="label-name">Product Description</label>
                  <div className="text-area-description">
                    <Editor
                      editorState={editorState}
                      onEditorStateChange={(content) => setEditorState(content)}
                      toolbar={DraftJsToolBar}
                    />
                  </div>
                </div>
              </form>
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
          disabled={addingLoading}
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
  );
};
export default CreateProduct;
