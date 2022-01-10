import React from "react";

const ImageGalleryShow = ({ images, setImages }) => {
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
      <div className="image-gallery-view">
        {images.map((image, index) => {
          if (image.active) {
            return <img key={index} alt="gallery view" src={image.url} />;
          }
          return null;
        })}
      </div>
      <div className="image-gallery-lists">
        {images.map((data, index) => {
          return (
            <div className="image-gallery-list" key={index}>
              <img
                onMouseEnter={() => handleShowImage(index)}
                onClick={() => handleShowImage(index)}
                className={`${data.active ? "image-active" : "image-unactive"}`}
                alt={`gallery view ${index}`}
                src={data.url}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ImageGalleryShow;
