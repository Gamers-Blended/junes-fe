import { ProductDisplayItem } from "../types/productDisplay";
import { Item } from "../store/productSlice";
import { ProductInCartDTO } from "../types/productInCartDTO";
import { OrderItemDTO } from "../types/orderItemDTO";

export const mapItemToDisplay = (item: Item): ProductDisplayItem => item;

export const mapDTOToDisplay = (dto: ProductInCartDTO): ProductDisplayItem => ({
  productID: dto.id,
  name: dto.name,
  slug: dto.slug,
  price: dto.price,
  platform: dto.platform,
  region: dto.region,
  edition: dto.edition,
  productImageUrl: dto.productImageUrl,
  quantity: dto.quantity,
});

export const mapProductInCartDTOToOrderItemDTO = (
  dto: ProductInCartDTO,
): OrderItemDTO => ({
  productID: dto.id,
  quantity: dto.quantity,
});

export const mapProductInCartDTOToItemList = (
  dto: ProductInCartDTO,
): Item[] => [
  {
    productID: dto.id,
    name: dto.name,
    slug: dto.slug,
    price: dto.price,
    platform: dto.platform,
    region: dto.region,
    edition: dto.edition,
    productImageUrl: dto.productImageUrl,
    quantity: dto.quantity,
  },
];
