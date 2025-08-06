export interface ProductSliderItem {
  id: string;
  name: string;
  slug: string;
  platform: string;
  region: string;
  edition: string;
  price: number;
  productImageUrl: string;
}

export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
}