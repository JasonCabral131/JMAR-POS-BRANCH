import React from "react";
import Photogrid from "react-facebook-photo-grid";
const ImageComponent = ({ src }) => {
  return (
    <Photogrid
      images={[src]} //required
      // width={600} //optional according to your need
      //optional according to your need
    />
  );
};

export default ImageComponent;
