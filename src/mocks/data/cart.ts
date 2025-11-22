import { CartItem } from "../../types/cartItem";
import { Item } from "../../store/productSlice";

const mockItem1: Item = {
  id: "65f8a12b3e5d827b94c8f2a2",
  name: "Baten Kaitos I & II HD Remaster",
  price: 49.99,
  slug: "baten-kaitos-i-and-ii-hd-remaster",
  platform: "nsw",
  region: "us",
  edition: "std",
  productImageUrl: "nsw_asia_std_baten_kaitos_i_ii_hd_remaster.jpg",
  quantity: 1,
};

const mockItem2: Item = {
  id: "681a55f2cb20535492b5e68c",
  name: "Final Fantasy Pixel Remaster",
  price: 79.99,
  slug: "final-fantasy-pixel-remaster",
  platform: "nsw",
  region: "asia",
  edition: "std",
  productImageUrl: "nsw_asia_std_final_fantasy_pixel_remaster_collection.jpg",
  quantity: 2,
};

export const mockCartItemList: CartItem[] = [
  {
    item: mockItem1,
    userId: 1,
  },
  {
    item: mockItem2,
    userId: 1,
  },
];

export const emptyCartList: CartItem[] = [];
