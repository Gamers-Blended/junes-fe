export interface HistoryItem {
  productID: string;
  viewAt: string; // ISO string
}

export interface RecommendedProductRequestDTO {
  historyCache: HistoryItem[];
}
