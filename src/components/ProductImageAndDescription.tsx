import { Item, setSelectedItem } from "../store/productSlice";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../store/hooks";
import {
  appendUrlPrefix,
  formatFullPlatformName,
  formatRegionName,
  formatEditionName,
} from "../utils/utils";

interface ProductImageAndDescriptionProps {
  item: Item;
  mode: string;
}

const ProductImageAndDescription: React.FC<ProductImageAndDescriptionProps> = ({
  item,
  mode,
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleNavigateToProduct = (item: Item) => {
    const url = `/games/${item.slug}`;
    dispatch(setSelectedItem(item));
    console.log(`Navigating to product details for ${item.name}`);
    navigate(url);
  };
  return (
    <div
      key={item.productId}
      className={`transaction-item ${mode === "cart" ? "cart-item" : ""}`}
    >
      <div className="transaction-item-image-wrapper">
        <img
          src={appendUrlPrefix(item.productImageUrl)}
          alt={item.name}
          className="transaction-item-image"
          onClick={() => handleNavigateToProduct(item)}
        />
      </div>

      <div className="transaction-item-details">
        <h3 className="item-name" onClick={() => handleNavigateToProduct(item)}>
          {item.name}
        </h3>
        <p className="item-details">{formatFullPlatformName(item.platform)}</p>
        <p className="item-details">{formatRegionName(item.region)}</p>
        <p className="item-details">{formatEditionName(item.edition)}</p>
        {mode === "cart" ? null : (
          <p className="item-quantity">Qty: {item.quantity}</p>
        )}
      </div>
    </div>
  );
};

export default ProductImageAndDescription;
