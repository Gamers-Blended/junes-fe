import React from "react";
import { useParams } from "react-router-dom";

const ProductPage = () => {
  // Get route parameters
  const { id } = useParams();

  const productDetails = {
    1: { name: "Venus", description: "Venus" },
    2: { name: "Weekly Promo", description: "Weekly Promo" },
    3: { name: "Easter", description: "Easter" },
    4: { name: "Ninja Gaiden II Black", description: "NG 2" },
  };

  const product = productDetails[id];

  if (!product) {
    return <div>Product not found.</div>;
  }

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
    </div>
  );
};

export default ProductPage;
