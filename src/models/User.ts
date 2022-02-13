import crypto from "crypto";
import { Document, model, Schema } from "mongoose";

export interface IUser {
  _id?: any;
  username: string;
  name: string;
  email: string;
  hashed_password: string;
  salt: string;
  role: string;
  reset_password_link: string;
  _password?: string;
  password?: string;
  makeSalt?: () => string;
  encryptPassword?: (password: string) => string;
}

interface IUserDocument extends IUser, Document {
  encryptPassword: (password: string) => string;
  makeSalt: () => string;
  authenticate: (plainText: string) => string;
}

const UserSchema = new Schema<IUserDocument>(
  {
    username: {
      type: String,
      trim: true,
      required: true,
      max: 12,
      unique: true,
      index: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      max: 32,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    hashed_password: {
      type: String,
      required: true,
    },
    salt: String,
    role: {
      type: String,
      default: "SUBSCRIBER",
    },
    reset_password_link: {
      data: String,
      default: "",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

// Virtual fields - is a document that we can set/get but not persisted in DB
UserSchema.virtual("password")
  .set(function (this: IUserDocument, password: string): void {
    this!._password = password;

    // generate salt
    this.salt = this.makeSalt();

    // encrypt password
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function (this: IUserDocument) {
    return this._password;
  });

// Schema Methods > authenticate, encryptPassword, makeSalt
UserSchema.methods.encryptPassword = function (password: string) {
  if (!password) return "";
  try {
    return crypto.createHmac("sha1", this.salt).update(password).digest("hex");
  } catch (error) {
    return "";
  }
};
UserSchema.methods.makeSalt = function () {
  return Math.round(new Date().valueOf() * Math.random()) + "";
};
UserSchema.methods.authenticate = function (plainText: string) {
  return this.encryptPassword(plainText) === this.hashed_password;
};

// UserSchema.methods = {
//   encryptPassword(this: IUserDocument, password: string): string {
//     console.log("🚀 ~ file: User.ts ~ line 98 ~ password", password);
//     if (!password) return "";
//     try {
//       return crypto
//         .createHmac("sha1", this.salt)
//         .update(password)
//         .digest("hex");
//     } catch (error) {
//       console.log("🚀 ~ file: User.ts ~ line 105 ~ error", error);
//       return "";
//     }
//   },
//   makeSalt(): string {
//     return Math.round(new Date().valueOf() * Math.random()) + "";
//   },
//   authenticate(this: IUserDocument, plainText: string) {
//     return this.encryptPassword(plainText) === this.hashed_password;
//   },
// };

const User = model<IUserDocument>("user", UserSchema);

export default User;
