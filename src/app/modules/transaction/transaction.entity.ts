export type TTransactionProduct = {
  quantity: number;
  amount: number;

  productId: string;
};

export type TTransaction = {
  totalAmount: number;
  products: TTransactionProduct[];

  ownerId: string;
};
