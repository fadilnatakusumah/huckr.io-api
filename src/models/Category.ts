import crypto from "crypto";
import { Document, model, Schema, SchemaType, SchemaTypes } from "mongoose";
import { IUser } from "./User";

export interface ICategory {
  name: string;
  slug: string;
  image: { url: string; key: string };
  content: string;
  posted_by: IUser;
  // email: string;
  // hashed_password: string;
  // salt: string;
  // role: string;
  // reset_password_link: string;
  // _password?: string;
  // password?: string;
  // makeSalt?: () => string;
  // encryptPassword?: (password: string) => string;
}

interface ICategoryDocument extends ICategory, Document {
  encryptPassword: (password: string) => string;
  makeSalt: () => string;
  authenticate: (plainText: string) => string;
}

const CategorySchema = new Schema<ICategoryDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      max: 32,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    image: {
      url: String,
      key: String,
    },
    content: {
      type: String,
      min: 20,
      max: 2000000,
    },
    posted_by: {
      type: SchemaTypes.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

const Category = model<ICategoryDocument>("category", CategorySchema);

export default Category;
