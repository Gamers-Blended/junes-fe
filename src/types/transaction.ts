import { Order } from "./order";

export interface TransactionHistoryParams {
    page?: number;
    sort?: string;
    size?: number;
}

export interface TransactionHistoryResponse {
    content: Order[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
}