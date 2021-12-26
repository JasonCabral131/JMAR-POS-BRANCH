import React from "react";
import { Carousel } from "react-bootstrap";

export const ProductCarouselInfo = ({ product }) => {
  return product ? (
    <Carousel className="w-100">
      {product.images.map((data) => {
        return (
          <Carousel.Item>
            <img
              className="d-block w-100"
              src={data.img}
              alt={product.product}
              style={{ height: "450px" }}
            />
            <Carousel.Caption>
              <h3>{product.product}</h3>
              <p dangerouslySetInnerHTML={{ __html: product.product }} />
            </Carousel.Caption>
          </Carousel.Item>
        );
      })}
    </Carousel>
  ) : null;
};
