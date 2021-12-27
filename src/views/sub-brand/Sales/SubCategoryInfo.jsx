import React from "react";
import { Carousel } from "react-bootstrap";

export const SubCategoryCarouselInfo = ({ product }) => {
  return product ? (
    <Carousel className="w-100">
      {product.images.map((data) => {
        return (
          <Carousel.Item>
            <img
              className="d-block w-100"
              src={data.img}
              alt={product.subcategory}
              style={{ height: "450px" }}
            />
            <Carousel.Caption>
              <h3>{""}</h3>
              <p dangerouslySetInnerHTML={{ __html: product.description }} />
            </Carousel.Caption>
          </Carousel.Item>
        );
      })}
    </Carousel>
  ) : null;
};
