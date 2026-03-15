import { ProductInCartDTO } from "../../types/productInCartDTO";

export const mockCartItemList: ProductInCartDTO[] = [
  {
    id: "65f8a12b3e5d827b94c8f2a2",
    name: "Baten Kaitos I & II HD Remaster",
    slug: "baten-kaitos-i-and-ii-hd-remaster",
    price: 49.99,
    platform: "nsw",
    region: "us",
    edition: "std",
    productImageUrl: "nsw_asia_std_baten_kaitos_i_ii_hd_remaster.jpg",
    quantity: 1,
    createdOn: "2024-06-01T12:00:00Z",
  },
  {
    id: "681a55f2cb20535492b5e68c",
    name: "Final Fantasy Pixel Remaster",
    slug: "final-fantasy-pixel-remaster",
    price: 79.99,
    platform: "nsw",
    region: "asia",
    edition: "std",
    productImageUrl: "nsw_asia_std_final_fantasy_pixel_remaster_collection.jpg",
    quantity: 2,
    createdOn: "2024-06-02T15:30:00Z",
  },
];