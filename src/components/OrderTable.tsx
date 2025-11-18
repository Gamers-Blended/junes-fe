import React from "react";
import { Order } from "../types/order";

interface OrderTableProps {
  orderData: Order;
  mode: string;
}

const OrderTable: React.FC<OrderTableProps> = ({ orderData }) => {
  return (
    <div className="order-items-table">
      <div className="table-header">
        <div className="col-product">Product Name</div>
        <div className="col-qty">Qty.</div>
        <div className="col-price">Price/Unit</div>
        <div className="col-total">Price</div>
      </div>

      {/* Items */}
      {orderData.items.map((item) => (
        <div key={item.id} className="table-row">
          <div className="col-product">
            <div className="transaction-item-image-wrapper">
              <img
                src={item.productImageUrl}
                alt={item.name}
                className="transaction-item-image"
              />
            </div>
            <div className="transaction-item-details">
              <h3 className="item-name">{item.name}</h3>
              <p className="item-details">{item.platform}</p>
              <p className="item-details">{item.region}</p>
              <p className="item-details">{item.edition}</p>
            </div>
          </div>
          <div className="col-qty">{item.quantity}</div>
          <div className="col-price">${(item.price ?? 0).toFixed(2)}</div>
          <div className="col-total">
            ${((item.price ?? 0) * (item.quantity ?? 0)).toFixed(2)}
          </div>
        </div>
      ))}

      {/* Shipping */}
      <div className="table-row">
        <div className="col-product">
          <strong>Shipping</strong>
        </div>

        <div className="col-qty"></div>
        <div className="col-price"></div>
        <div className="col-total">${(orderData.shippingCost ?? 0).toFixed(2)}</div>
      </div>

      <div className="table-footer">
        <div className="total-label">Total</div>
        <div className="total-amount">${orderData.totalAmount.toFixed(2)}</div>
      </div>
    </div>
  );
};

export default OrderTable;
