import mongoose, { Schema, Document, Types } from "mongoose";
import { TProduct } from "./product.entity";

export interface IProduct extends Omit<TProduct, "ownerId">, Document {
  id: Types.ObjectId;
  ownerId: Types.ObjectId;
}

const Product = mongoose.model<IProduct>(
  "Product",
  new Schema(
    {
      title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
      },
      category: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      discountPercentage: {
        type: Number,
      },
      stock: {
        type: Number,
        required: true,
      },
      brand: {
        type: String,
        required: true,
      },
      thumbnail: {
        type: String,
      },
      images: {
        type: [String],
      },
      ownerId: {
        type: Schema.Types.ObjectId,
        required: true,
      },
      isBlocked: {
        type: Boolean,
        required: true,
        default: false,
      },
    },
    { timestamps: true, collection: "products" }
  )
);

export default Product;
