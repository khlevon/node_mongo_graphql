import mongoose, { Schema, Document, Types } from "mongoose";
import { TRating } from "./rating.entity";

export interface IRating
  extends Omit<TRating, "productId" | "ownerId">,
    Document {
  id: Types.ObjectId;
  productId: Types.ObjectId;
  ownerId: Types.ObjectId;
}

const Rating = mongoose.model<IRating>(
  "Rating",
  new Schema(
    {
      score: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      productId: {
        type: Schema.Types.ObjectId,
        required: true,
      },
      ownerId: {
        type: Schema.Types.ObjectId,
        required: true,
      },
    },
    { timestamps: true, collection: "ratings" }
  )
);

export default Rating;
