import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import Carousel, {
  Modal as ReactImagesModal,
  ModalGateway,
} from "react-images";
import { AiOutlineQrcode } from "react-icons/ai";
import {
  calculateAge,
  imagesObject,
  LoaderSpinner,
  ProfileIdContainer,
  toCapitalized,
} from "src/reusable";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import {
  addExistingCustomerToBranch,
  searchExistingCustomer,
} from "src/redux/action";
import { CButton } from "@coreui/react";
import zipcodes from "zipcodes-ph";

const ExistingAccount = ({
  existingAccountModal,
  setExistingAccountModal,
  ExistingAccountData,
  setExistAccountData,
}) => {
  const dispatch = useDispatch();
  const { socket } = useSelector((state) => state.socket);
  const [customerId, setCustomerId] = useState("");

  const [searchingLoading, setSearchingLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [images, setImages] = useState(imagesObject);

  useEffect(() => {
    if (socket) {
      socket.on(
        "receiving-to-scanned-customer-qr-code",
        async ({ customer }) => {
          if (customer) {
            setImages({
              profile: {
                file: null,
                dataUrl: customer.profile.url,
                active: true,
              },
              FrontId: {
                file: null,
                dataUrl: customer.frontId.url,
                active: false,
              },
              BackId: {
                file: null,
                dataUrl: customer.backId.url,
                active: false,
              },
              Resume: {
                file: null,
                dataUrl: null,
                active: false,
              },
            });
            setSearchingLoading(false);
            setExistAccountData(customer);
          }
        }
      );
    }
    // eslint-disable-next-line
  }, [socket]);
  const handleSearchingAccount = async () => {
    const checkFormat = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i;
    if (customerId.length !== 0) {
      if (checkFormat.test(customerId)) {
        if (Buffer.byteLength(customerId, "utf8") !== 24) {
          Swal.fire({
            icon: "warning",
            text: "Invalid Customer Id",
          });
          return;
        }

        setSearchingLoading(true);
        const res = await dispatch(searchExistingCustomer({ customerId }));
        if (res.result) {
          setImages({
            profile: {
              file: null,
              dataUrl: res.data.profile.url,
              active: true,
            },
            FrontId: {
              file: null,
              dataUrl: res.data.frontId.url,
              active: false,
            },
            BackId: {
              file: null,
              dataUrl: res.data.backId.url,
              active: false,
            },
            Resume: {
              file: null,
              dataUrl: null,
              active: false,
            },
          });
          setCustomerId("");
          setExistAccountData(res.data);
          setSearchingLoading(false);
          return;
        }
        setSearchingLoading(false);
      } else {
        Swal.fire({
          icon: "warning",
          text: "Invalid Customer Id",
        });
      }
      return;
    }
    Swal.fire({
      icon: "warning",
      text: "Customer ID required",
    });
  };

  const closeLightbox = () => {
    setCurrentImage(0);
    setIsViewerOpen(false);
  };
  const handleSaveBranchCustomer = () => {
    const { _id, email } = ExistingAccountData;
    Swal.fire({
      title: "Are you sure?",
      text: "Check The Review information",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, proceed it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
      allowOutsideClick: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await dispatch(
          addExistingCustomerToBranch({ customerId: _id, email })
        );
        if (res) {
          setCustomerId("");
          setExistAccountData(null);
          setExistingAccountModal(false);
          return;
        }
      }
    });
  };
  return (
    <>
      <Modal
        show={existingAccountModal}
        onHide={() => {
          if (!searchingLoading) {
            setCustomerId("");
            setExistAccountData(null);
            setExistingAccountModal(false);
          }
        }}
        backdrop="static"
        size="lg"
        keyboard={false}
        dialogClassName={`${ExistingAccountData ? "modal-cover-screen" : ""} `}
      >
        <Modal.Header closeButton={!searchingLoading}>
          <h1 className="header-card-information">
            <span>Customer Information</span>
          </h1>
        </Modal.Header>
        <Modal.Body>
          {searchingLoading ? (
            <LoaderSpinner />
          ) : ExistingAccountData ? (
            <div className="fluid-container">
              <div className="row">
                <div className="col-md-5 row">
                  <ProfileIdContainer
                    update={false}
                    images={images}
                    setImages={setImages}
                  />
                </div>
                <div className="col-md-7 row ">
                  <div className="col-md-6">
                    <div className="label-name-bar" />
                    <label className="d-block label-name text-left">
                      Full Name :
                    </label>
                    <label className="d-block label-name text-left text-muted">
                      {toCapitalized(
                        ExistingAccountData.lastname +
                          " " +
                          ExistingAccountData.firstname +
                          " " +
                          ExistingAccountData.middlename
                      )}
                    </label>
                  </div>
                  <div className="col-md-3">
                    <div className="label-name-bar" />
                    <label className="d-block label-name text-left">
                      Birthday :
                    </label>
                    <label className="d-block label-name text-left text-muted">
                      {ExistingAccountData.birthday}
                    </label>
                  </div>
                  <div className="col-md-3">
                    <div className="label-name-bar" />
                    <label className="d-block label-name text-left">
                      Age :
                    </label>
                    <label className="d-block label-name text-left text-muted">
                      {ExistingAccountData.birthday
                        ? calculateAge(ExistingAccountData.birthday)
                        : ""}
                    </label>
                  </div>
                  <div className="col-md-4">
                    <div className="label-name-bar" />
                    <label className="d-block label-name text-left">
                      Phone :
                    </label>
                    <label className="d-block label-name text-left text-muted">
                      {ExistingAccountData.phone
                        ? ExistingAccountData.phone
                        : ""}
                    </label>
                  </div>
                  <div className="col-md-4">
                    <div className="label-name-bar" />
                    <label className="d-block label-name text-left">
                      Civil Status :
                    </label>
                    <label className="d-block label-name text-left text-muted">
                      {ExistingAccountData.civilStatus
                        ? ExistingAccountData.civilStatus
                        : ""}
                    </label>
                  </div>
                  <div className="col-md-4">
                    <div className="label-name-bar" />
                    <label className="d-block label-name text-left">
                      Sex :
                    </label>
                    <label className="d-block label-name text-left text-muted">
                      {ExistingAccountData.sex ? ExistingAccountData.sex : ""}
                    </label>
                  </div>
                  <div className="col-md-12">
                    <div className="label-name-bar" />
                    <label className="d-block label-name text-left">
                      Complete Address :
                    </label>
                    <label className="d-block label-name text-left text-muted">
                      {ExistingAccountData.address.fullAddress
                        ? toCapitalized(ExistingAccountData.address.fullAddress)
                        : ""}
                    </label>
                  </div>
                  <div className="col-md-4">
                    <div className="label-name-bar" />
                    <label className="d-block label-name text-left">
                      City / Mun
                    </label>
                    <label className="d-block label-name text-left text-muted">
                      {ExistingAccountData.address.mun
                        ? toCapitalized(ExistingAccountData.address.mun.label)
                        : ""}
                    </label>
                  </div>
                  <div className="col-md-4">
                    <div className="label-name-bar" />
                    <label className="d-block label-name text-left">
                      Province
                    </label>
                    <label className="d-block label-name text-left text-muted">
                      {ExistingAccountData.address.prov
                        ? toCapitalized(ExistingAccountData.address.prov.label)
                        : ""}
                    </label>
                  </div>
                  <div className="col-md-4">
                    <div className="label-name-bar" />
                    <label className="d-block label-name text-left">
                      Zip Code
                    </label>
                    <label className="d-block label-name text-left text-muted">
                      {ExistingAccountData.address.prov
                        ? zipcodes.reverse(
                            toCapitalized(
                              ExistingAccountData.address.mun.value.name
                            )
                          )
                        : ""}
                    </label>
                  </div>
                  <div className="col-md-12">
                    <div className="label-name-bar" />
                    <label className="d-block label-name text-left">
                      Email Address
                    </label>
                    <label className="d-block label-name text-left text-muted no-capitalized">
                      {ExistingAccountData.email}
                    </label>
                  </div>
                </div>
              </div>
              <ModalGateway>
                {isViewerOpen ? (
                  <ReactImagesModal onClose={closeLightbox}>
                    <Carousel
                      currentIndex={currentImage}
                      views={[
                        { source: ExistingAccountData.profile.url },
                        { source: ExistingAccountData.frontId.url },
                        { source: ExistingAccountData.backId.url },
                      ]}
                    />
                  </ReactImagesModal>
                ) : null}
              </ModalGateway>
            </div>
          ) : (
            <div className="fluid-container">
              <div className="row">
                <div className="col-md-6">
                  <p>
                    Paste Or Type Your Customer ID # to show Data And Press
                    Enter
                  </p>
                  <div className="percent-container">
                    <input
                      value={customerId}
                      type="text"
                      min="0"
                      className=""
                      placeholder={`Customer ID #`}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleSearchingAccount();
                        }
                      }}
                      onChange={(e) => setCustomerId(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-6 text-right">
                  <button
                    name="register-customer"
                    className="btn-qrcode btn-download-qrcode"
                    onClick={() => {
                      setSearchingLoading(true);
                    }}
                  >
                    Scan Qr Code <AiOutlineQrcode size={40} />
                  </button>
                </div>
              </div>
              <label
                className="label-name d-block text-center text-danger "
                style={{ marginTop: "100px" }}
              >
                Search Customer ID or Scan Customer QRCODE to show Data
                Information Thanks!
              </label>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          {searchingLoading ? (
            <CButton
              color="secondary"
              className="btn-qrcode forgot-password-btn"
              onClick={() => {
                setSearchingLoading(false);
              }}
            >
              Cancel
            </CButton>
          ) : (
            <CButton
              color="secondary"
              disabled={searchingLoading}
              className="btn-qrcode cancel-button "
              onClick={() => {
                if (ExistingAccountData) {
                  setExistAccountData(null);
                } else {
                  setCustomerId("");
                  setExistAccountData(null);

                  setExistingAccountModal(false);
                }
              }}
            >
              {ExistingAccountData ? "cancel" : "close"}
            </CButton>
          )}

          {ExistingAccountData ? (
            <CButton
              className="btn-qrcode save-button "
              onClick={handleSaveBranchCustomer}
            >
              Save
            </CButton>
          ) : null}
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default ExistingAccount;
