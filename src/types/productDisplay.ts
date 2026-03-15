export interface ProductDisplayItem {
    productID: string;
    name: string;
    slug: string;
    price?: number;
    platform: string;
    region: string;
    edition: string;
    productImageUrl: string;
    quantity?: number;
}