import React from "react";
import { Address } from "../types/address";

const AddressCardContent: React.FC<Address> = (address) => {
  return (
    <div className="saved-item-card-content">
      <div className="saved-item-card-name">{address.name}</div>
      <div className="saved-item-card-details">
        <p>{address.addressLine}</p>
        {address.unitNumber && <p>{address.unitNumber}</p>}
        <p>{address.country}</p>
        <p>{address.zipCode}</p>
        <p>{address.phoneNumber}</p>
      </div>
    </div>
  );
};

export default AddressCardContent;
