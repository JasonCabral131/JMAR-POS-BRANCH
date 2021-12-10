import React, { useState, useEffect } from "react";
import { CDataTable, CButton } from "@coreui/react";
import { Carousel } from "react-bootstrap";

import { BrandFields } from "src/reusable";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import {
  deleteBrandInfo,
  getDeleteBrandInfo,
} from "src/redux/action/brand.action";
import Loader from "react-loader-spinner";
import { RiDeviceRecoverLine } from "react-icons/ri";
const DeletedBrand = (props) => {
  const dispatch = useDispatch();
  const { deletedBrandItemHistory, loading } = useSelector(
    (state) => state.brand
  );
  const [deleteLoading, setDeletingLoading] = useState(false);
  const [deleteBrand, setDeleteBrand] = useState(null);
  const handleDelete = (item) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Recovered From Database",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Recovered it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
      allowOutsideClick: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setDeletingLoading(true);
        setDeleteBrand(item);
        const res = await dispatch(
          deleteBrandInfo({ _id: item._id, deleted: "no" })
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
    });
  };
  useEffect(() => {
    dispatch(getDeleteBrandInfo());
    // eslint-disable-next-line
  }, []);
  return (
    <div className="card shadow card-container">
      <div className="card-header  ">
        <div className="row">
          <div className="col-md-6">
            <h1 className="header-card-information">
              <span>Archived Brand</span>
            </h1>
          </div>
        </div>
        <div className="mt-2" />
      </div>
      <div className="card-body">
        <CDataTable
          items={[...deletedBrandItemHistory]}
          fields={BrandFields}
          columnFilter={false}
          tableFilter={{ placeholder: "search brand" }}
          footer={false}
          itemsPerPageSelect
          itemsPerPage={10}
          hover
          sorter
          pagination
          loading={loading}
          scopedSlots={{
            number: (item, index) => (
              <td>
                <p>{index + 1}</p>
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
                <p> {item.brand}</p>
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
              <td>
                <div className="d-flex justify-content-center">
                  <CButton
                    color="danger"
                    shape="square"
                    size="sm"
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
export default DeletedBrand;
