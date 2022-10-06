export type TProduct = {
  title: string;
  description?: string;

  price: number;
  discountPercentage?: number;

  stock: number;

  category: string;
  brand: string;

  thumbnail?: string;
  images: string[];

  isBlocked: boolean;
  ownerId: string;
};
