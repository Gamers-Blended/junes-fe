import React, { useState } from "react";

interface QuantitySelectorProps {
  initialQuantity?: number;
  minQuantity?: number;
  maxQuantity?: number;
  onChange?: (quantity: number) => void;
  className?: string;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  initialQuantity = 1,
  minQuantity = 1,
  maxQuantity,
  onChange,
  className = "",
}) => {
  const [quantity, setQuantity] = useState<number>(initialQuantity);

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;

    // Check newQuantity is within limits
    if (
      newQuantity >= minQuantity &&
      (!maxQuantity || newQuantity <= maxQuantity)
    ) {
      setQuantity(newQuantity);
      onChange?.(newQuantity);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || minQuantity;
    const clampedValue = Math.max(
      minQuantity,
      maxQuantity ? Math.min(value, maxQuantity) : value
    );

    setQuantity(clampedValue);
    onChange?.(clampedValue);
  };

  return (
    <div className={`quantity-container ${className}`}>
      <label className={`option-label ${className}`}>Quantity</label>
      <div className="quantity-selector">
        <button
          className="quantity-btn"
          onClick={() => handleQuantityChange(-1)}
          disabled={quantity <= minQuantity}
        >
          -
        </button>
        <input
          className="quantity-input"
          type="number"
          value={quantity}
          onChange={handleInputChange}
        />
        <button
          className="quantity-btn"
          onClick={() => handleQuantityChange(1)}
          disabled={maxQuantity !== undefined && quantity >= maxQuantity}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default QuantitySelector;
