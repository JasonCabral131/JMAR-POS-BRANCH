import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { getProductNotification } from "src/redux/action/product.action";
import { LoaderSpinner, toCapitalized } from "src/reusable";
import ImageGalleryShow from "src/reusable/ImageGalleryShow";

const ProductNotif = () => {
  const [images, setImages] = useState([]);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { productId } = useParams();
  const handleGetProduct = async () => {
    setProduct(null);
    setImages([]);
    setLoading(true);
    const res = await dispatch(getProductNotification({ productId }));
    setLoading(false);
    if (res.result) {
      setProduct(res.product);
      const element = document.querySelector("ol.breadcrumb > li.active");
      element.innerHTML = toCapitalized(`${res.product.product} Information `);
      const img = res.product.images.map((prod, index) => {
        if (index === 0) {
          return { url: prod.img, active: true };
        }
        return { url: prod.img, active: false };
      });
      setImages(img);
    }
  };
  useEffect(() => {
    handleGetProduct();
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    handleGetProduct();
    // eslint-disable-next-line
  }, [productId]);
  return loading ? (
    <LoaderSpinner height="400px" />
  ) : (
    <div className="w-100  card shadow">
      <div className="w-100 row">
        {images.length > 0 ? (
          <div className="col-md-6">
            <ImageGalleryShow images={images} setImages={setImages} />
          </div>
        ) : null}
        {product ? (
          <div className="mt-2 col-md-6 row">
            <div className="col-md-6 percent-container">
              <label className="label-name text-left d-block">Product</label>
              <input type="text" min="0" value={product.product} disabled />
            </div>
            <div className="col-md-6 percent-container">
              <label className="label-name text-left d-block">Price</label>
              <input type="text" min="0" value={product.price} disabled />
            </div>
            <div className="col-md-6 percent-container">
              <label className="label-name text-left d-block">
                Product Barcode Number
              </label>
              <input type="text" min="0" value={product.productId} disabled />
            </div>
            <div className="col-md-6 percent-container">
              <label className="label-name text-left d-block">Quantity</label>
              <input type="text" min="0" value={product.quantity} disabled />
            </div>
            <div className="col-md-12 percent-container">
              <label className="label-name text-left d-block">
                Description
              </label>
              <span
                dangerouslySetInnerHTML={{ __html: product.description }}
              ></span>
            </div>
          </div>
        ) : (
          <h1 className="mt-5 text-center text-danger">No Data Found</h1>
        )}
      </div>
    </div>
  );
};

export default ProductNotif;
