import { useState } from "react";
import { mockAddressList } from "../mocks/data/address";
import { mockPaymentMethodList } from "../mocks/data/paymentMethod";
import { SavedInfoType, SavedItemSelectorCaller } from "../utils/Enums";
import SavedItemSelector from "../components/SavedItemSelector";

const CheckoutPage = () => {
  const [selectedBillingAddressId, setSelectedBillingAddressId] = useState<
    string | null
  >(mockAddressList[0].id);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<
    string | null>(mockPaymentMethodList[0].id);

  const handleAddressSelection = (addressId: string) => {
    setSelectedBillingAddressId(addressId);
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
              initialSelectedId={selectedBillingAddressId}
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
      </div>
    </div>
  );
};

export default CheckoutPage;
