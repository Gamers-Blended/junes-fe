import React from "react";
import { useNavigate } from "react-router-dom";
import { Order } from "../types/order";
import {
  appendUrlPrefix,
  formatFullPlatformName,
  formatRegionName,
  formatEditionName,
  formatPrice,
} from "../utils/utils";
import { useAppDispatch } from "../store/hooks";
import { Item, setSelectedItem } from "../store/productSlice";

interface OrderTableProps {
  orderData: Order;
  mode: string;
}

const OrderTable: React.FC<OrderTableProps> = ({ orderData }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleNavigateToProduct = (item: Item) => {
    const url = `/games/${item.slug}`;
    dispatch(setSelectedItem(item));
    console.log(`Navigating to product details for ${item.name}`);
    navigate(url);
  };

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
          <div className="col-product transaction-item">
            <div className="transaction-item-image-wrapper">
              <img
                src={appendUrlPrefix(item.productImageUrl)}
                alt={item.name}
                className="transaction-item-image"
                onClick={() => handleNavigateToProduct(item)}
              />
            </div>
            <div className="transaction-item-details">
              <h3
                className="item-name"
                onClick={() => handleNavigateToProduct(item)}
              >
                {item.name}
              </h3>
              <p className="item-details">
                {formatFullPlatformName(item.platform)}
              </p>
              <p className="item-details">{formatRegionName(item.region)}</p>
              <p className="item-details">{formatEditionName(item.edition)}</p>
            </div>
          </div>
          <div className="col-qty">{item.quantity}</div>
          <div className="col-price">${formatPrice(item.price ?? 0)}</div>
          <div className="col-total">
            ${formatPrice((item.price ?? 0) * (item.quantity ?? 0))}
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
        <div className="col-total">
          ${formatPrice(orderData.shippingCost ?? 0)}
        </div>
      </div>

      <div className="table-footer">
        <div className="total-label">Total</div>
        <div className="total-amount">
          ${formatPrice(orderData.totalAmount)}
        </div>
      </div>
    </div>
  );
};

export default OrderTable;
