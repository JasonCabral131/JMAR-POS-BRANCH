import React from "react";
import { UpdateGallery, imageUploadCallBack } from "src/reusable";

const UpdateBrand = ({
  updateEditorState,
  setUpdateEditorState,
  updateImages,
  setUpdateImages,
  addingUpdateImages,
  setAddingUpdateImages,
  updateBrand,
  setUpdateBrand,
  handleRemoveImages,
  Editor,
}) => {
  return (
    <div className="brand-modal-container">
      <div className="row">
        <div className="col-md-6">
          <label className="label-name update-label">
            <span>Brand Images</span>
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
              <label className="label-name">Brand Name</label>
              <input
                value={updateBrand.brand}
                type="text"
                className="form-control inputvalue"
                placeholder="Input Brand Name"
                onChange={(e) =>
                  setUpdateBrand((prev) => {
                    return { ...prev, brand: e.target.value };
                  })
                }
              />
            </div>
            <div className="form-group">
              <label className="label-name">Brand Description</label>
              <div className="text-area-description">
                <Editor
                  editorState={updateEditorState}
                  onEditorStateChange={(content) =>
                    setUpdateEditorState(content)
                  }
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
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default UpdateBrand;
