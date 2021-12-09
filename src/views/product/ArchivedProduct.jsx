import React, { useState, useEffect } from "react";
import { ProductSubFields } from "src/reusable";
import { useSelector } from "react-redux";
import { CDataTable, CButton } from "@coreui/react";
import { Carousel } from "react-bootstrap";
import Loader from "react-loader-spinner";

import { RiDeviceRecoverLine } from "react-icons/ri";
import Select from "react-select";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import {
  changeProductStatus,
  getArchivedProduct,
} from "src/redux/action/product.action";
export const ArchivedProductDataInformation = (props) => {
  const dispatch = useDispatch();
  const [options, setOptions] = useState([]);
  const [optionsBrandPresented, setOptionBrandPresented] = useState(null);
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [deleteLoading, setDeletingLoading] = useState(false);
  const { brand } = useSelector((state) => state.brand);
  const { archives, loading } = useSelector((state) => state.product);
  useEffect(() => {
    dispatch(getArchivedProduct());
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    const bra = brand.map((data) => {
      const value = { brand: data.brand, _id: data._id };
      return { value: value, label: data.brand };
    });
    setOptions(bra);

    // eslint-disable-next-line
  }, [brand]);
  const handleFilterByBrand = (val) => {
    if (val.value) {
      const newFiltering = archives.filter(
        (datax) => datax.brandOf === val.value.brand
      );
      setOptionBrandPresented(newFiltering);
    } else {
      setOptionBrandPresented(null);
    }
  };
  const archivedProduct = (item) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to recovered this Product?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, recovered it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
      allowOutsideClick: false,
    }).then(async (result) => {
      setDeleteProduct(item);
      if (result.isConfirmed) {
        setDeletingLoading(true);
        const res = await dispatch(
          changeProductStatus({ _id: item._id, deleted: "no" })
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
        <h1 className="header-card-information">
          <span>Archived Product</span>
        </h1>
      </div>
      <div className="card-body">
        <div className="col-md-4">
          Filter by Brand:{" "}
          <Select
            options={[{ value: null, label: "All Brands" }, ...options]}
            cacheOptions
            placeholder={"Filter By Brands..."}
            onChange={(e) => handleFilterByBrand(e)}
          />
        </div>
        <CDataTable
          items={optionsBrandPresented ? optionsBrandPresented : archives}
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
            product: (item, index) => (
              <td className="brandnametable">
                <p> {item.product}</p>
              </td>
            ),
            action: (item, index) => (
              <td>
                <div className="d-flex justify-content-center">
                  <CButton
                    color="danger"
                    shape="square"
                    size="sm"
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
                          <RiDeviceRecoverLine size="20" />
                        )
                      ) : (
                        <RiDeviceRecoverLine size="20" />
                      )
                    ) : (
                      <RiDeviceRecoverLine size="20" />
                    )}
                  </CButton>
                </div>
              </td>
            ),
          }}
        />
      </div>
    </div>
  );
};
