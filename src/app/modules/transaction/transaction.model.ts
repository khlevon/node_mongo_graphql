import mongoose, { Schema, Document, Types } from "mongoose";
import { TTransaction } from "./transaction.entity";

export interface ITransaction extends Omit<TTransaction, "ownerId">, Document {
  id: Types.ObjectId;
  ownerId: Types.ObjectId;
}

const Transaction = mongoose.model<ITransaction>(
  "Transaction",
  new Schema(
    {
      ownerId: {
        type: Schema.Types.ObjectId,
        required: true,
      },
      products: {
        type: [
          {
            productId: {
              type: Schema.Types.ObjectId,
              required: true,
            },
            quantity: {
              type: Number,
              required: true,
            },
            amount: {
              type: Number,
              required: true,
            },
          },
        ],
        required: true,
      },
      totalAmount: {
        type: Number,
        required: true,
      },
    },
    { timestamps: true, collection: "transactions" }
  )
);

export default Transaction;
