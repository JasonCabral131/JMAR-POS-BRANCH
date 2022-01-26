import React, { useRef, useState } from "react";
import DocsLink from "./DocsLink";
import shortId from "shortid";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { FcUpload } from "react-icons/fc";
import { BsPersonFill, BsFilePerson, BsPersonBadgeFill } from "react-icons/bs";
import { CButton } from "@coreui/react";
import FrontId from "./../assets/icons/FrontId.jpg";
import BackId from "./../assets/icons/BackId.jpg";
import Loader from "react-loader-spinner";
import Carousel, {
  Modal as ReactImagesModal,
  ModalGateway,
} from "react-images";
import { AiOutlineExpand } from "react-icons/ai";
const EmailValidator = (email) => {
  const regex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (regex.test(email)) {
    return true;
  } else {
    return false;
  }
};
const calculateAge = (date) => {
  const today = new Date();
  const birthDate = new Date(date); // create a date object directly from `dob1` argument
  let age_now = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age_now--;
  }
  return age_now;
};
export const getBase64 = (file) => {
  return new Promise((resolve) => {
    let baseURL = "";
    // Make new FileReader
    let reader = new FileReader();

    // Convert the file to base64 text
    reader.readAsDataURL(file);

    // on reader load somthing...
    reader.onload = () => {
      baseURL = reader.result;

      resolve(baseURL);
    };
  });
};
const ImageGallery = ({ images, setImages }) => {
  const imageRef = useRef();

  const handleImageChange = async (e) => {
    const files = e.target.files;
    for (let file of files) {
      const dataUrl = await getBase64(file);
      setImages((prev) => {
        if (prev.length === 0) {
          return [...prev, { file: file, dataUrl, active: true }];
        }
        return [...prev, { file: file, dataUrl, active: false }];
      });
    }
  };

  const handleShowImage = (index) => {
    const updated = images.map((data, breakpoint) => {
      if (breakpoint === index) {
        return { ...data, active: true };
      }
      return { ...data, active: false };
    });
    setImages(updated);
  };
  const removeImageFromGallery = (index) => {
    const toBeRemove = images.filter(
      (data, breakpoint) => breakpoint !== index
    );
    const update = toBeRemove.map((data, breakpoint) => {
      if (breakpoint === 0) {
        return { ...data, active: true };
      } else {
        return { ...data, active: false };
      }
    });

    setImages(update);
  };
  return (
    <div className="image-gallery-container">
      <input
        onChange={handleImageChange}
        type={"file"}
        hidden={true}
        ref={imageRef}
        accept="image/*"
        multiple={true}
      />
      <div className="image-gallery-view">
        {Array.isArray(images) && images.length > 0 ? (
          images.map((image, index) => {
            if (image.active) {
              return <img key={index} alt="gallery view" src={image.dataUrl} />;
            }
            return null;
          })
        ) : (
          <img
            alt="block img"
            src="https://cdn1.iconfinder.com/data/icons/image-1-0/1024/image_block-512.png"
          />
        )}

        <p
          className="mt-2  upload "
          onClick={() => {
            imageRef.current.click();
          }}
        >
          <FcUpload size={20} /> <span> Upload new Photos</span>
        </p>
      </div>
      <div className="image-gallery-lists">
        {Array.isArray(images) && images.length > 0 ? (
          images.map((data, index) => {
            return (
              <div className="image-gallery-list" key={index}>
                <img
                  onMouseEnter={() => handleShowImage(index)}
                  onClick={() => handleShowImage(index)}
                  className={`${
                    data.active ? "image-active" : "image-unactive"
                  }`}
                  alt={`gallery view ${index}`}
                  src={data.dataUrl}
                />
                <AiOutlineCloseCircle
                  onClick={() => removeImageFromGallery(index)}
                  size={25}
                  className="text-danger image-gallery-remove"
                />
              </div>
            );
          })
        ) : (
          <div className="image-gallery-list">
            <img
              className="image-block"
              alt={`block gallery view `}
              src="https://cdn1.iconfinder.com/data/icons/image-1-0/1024/image_block-512.png"
            />
            <p className="no-image-selected">
              <span>No Image Selected</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const UpdateGallery = ({
  images,
  handlingRemove,
  setImages,
  setAddingUpdateImages,
}) => {
  const imageRef = useRef();
  const handleImageChange = async (e) => {
    const files = e.target.files;
    for (let file of files) {
      const dataUrl = await getBase64(file);
      const _id = shortId.generate();
      setAddingUpdateImages((prev) => {
        return [...prev, { file, _id }];
      });

      setImages((prev) => {
        if (prev.length === 0) {
          return [
            ...prev,
            { file: file, img: dataUrl, active: true, status: "new", _id },
          ];
        }
        return [
          ...prev,
          { file: file, img: dataUrl, active: false, status: "new", _id },
        ];
      });
    }
  };
  const handleShowImage = (index) => {
    const updated = images.map((data, breakpoint) => {
      if (breakpoint === index) {
        return { ...data, active: true };
      }
      return { ...data, active: false };
    });
    setImages(updated);
  };
  return (
    <div className="image-gallery-container">
      <input
        onChange={handleImageChange}
        type={"file"}
        hidden={true}
        ref={imageRef}
        accept="image/*"
        multiple={true}
      />
      <div className="image-gallery-view">
        {Array.isArray(images) && images.length > 0 ? (
          images.map((image, index) => {
            if (image.active) {
              return (
                <img
                  key={index}
                  alt={`gallery view ${image._id}`}
                  src={image.img}
                />
              );
            }
            return null;
          })
        ) : (
          <img
            alt="block img"
            src="https://cdn1.iconfinder.com/data/icons/image-1-0/1024/image_block-512.png"
          />
        )}
        <p
          className="mt-2  upload "
          onClick={() => {
            imageRef.current.click();
          }}
        >
          <FcUpload size={20} /> <span> Upload new image</span>
        </p>
      </div>
      <div className="image-gallery-lists">
        {Array.isArray(images) && images.length > 0
          ? images
              .slice(0)
              .reverse()
              .map((data, index) => {
                return (
                  <div className="image-gallery-list" key={index}>
                    <img
                      onMouseEnter={() =>
                        handleShowImage(images.length - 1 - index)
                      }
                      onClick={() => handleShowImage(images.length - 1 - index)}
                      className={`${
                        data.active ? "image-active" : "image-unactive"
                      }`}
                      alt={`gallery view ${index}`}
                      src={data.img}
                    />
                    <AiOutlineCloseCircle
                      onClick={() => handlingRemove(data)}
                      size={25}
                      className="text-danger image-gallery-remove"
                    />
                    {data.status === "new" ? (
                      <span className="update-badge-info">New Upload</span>
                    ) : null}
                  </div>
                );
              })
          : null}
      </div>
    </div>
  );
};
const imageUploadCallBack = (file) =>
  new Promise((resolve, reject) => {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    let img = new Image();
    // let url = ''
    reader.onload = function (e) {
      img.src = this.result;
      resolve({
        data: {
          link: img.src,
        },
      });
    };
  });
const BrandFields = [
  { key: "Index", label: "#" },
  { key: "brand", label: `Brand` },
  { key: "Date", label: `Date` },
  {
    key: "action",
    label: "Action",
  },
];
const BrandSubFields = [
  { key: "Index", label: "Index" },
  { key: "subcategory", label: `Subcategory` },
  { key: "BrandOf", label: `Brand` },
  { key: "Date", label: `Date` },
  {
    key: "action",
    label: "Action",
  },
];
const ProductSubFields = [
  { key: "Index", label: "Index" },
  { key: "product", label: `Product` },
  { key: "brandOf", label: `Brand` },
  { key: "price", label: `Price` },
  { key: "quantity", label: `Quantity` },
  { key: "Date", label: `Date` },
  {
    key: "action",
    label: "Action",
  },
];
const TaxFields = [
  { key: "Index", label: "Index" },
  { key: "tax", label: "Tax" },
  { key: "percentage", label: `Percentage` },
  { key: "Date", label: `Date` },
  {
    key: "action",
    label: "Action",
  },
];
const CashierFields = [
  { key: "index", label: "Index" },
  { key: "name", label: "Name" },
  { key: "phone", label: `Phone` },
  { key: "email", label: `email` },
  { key: "date", label: `Registered` },
  {
    key: "action",
    label: "Action",
  },
];
const CustomerFields = [
  { key: "index", label: "Index" },
  { key: "name", label: "Name" },
  { key: "phone", label: `Phone` },
  { key: "email", label: `email` },
  { key: "date", label: `Registered` },
  {
    key: "action",
    label: "Action",
  },
];
const AllCustomerFields = [
  { key: "index", label: "Index" },
  { key: "name", label: "Name" },
  { key: "phone", label: `Phone` },
  { key: "email", label: `email` },
  { key: "date", label: `Registered` },
  {
    key: "action",
    label: "Action",
  },
];
const PasswordStrengt = (value) => {
  const regex =
    /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z!#$@^%&_+=-? "])[a-zA-Z0-9!#$@^%&_+=-?]{8,20}$/;
  if (regex.test(value)) {
    return true;
  } else {
    return false;
  }
};
const randomString = (length) => {
  const chars =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var result = "";
  for (var i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];
  return result;
};
const phoneValidtor = (value) => {
  const regex =
    /(\+?\d{2}?\s?\d{3}\s?\d{3}\s?\d{4})|([0]\d{3}\s?\d{3}\s?\d{4})/;
  if (regex.test(value)) {
    return true;
  } else {
    return false;
  }
};
const ProfileIdContainer = ({ images, setImages, update }) => {
  const profileRef = useRef();
  const frontIdRef = useRef();
  const backIdRef = useRef();
  const closeLightbox = () => {
    setCurrentImage(0);
    setIsViewerOpen(false);
  };
  const [currentImage, setCurrentImage] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const handleOnChangeImage = async (e) => {
    const { files, name } = e.target;

    for (let file of files) {
      const dataUrl = await getBase64(file);
      setImages((prev) => {
        return { ...prev, [name]: { ...prev[name], file: file, dataUrl } };
      });
    }
  };
  const handleToShow = (keyx) => {
    Object.keys(images).map((key) => {
      if (keyx === key) {
        setImages((prev) => {
          return { ...prev, [keyx]: { ...prev[keyx], active: true } };
        });
      } else {
        setImages((prev) => {
          return { ...prev, [key]: { ...prev[key], active: false } };
        });
      }

      return null;
    });
  };
  return (
    <>
      <div className="profile-id-container shadow">
        <ModalGateway>
          {isViewerOpen ? (
            <ReactImagesModal onClose={closeLightbox}>
              <Carousel
                currentIndex={currentImage}
                views={[
                  { source: images["profile"].dataUrl },
                  {
                    source: images["FrontId"].dataUrl
                      ? images["FrontId"].dataUrl
                      : "https://us.123rf.com/450wm/happyvector071/happyvector0711904/happyvector071190415714/121105442-creative-illustration-of-default-avatar-profile-placeholder-isolated-on-background-art-design-grey-p.jpg?ver=6",
                  },
                  {
                    source: images["BackId"].dataUrl
                      ? images["BackId"].dataUrl
                      : "https://us.123rf.com/450wm/happyvector071/happyvector0711904/happyvector071190415714/121105442-creative-illustration-of-default-avatar-profile-placeholder-isolated-on-background-art-design-grey-p.jpg?ver=6",
                  },
                ]}
              />
            </ReactImagesModal>
          ) : null}
        </ModalGateway>
        <div className="required-show-left">
          {Object.keys(images).map((key, index) => {
            if (images[key].dataUrl) {
              if (images[key].active) {
                return (
                  <div key={randomString(12)}>
                    <img
                      src={images[key].dataUrl}
                      alt={images[key].dataUrl}
                      key={randomString(12)}
                      onClick={() => {
                        setCurrentImage(index);
                        setIsViewerOpen(true);
                      }}
                    />
                    <div
                      className="view-listx"
                      onClick={() => {
                        setCurrentImage(index);
                        setIsViewerOpen(true);
                      }}
                    >
                      {" "}
                      <AiOutlineExpand size={50} className="icons-center" />
                    </div>
                  </div>
                );
              } else {
                return null;
              }
            } else {
              return null;
            }
          })}
        </div>
        <div className="required-show-right">
          <div
            className="side-choicer image-active border-bottom"
            style={{ cursor: "pointer" }}
            id="profile"
            onClick={() => handleToShow("profile")}
          >
            <label className="side-choicer-label">Profile</label>
            <img
              className={`${
                images.profile.active ? "image-active" : "image-unactive"
              }`}
              src={
                images.profile.dataUrl
                  ? images.profile.dataUrl
                  : "https://us.123rf.com/450wm/happyvector071/happyvector0711904/happyvector071190415714/121105442-creative-illustration-of-default-avatar-profile-placeholder-isolated-on-background-art-design-grey-p.jpg?ver=6"
              }
              alt="profile-alt-img"
            />
          </div>
          <div
            className="side-choicer image-active"
            style={{
              cursor: images["FrontId"].dataUrl ? "pointer" : "not-allowed",
              pointerEvents: images["FrontId"].dataUrl ? "visible" : "revert",
            }}
            id="FrontId"
            onClick={() =>
              images["FrontId"].dataUrl ? handleToShow("FrontId") : {}
            }
          >
            <label className="side-choicer-label">Front ID</label>
            <img
              className={`${
                images.FrontId.active ? "image-active" : "image-unactive"
              }`}
              src={images.FrontId.dataUrl ? images.FrontId.dataUrl : FrontId}
              alt="profile-alt-img"
            />
          </div>
          <div
            id="BackId"
            className="side-choicer image-active"
            style={{
              cursor: images["BackId"].dataUrl ? "pointer" : "not-allowed",
              pointerEvents: images["BackId"].dataUrl ? "visible" : "revert",
            }}
            onClick={() =>
              images["BackId"].dataUrl ? handleToShow("BackId") : {}
            }
          >
            <label className="side-choicer-label">Back Id</label>
            <img
              className={`${
                images.BackId.active ? "image-active" : "image-unactive"
              }`}
              src={images.BackId.dataUrl ? images.BackId.dataUrl : BackId}
              alt="profile-alt-img"
            />
          </div>
        </div>
      </div>
      {update ? (
        <div className="d-flex w-100 justify-content-between p-3">
          <CButton
            color={"primary"}
            variant={"outline"}
            onClick={() => profileRef.current.click()}
          >
            <BsPersonFill size={20} /> Select Profile
          </CButton>
          <CButton color={"light"} onClick={() => frontIdRef.current.click()}>
            <BsFilePerson size={20} /> Select Front ID
          </CButton>
          <CButton color={"warning"} onClick={() => backIdRef.current.click()}>
            <BsPersonBadgeFill size={20} /> Select Back ID
          </CButton>
        </div>
      ) : null}
      <input
        ref={profileRef}
        multiple={false}
        type="file"
        accept="image/*"
        name="profile"
        className="d-none"
        onChange={handleOnChangeImage}
      />
      <input
        ref={frontIdRef}
        multiple={false}
        type="file"
        name="FrontId"
        accept="image/*"
        className="d-none"
        onChange={handleOnChangeImage}
      />
      <input
        ref={backIdRef}
        multiple={false}
        type="file"
        accept="image/*"
        className="d-none"
        name="BackId"
        onChange={handleOnChangeImage}
      />
    </>
  );
};
const toCapitalized = (myString) => {
  return myString
    .trim()
    .toLowerCase()
    .replace(/\w\S*/g, (w) => w.replace(/^\w/, (c) => c.toUpperCase()));
};
const informationObject = {
  lastname: "",
  firstname: "",
  middlename: "",
  email: {
    email: "",
    valid: false,
  },
  phone: {
    phone: "",
    valid: false,
  },
  birthday: "",
  sex: "",
  address: {
    reg: null,
    prov: null,
    mun: null,
    brgy: null,
    fullAddress: null,
    st: "",
  },
  store_name: "",
  password: randomString(16),
  resume: null,
  civilStatus: "",
};
const imagesObject = {
  profile: {
    file: null,
    dataUrl:
      "https://lgclahore.com/wp-content/uploads/2013/11/120957417-creative-illustration-of-default-avatar-profile-placeholder-isolated-on-background-art-design-grey-p.jpg",
    active: true,
  },
  FrontId: {
    file: null,
    dataUrl: null,
    active: false,
  },
  BackId: {
    file: null,
    dataUrl: null,
    active: false,
  },
  Resume: {
    file: null,
    dataUrl: null,
    active: false,
  },
};
const getstatus = (stat) => {
  if (stat === "active") {
    return "success";
  }
  if (stat === "pending") {
    return "warning";
  }
  if (stat === "banned") {
    return "danger";
  }
};
const LoaderSpinner = () => {
  return (
    <div className="w-100 text-center">
      <div className=" d-flex  justify-content-center">
        <Loader
          type="Circles"
          color="#00BFFF"
          height={300}
          width={300}
          //3 secs
        />
      </div>
      <label
        className="d-flex  justify-content-center label-name mt-2"
        style={{ cursor: "progress" }}
      >
        Wait for response
        <Loader type="ThreeDots" color="#00BFFF" height={30} width={30} />
      </label>
    </div>
  );
};
const numberFormat = (value) => {
  return new Intl.NumberFormat().format(value);
};
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const handleTodaysMonth = () => {
  const date = new Date();
  return (
    monthNames[date.getMonth()] +
    " " +
    date.getDate() +
    ", " +
    date.getFullYear()
  );
};
const dashboardInfo = (item) => {
  if (item.cashier) {
    return {
      name: toCapitalized(
        item.cashier.lastname +
          ", " +
          item.cashier.firstname +
          " " +
          item.cashier.middlename
      ),
      url: item.cashier.profile.url,
      type: "Cashier",
    };
  }
  if (item.branch) {
    return {
      name: toCapitalized(
        item.branch.branch_owner_lname +
          ", " +
          item.branch.branch_owner_fname +
          " " +
          item.branch.branch_owner_MI
      ),
      url: item.branch.branch_owner_profile.profile,
      type: "owner",
    };
  }
};
const getWeekOfMonth = (dit) => {
  try {
    var d = dit;
    var date = d.getDate();
    var day = d.getDay();
    // let adjustedDate = date.getDate() + date.getDay();
    // let prefixes = ["0", "1", "2", "3", "4", "5"];
    // return parseInt(prefixes[0 | (adjustedDate / 7)]);
    const prefixex = [
      "1st-Week",
      "2nd-Week",
      "3rd-Week",
      "4th-Week",
      "5th-Week",
    ];
    var weekOfMonth = Math.ceil((date - 1 - day) / 7);

    return `${prefixex[parseInt(weekOfMonth)]}/${
      monthNames[d.getMonth()]
    }/${d.getFullYear()}`;
  } catch (e) {}
};
export {
  DocsLink,
  EmailValidator,
  ImageGallery,
  UpdateGallery,
  imageUploadCallBack,
  BrandFields,
  BrandSubFields,
  ProductSubFields,
  TaxFields,
  PasswordStrengt,
  randomString,
  phoneValidtor,
  ProfileIdContainer,
  calculateAge,
  toCapitalized,
  informationObject,
  imagesObject,
  CashierFields,
  CustomerFields,
  getstatus,
  LoaderSpinner,
  numberFormat,
  monthNames,
  handleTodaysMonth,
  dashboardInfo,
  AllCustomerFields,
  getWeekOfMonth,
};
