import { useParams } from "react-router-dom";

const ProductPage = () => {
  // Get route parameters
  const { id } = useParams<{ id: string }>();

  const productDetails: { [key: number]: { name: string; description: string }} = {
    1: { name: "Venus", description: "Venus" },
    2: { name: "Weekly Promo", description: "Weekly Promo" },
    3: { name: "Easter", description: "Easter" },
    4: { name: "Ninja Gaiden II Black", description: "NG 2" },
  };

  // Convert id to number and access productDetails
  const product = productDetails[Number(id)];

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
