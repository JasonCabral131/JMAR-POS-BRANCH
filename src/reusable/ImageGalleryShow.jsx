import React, { useState } from "react";
import Carousel, {
  Modal as ReactImagesModal,
  ModalGateway,
} from "react-images";
const ImageGalleryShow = ({ images, setImages }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const closeLightbox = () => {
    setCurrentImage(0);
    setIsViewerOpen(false);
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
      <ModalGateway>
        {isViewerOpen ? (
          <ReactImagesModal onClose={closeLightbox}>
            <Carousel
              currentIndex={currentImage}
              views={images.map((data) => {
                return { source: data.url };
              })}
            />
          </ReactImagesModal>
        ) : null}
      </ModalGateway>
      <div className="image-gallery-view">
        {images.map((image, index) => {
          if (image.active) {
            return (
              <img
                key={index}
                alt="gallery view"
                src={image.url}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setIsViewerOpen(true);
                  setCurrentImage(index);
                }}
              />
            );
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
