import { CardType } from "./Enums";

export const getCardType = (cardNumber: string): string => {
    // Remove spaces and dashes from the card number
    const cleaned = cardNumber.replace(/[\s-]/g, "");

    const patterns: { type: CardType; pattern: RegExp }[] = [
        // Visa: starts with 4
        { type: CardType.VISA, pattern: /^4[0-9]{12}(?:[0-9]{3})?$/ },

        // MasterCard: starts with 51-55 or 2221-2720
        { type: CardType.MASTERCARD, pattern: /^(5[1-5]|2(2[2-9][1-9]|[3-6]\d{2}|7[01]\d|720))/ },
        
        // American Express: starts with 34 or 37
        { type: CardType.AMEX, pattern: /^3[47]/ },
        
        // Discover: starts with 6011, 622126-622925, 644-649, or 65
        { type: CardType.DISCOVER, pattern: /^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9([01][0-9]|2[0-5]))|64[4-9]|65)/ },
        
        // JCB: starts with 3528-3589
        { type: CardType.JCB, pattern: /^35(2[89]|[3-8][0-9])/ },

        // Diners Club: starts with 300-305, 36, or 38
        { type: CardType.DINERS_CLUB, pattern: /^(3(0[0-5]|[68]))/ },

        // UnionPay: starts with 62
        { type: CardType.UNIONPAY, pattern: /^62/ },
    ]

    for (const { type, pattern } of patterns) {
        if (pattern.test(cleaned)) {
            return type;
        }
    }

    return CardType.UNKNOWN;
};