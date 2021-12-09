import React, { useEffect, useState } from "react";

import {
  ArchivedSubcategoryStatus,
  getArchivedSubcategoryInfo,
} from "src/redux/action/subcategory.action";
import { CDataTable, CButton } from "@coreui/react";
import { Carousel } from "react-bootstrap";

import { BrandSubFields } from "src/reusable";
import { useDispatch, useSelector } from "react-redux";
import { RiDeviceRecoverLine } from "react-icons/ri";
import Swal from "sweetalert2";
import Loader from "react-loader-spinner";
const ArchivedSubcategory = (props) => {
  const { archived } = useSelector((state) => state.subcategory);
  const dispatch = useDispatch();
  const [deleteLoading, setDeletingLoading] = useState(false);
  const [deleteBrandSub, setDeleteBrandSub] = useState(null);
  useEffect(() => {
    dispatch(getArchivedSubcategoryInfo());
    // eslint-disable-next-line
  }, []);
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
        setDeleteBrandSub(item);
        const res = await dispatch(
          ArchivedSubcategoryStatus({ _id: item._id, deleted: "no" })
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
  return (
    <div className="card p-1 card-containerx">
      <div className="card-header">
        <h1 className="header-card-information">
          <span>Archived Brand Subcategory</span>
        </h1>
      </div>
      <div className="card-body  ">
        <CDataTable
          items={archived}
          fields={BrandSubFields}
          columnFilter={false}
          tableFilter={{ placeholder: "search information..." }}
          footer={false}
          itemsPerPageSelect={false}
          itemsPerPage={5}
          hover
          sorter
          pagination
          loading={false}
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
                    onClick={() => handleDelete(item)}
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
export default ArchivedSubcategory;
