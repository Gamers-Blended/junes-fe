import React from "react";
import { PaymentMethod } from "../types/paymentMethod";
import { CardType } from "../utils/Enums";

import visaIcon from "../assets/acceptedCardsIcons/visaIcon.png";
import masterCardIcon from "../assets/acceptedCardsIcons/masterCardIcon.png";
import americanExpressIcon from "../assets/acceptedCardsIcons/americanExpressIcon.png";
import dinnersClubIcon from "../assets/acceptedCardsIcons/dinersClubIcon.png";
import discoverIcon from "../assets/acceptedCardsIcons/discoverIcon.png";
import jcbIcon from "../assets/acceptedCardsIcons/jcbIcon.png";
import unionPayIcon from "../assets/acceptedCardsIcons/unionPayIcon.png";

const CARD_ICONS: Record<CardType, string> = {
  [CardType.VISA]: visaIcon,
  [CardType.MASTERCARD]: masterCardIcon,
  [CardType.AMEX]: americanExpressIcon,
  [CardType.DINERS_CLUB]: dinnersClubIcon,
  [CardType.DISCOVER]: discoverIcon,
  [CardType.JCB]: jcbIcon,
  [CardType.UNIONPAY]: unionPayIcon,
  [CardType.UNKNOWN]: "", // Fallback for unknown card types
};

const PaymentMethodCardContent: React.FC<PaymentMethod> = (paymentMethod) => {
  return (
    <div className="saved-item-card-content">
      <div className="saved-item-card-name">{paymentMethod.cardType}</div>
      <div className="saved-item-card-details">
        <p>Credit card ending in {paymentMethod.cardLastFour}</p>
      </div>
      <img
        src={CARD_ICONS[paymentMethod.cardType] ?? ""}
        alt={`${paymentMethod.cardType} card icon`}
        className="card-logo"
      />
    </div>
  );
};

export default PaymentMethodCardContent;
