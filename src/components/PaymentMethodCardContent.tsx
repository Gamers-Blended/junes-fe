import React from "react";
import { PaymentMethod } from "../types/paymentMethod";

const PaymentMethodCardContent: React.FC<PaymentMethod> = (paymentMethod) => {
  return (
    <div className="saved-item-card-content">
      <div className="saved-item-card-name">{paymentMethod.cardType}</div>
      <div className="saved-item-card-details">
        <p>Credit card ending in {paymentMethod.cardLastFour}</p>
      </div>
    </div>
  );
};

export default PaymentMethodCardContent;
