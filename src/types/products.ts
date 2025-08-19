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

export interface ProductDTO {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  platform: string;
  region: string;
  edition: string;
  publisher: string;
  releaseDate: number[];
  series: string[];
  genres: string[];
  languages: string[];
  numberOfPlayers: string[];
  unitsSold: number;
  stock: number;
  imageUrlList: string[];
  editionNotes: string;
  createdOn: string;
}

export interface ProductVariantDTO {
  platform: string;
  region: string;
  edition: string;
  price: number;
  stock: number;
  productImageUrl: string;
}

export interface ProductDetailsResponse {
  productDTO: ProductDTO;
  productVariantDTOList: ProductVariantDTO[];
}
