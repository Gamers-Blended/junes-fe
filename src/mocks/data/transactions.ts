import { TransactionHistoryResponse } from "../../types/transaction";
import { mockOrderList } from "./orders";

export const mockTransactionHistory: TransactionHistoryResponse = {
  content: mockOrderList,
  totalElements: mockOrderList.length,
  totalPages: 1,
  size: mockOrderList.length,
  number: 0,
  first: true,
  last: true,
};
