import React from "react";
import { ImageGallery, imageUploadCallBack } from "src/reusable";
/**
 * @author
 * @function CreateBrand
 **/

const CreateBrand = ({
  images,
  setImages,
  editorState,
  setEditorState,
  Editor,
  brandName,
  setBrandName,
}) => {
  return (
    <div className="brand-modal-container">
      <div className="row">
        <div className="col-md-6 d-flex justify-content-center">
          <ImageGallery images={images} setImages={setImages} />
        </div>
        <div className="col-md-6 mt-2">
          <form>
            <div className="form-group">
              <label className="label-name">Brand Name</label>
              <input
                value={brandName}
                type="text"
                className="form-control inputvalue"
                placeholder="Input Brand Name"
                onChange={(e) => setBrandName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="label-name">Brand Description</label>
              <div className="text-area-description">
                <Editor
                  editorState={editorState}
                  onEditorStateChange={(content) => setEditorState(content)}
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
export default CreateBrand;
