import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { archivedTaxInfo, getArchivedTaxInfo } from "src/redux/action";
import { CButton, CDataTable } from "@coreui/react";
import Loader from "react-loader-spinner";
import { IoTrash } from "react-icons/io5";
import { TaxFields } from "src/reusable";
const ArchivedTax = (props) => {
  const dispatch = useDispatch();
  const [deleteLoading, setDeletingLoading] = useState(false);
  const [deleteTax, setDeletingTax] = useState(null);
  const { archivedTax, request } = useSelector((state) => state.tax);
  useEffect(() => {
    dispatch(getArchivedTaxInfo());
    // eslint-disable-next-line
  }, []);
  const handleDelete = (item) => {
    Swal.fire({
      title: "Are you sure want to Recovered ?",
      text: `${item.tax}  ${
        item.tax.toLowerCase().includes("tax") ? "" : "Tax"
      } remitted data will  show`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Archived it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
      allowOutsideClick: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setDeletingLoading(true);
        setDeletingTax(item);
        const wait = await dispatch(
          archivedTaxInfo({ _id: item._id, active: true })
        );
        if (wait) {
          setDeletingLoading(false);
          setDeletingTax(null);
          return;
        }
        setDeletingLoading(false);
        setDeletingTax(null);
        return;
      }
    });
  };
  return (
    <div className="card p-1">
      <div className="card-header p-1">
        {" "}
        <h1 className="header-card-information">
          <span>Archived Goverment Tax</span>
        </h1>
      </div>
      <div className="card-body">
        <CDataTable
          items={[...archivedTax]}
          fields={TaxFields}
          columnFilter={false}
          tableFilter={{ placeholder: "search tax" }}
          footer={false}
          itemsPerPageSelect={false}
          itemsPerPage={5}
          hover
          sorter
          pagination
          loading={request}
          scopedSlots={{
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
                    {deleteTax ? (
                      item._id === deleteTax._id ? (
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
                </div>
              </td>
            ),
          }}
        />
      </div>
    </div>
  );
};
export default ArchivedTax;
