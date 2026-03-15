import { useQuantityWithDebounce } from "../hooks/useQuantityWithDebounce.ts";
import { mapDTOToDisplay } from "../utils/mappers.ts";
import ProductImageAndDescription from "./ProductImageAndDescription";
import QuantitySelector from "./QuantitySelector";
import { ProductInCartDTO } from "../types/productInCartDTO";

interface CartItemRowProps {
  cartItem: ProductInCartDTO;
  onRemove: (itemId: string) => void;
  onQuantityChange: (itemId: string, newQuantity: number) => void;
}

const CartItemRow = ({
  cartItem,
  onRemove,
  onQuantityChange,
}: CartItemRowProps) => {
  const { debouncedQuantityChange } = useQuantityWithDebounce(
    cartItem.id,
    cartItem.quantity,
  );

  const handleQuantityChange = (newQuantity: number) => {
    onQuantityChange(cartItem.id, newQuantity);
    debouncedQuantityChange(newQuantity, (revertTo) =>
      onQuantityChange(cartItem.id, revertTo),
    );
  };

  return (
    <div className="cart-item-container">
      <ProductImageAndDescription
        item={mapDTOToDisplay(cartItem)}
        mode="cart"
      />
      <QuantitySelector
        className="cart-item"
        quantity={cartItem.quantity}
        onChange={handleQuantityChange}
      />
      <div className="cart-item-price">
        $
        {cartItem.price && cartItem.quantity
          ? (cartItem.price * cartItem.quantity).toFixed(2)
          : "0.00"}
      </div>

      <button
        className="close-btn cart-item"
        onClick={() => onRemove(cartItem.id)}
      >
        ✕
      </button>
    </div>
  );
};

export default CartItemRow;
