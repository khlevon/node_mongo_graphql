import mongoose, { Schema, Document, Types } from "mongoose";
import { TComment } from "./comment.entity";

export interface IComment
  extends Omit<TComment, "ownerId" | "productId">,
    Document {
  id: Types.ObjectId;
  ownerId: Types.ObjectId;
  productId: Types.ObjectId;
}

const Comment = mongoose.model<IComment>(
  "Comment",
  new Schema(
    {
      body: {
        type: String,
        required: true,
      },
      productId: {
        type: Schema.Types.ObjectId,
        required: true,
      },
      ownerId: {
        type: Schema.Types.ObjectId,
        required: true,
      },
      replyToId: {
        type: Schema.Types.ObjectId,
        required: false,
      },
    },
    { timestamps: true, collection: "comments" }
  )
);

export default Comment;
