import { useState } from "react";
import { mockAddressList } from "../mocks/data/address";
import { mockPaymentMethodList } from "../mocks/data/paymentMethod";
import { mockOrderList } from "../mocks/data/orders";
import {
  SavedInfoType,
  SavedItemSelectorCaller,
  OrderTableMode,
} from "../utils/Enums";
import SavedItemSelector from "../components/SavedItemSelector";
import OrderTable from "../components/OrderTable";

const CheckoutPage = () => {
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    mockAddressList[0].id
  );
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<
    string | null
  >(mockPaymentMethodList[0].id);

  const handleAddressSelection = (addressId: string) => {
    setSelectedAddressId(addressId);
    console.log("Selected address ID:", addressId);
  };

  const handlePaymentMethodSelection = (paymentMethodId: string) => {
    setSelectedPaymentMethodId(paymentMethodId);
    console.log("Selected payment method ID:", paymentMethodId);
  };

  return (
    <div className="checkout-page-container">
      <div className="common-header">
        <h1>CHECKOUT</h1>
      </div>

      <div className="content-wrapper">
        <div className="left-column">
          <div className="component-box">
            <SavedItemSelector
              mode={SavedInfoType.ADDRESS}
              caller={SavedItemSelectorCaller.CHECKOUT}
              items={mockAddressList}
              initialSelectedId={selectedAddressId}
              onItemSelect={handleAddressSelection}
              showConfirmButton={true}
              className="checkout-page"
            />

            <SavedItemSelector
              mode={SavedInfoType.PAYMENT}
              caller={SavedItemSelectorCaller.CHECKOUT}
              items={mockPaymentMethodList}
              initialSelectedId={selectedPaymentMethodId}
              onItemSelect={handlePaymentMethodSelection}
              showConfirmButton={true}
              className="checkout-page"
            />
          </div>
        </div>

        <div className="right-column">
          <OrderTable
            orderData={mockOrderList[0]}
            mode={OrderTableMode.INVOICE}
          />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
