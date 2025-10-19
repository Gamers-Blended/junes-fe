import React from "react";
import { Address } from "../types/address";

const AddressCardContent: React.FC<Address> = (address) => {
  return (
    <div className="card-content">
      <div className="address-name">{address.name}</div>
      <div className="address-details">
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
