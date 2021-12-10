import React, { useState } from "react";
import Select from "react-select";
import phil from "phil-reg-prov-mun-brgy";
import { Modal } from "react-bootstrap";
import { CButton } from "@coreui/react";
const addressObject = {
  reg: null,
  prov: null,
  mun: null,
  brgy: null,
  fullAddress: null,
  st: "",
};

const getRegions = () => {
  return phil.regions.map((data) => {
    return { value: data, label: data.name };
  });
};
const AddressInfo = ({
  showAddressModal,
  setShowAddressModal,
  setInformation,
}) => {
  const [address, setAddress] = useState(addressObject);

  const handleRegion = (val) => {
    setAddress((prev) => {
      return {
        reg: val,
        prov: null,
        mun: null,
        brgy: null,
        fullAddress: null,
        st: "",
      };
    });
  };
  const handleProvince = (val) => {
    setAddress((prev) => {
      return {
        ...prev,
        prov: val,
        mun: null,
        brgy: null,
        fullAddress: null,
        st: "",
      };
    });
  };
  const handleMunCity = (val) => {
    setAddress((prev) => {
      const { value, label } = val;
      const { name } = value;
      const newName = name.replace("(Capital)", "");
      console.log();
      return {
        ...prev,
        mun: { value: { ...value, name: newName }, label },
        brgy: null,
        fullAddress: null,
        st: "",
      };
    });
  };
  const handleBrgy = (data) => {
    setAddress((prev) => {
      return {
        ...prev,
        brgy: data,

        st: "",
        fullAddress: null,
      };
    });
  };
  const getProvince = (data) => {
    return phil.getProvincesByRegion(data.value.reg_code).map((data) => {
      return { value: data, label: data.name };
    });
  };
  const getMunCity = (data) => {
    return phil.getCityMunByProvince(data.value.prov_code).map((data) => {
      return { value: data, label: data.name };
    });
  };
  const getBrgy = (data) => {
    return phil.getBarangayByMun(data.value.mun_code).map((data) => {
      return { value: data, label: data.name };
    });
  };
  const handleStFullAddress = (e) => {
    const { value } = e.target;
    if (value.length >= 4) {
      const fullAddress = `${value} , ${address.brgy.label} , ${address.mun.label} , ${address.prov.label} , ${address.reg.label} `;
      setAddress((prev) => {
        return { ...prev, st: value, fullAddress };
      });
    } else {
      setAddress((prev) => {
        return { ...prev, fullAddress: null };
      });
    }
  };
  const submit = () => {
    setInformation((prev) => {
      return { ...prev, address: address };
    });
    setShowAddressModal(false);
    setAddress(addressObject);
  };

  return (
    <Modal
      show={showAddressModal}
      onHide={() => {
        setAddress(addressObject);
        setShowAddressModal(false);
      }}
      backdrop="static"
      keyboard={false}
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {" "}
          <h1 className="header-card-information">
            <span>Home Address</span>
          </h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="form-group">
          <label className="label-name text-left d-block">Select Region</label>
          <Select
            options={getRegions()}
            cacheOptions
            value={address.reg}
            placeholder={"Select Region"}
            onChange={handleRegion}
          />
        </div>
        {address.reg ? (
          <div className="form-group">
            <label className="label-name text-left d-block">
              Select Province of {address.reg.label}
            </label>
            <Select
              options={getProvince(address.reg)}
              cacheOptions
              value={address.prov}
              placeholder={`Select Province of ${address.reg.label}`}
              onChange={handleProvince}
            />
          </div>
        ) : null}
        <div className="row">
          {address.prov ? (
            <div className="col-md-6 form-group">
              <label className="label-name text-left d-block">
                Select Municipality of {address.prov.label}
              </label>
              <Select
                options={getMunCity(address.prov)}
                cacheOptions
                value={address.mun}
                placeholder={`Select Province of ${address.prov.label}`}
                onChange={handleMunCity}
              />
            </div>
          ) : null}
          {address.mun ? (
            <div className="col-md-6 form-group">
              <label className="label-name text-left d-block">
                Select Brgy of {address.mun.label}
              </label>
              <Select
                options={getBrgy(address.mun)}
                cacheOptions
                value={address.brgy}
                placeholder={`Select Brgy of ${address.mun.label}`}
                onChange={handleBrgy}
              />
            </div>
          ) : null}
          {address.brgy ? (
            <div className="col-md-12 form-group percent-container">
              <label className="label-name text-left d-block">
                Select Street of {address.brgy.label}
              </label>
              <input
                type="text"
                placeholder={` Select Street of ${address.brgy.label}`}
                onChange={handleStFullAddress}
              />
            </div>
          ) : null}
        </div>
        {}
      </Modal.Body>
      <Modal.Footer>
        <CButton
          color="secondary"
          variant="outline"
          shape="square"
          size="lg"
          onClick={() => {
            setAddress(addressObject);
            setShowAddressModal(false);
          }}
        >
          Cancel
        </CButton>
        {address.fullAddress ? (
          <CButton
            color="info"
            variant="outline"
            shape="square"
            size="lg"
            className="ml-1"
            onClick={submit}
          >
            Save
          </CButton>
        ) : null}
      </Modal.Footer>
    </Modal>
  );
};
export default AddressInfo;
