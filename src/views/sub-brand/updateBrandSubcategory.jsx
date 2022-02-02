import React from "react";

import { Editor } from "react-draft-wysiwyg";
import { imageUploadCallBack, UpdateGallery } from "src/reusable";
import Select from "react-select";
const UpdateSubcategory = ({
  updateEditorState,
  setUpdateEditorState,
  updateImages,
  setUpdateImages,
  addingUpdateImages,
  setAddingUpdateImages,
  updateSubBrand,
  setUpdateSubBrand,
  updateBrand,
  setUpdatebrand,
  handleRemoveImages,
  options,
}) => {
  return (
    <div className="brand-modal-container">
      <div className="row">
        <div className="col-md-6">
          <label className="label-name update-label">
            <span>Brand Subcategory Images</span>
          </label>
          <div className="d-block d-flex justify-content-center">
            <UpdateGallery
              images={updateImages}
              handlingRemove={handleRemoveImages}
              setImages={setUpdateImages}
              addingUpdateImages={addingUpdateImages}
              setAddingUpdateImages={setAddingUpdateImages}
            />
          </div>
        </div>
        <div className="col-md-6">
          <form>
            <div className="form-group">
              <label className="label-name">Brand</label>
              <Select
                value={updateBrand}
                options={options}
                cacheOptions
                onChange={(e) => setUpdatebrand(e)}
              />
            </div>
            <div className="form-group">
              <label className="label-name">Brand Subcategory</label>
              <input
                value={updateSubBrand ? updateSubBrand.subBrand : ""}
                type="text"
                className="form-control inputvalue"
                placeholder="Input Brand Name"
                onChange={(e) => {
                  setUpdateSubBrand((prev) => {
                    return { ...prev, subBrand: e.target.value };
                  });
                }}
              />
            </div>
            <div className="form-group">
              <label className="label-name">
                Brand Subcategory Description
              </label>

              <Editor
                editorState={updateEditorState}
                onEditorStateChange={(content) => setUpdateEditorState(content)}
                style={{ padding: "5px" }}
                toolbar={{
                  image: {
                    className: undefined,
                    component: undefined,
                    popupClassName: undefined,
                    urlEnabled: true,
                    uploadEnabled: true,
                    alignmentEnabled: true,
                    uploadCallback: imageUploadCallBack,
                    previewImage: true,
                    inputAccept: "image/*",
                    defaultSize: {
                      height: "400px",
                      width: "400px",
                    },
                  },
                }}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateSubcategory;
