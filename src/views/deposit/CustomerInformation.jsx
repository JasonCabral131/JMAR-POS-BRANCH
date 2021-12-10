import React from "react";

import { ProfileIdContainer, toCapitalized, calculateAge } from "src/reusable";
import zipcodes from "zipcodes-ph";
const CustomerInformation = ({ Select, selected, images, setImages }) => {
  return (
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
            <label className="d-block label-name text-left">Full Name :</label>
            <label className="d-block label-name text-left text-muted">
              {toCapitalized(
                selected.lastname +
                  " " +
                  selected.firstname +
                  " " +
                  selected.middlename
              )}
            </label>
          </div>
          <div className="col-md-3">
            <div className="label-name-bar" />
            <label className="d-block label-name text-left">Birthday :</label>
            <label className="d-block label-name text-left text-muted">
              {selected.birthday}
            </label>
          </div>
          <div className="col-md-3">
            <div className="label-name-bar" />
            <label className="d-block label-name text-left">Age :</label>
            <label className="d-block label-name text-left text-muted">
              {selected.birthday ? calculateAge(selected.birthday) : ""}
            </label>
          </div>
          <div className="col-md-4">
            <div className="label-name-bar" />
            <label className="d-block label-name text-left">Phone :</label>
            <label className="d-block label-name text-left text-muted">
              {selected.phone ? selected.phone : ""}
            </label>
          </div>
          <div className="col-md-4">
            <div className="label-name-bar" />
            <label className="d-block label-name text-left">
              Civil Status :
            </label>
            <label className="d-block label-name text-left text-muted">
              {selected.civilStatus ? selected.civilStatus : ""}
            </label>
          </div>
          <div className="col-md-4">
            <div className="label-name-bar" />
            <label className="d-block label-name text-left">Sex :</label>
            <label className="d-block label-name text-left text-muted">
              {selected.sex ? selected.sex : ""}
            </label>
          </div>
          <div className="col-md-12">
            <div className="label-name-bar" />
            <label className="d-block label-name text-left">
              Complete Address :
            </label>
            <label className="d-block label-name text-left text-muted">
              {selected.address.fullAddress
                ? toCapitalized(selected.address.fullAddress)
                : ""}
            </label>
          </div>
          <div className="col-md-4">
            <div className="label-name-bar" />
            <label className="d-block label-name text-left">City / Mun</label>
            <label className="d-block label-name text-left text-muted">
              {selected.address.mun
                ? toCapitalized(selected.address.mun.label)
                : ""}
            </label>
          </div>
          <div className="col-md-4">
            <div className="label-name-bar" />
            <label className="d-block label-name text-left">Province</label>
            <label className="d-block label-name text-left text-muted">
              {selected.address.prov
                ? toCapitalized(selected.address.prov.label)
                : ""}
            </label>
          </div>
          <div className="col-md-4">
            <div className="label-name-bar" />
            <label className="d-block label-name text-left">Zip Code</label>
            <label className="d-block label-name text-left text-muted">
              {selected.address.prov
                ? zipcodes.reverse(
                    toCapitalized(selected.address.mun.value.name)
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
              {selected.email}
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CustomerInformation;
