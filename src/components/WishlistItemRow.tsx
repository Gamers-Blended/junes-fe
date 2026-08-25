import { useState } from "react";
import { mapProductInWishlistDTOToItem } from "../utils/mappers.ts";
import ProductImageAndDescription from "./ProductImageAndDescription";
import QuantitySelector from "./QuantitySelector";
import { ProductInWishlistDTO } from "../types/productInWishlistDTO";

interface WishlistItemRowProps {
  wishlistItem: ProductInWishlistDTO;
  onRemove: (itemId: string) => void;
  onAddToCart: (wishlistItem: ProductInWishlistDTO, quantity: number) => void;
  isAddingToCart: boolean;
}

const WishlistItemRow = ({
  wishlistItem,
  onRemove,
  onAddToCart,
  isAddingToCart,
}: WishlistItemRowProps) => {
  const [quantity, setQuantity] = useState<number>(1);

  return (
    <div className="cart-item-container">
      <ProductImageAndDescription
        item={mapProductInWishlistDTOToItem(wishlistItem)}
        mode="cart"
      />

      <QuantitySelector
        className="cart-item"
        quantity={quantity}
        onChange={setQuantity}
      />

      <div className="cart-item-price">${wishlistItem.price.toFixed(2)}</div>

      <button
        className={`common-button add-to-cart-button ${isAddingToCart ? "adding-to-cart" : ""}`}
        onClick={() => onAddToCart(wishlistItem, quantity)}
        disabled={isAddingToCart}
      >
        {isAddingToCart ? (
          <div className="add-to-cart-spinner-container">
            <div className="add-to-cart-spinner"></div>
          </div>
        ) : (
          "Add To Cart"
        )}
      </button>

      <button
        className="close-btn cart-item"
        onClick={() => onRemove(wishlistItem.id)}
      >
        ✕
      </button>
    </div>
  );
};

export default WishlistItemRow;
