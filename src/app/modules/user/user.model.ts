import mongoose, { Schema, Document, Types } from "mongoose";
import { EUserGender, EUserRole, TUser } from "./user.entity";

export interface IUser extends TUser, Document {
  id: Types.ObjectId;
}

const User = mongoose.model<IUser>(
  "User",
  new Schema(
    {
      email: {
        type: String,
        required: true,
        unique: true,
      },
      username: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
        required: true,
      },
      passwordSalt: {
        type: String,
        required: true,
      },

      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
      middleName: {
        type: String,
      },
      gender: {
        type: String,
        enum: Object.values(EUserGender),
        required: true,
      },
      balance: {
        type: Number,
        required: true,
        default: 0,
      },
      birthDate: {
        type: Date,
      },
      image: {
        type: String,
      },

      userAgent: {
        type: String,
        required: true,
      },
      isBlocked: {
        type: Boolean,
        required: true,
        default: false,
      },
      role: {
        type: String,
        enum: Object.values(EUserRole),
        required: true,
        default: EUserRole.USER,
      },
    },
    { timestamps: true, collection: "users" }
  )
);

export default User;
