export interface ProductSliderItem {
  productID: string;
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
  releaseDate: string;
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
  productID: string;
  name: string;
  price: number;
  platform: string;
  region: string;
  edition: string;
  releaseDate: string;
  languages: string[];
  stock: number;
  productImageUrl: string;
  editionNotes: string;
}

export interface ProductDetailsResponse {
  productDTO: ProductDTO;
  productVariantDTOList: ProductVariantDTO[];
}
