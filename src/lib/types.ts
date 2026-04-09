import type { PRODUCT, SIZES } from "@/lib/product";

export type Size = (typeof SIZES)[number];

export type CartItem = {
  id: string;
  name: string;
  imageSrc: string;
  priceCents: number;
  priceFormatted: string;
  size: Size;
  quantity: number;
};

export type Product = typeof PRODUCT;