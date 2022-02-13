"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
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
}, {
    timestamps: true,
    toJSON: { virtuals: true },
});
// Virtual fields - is a document that we can set/get but not persisted in DB
UserSchema.virtual("password")
    .set(function (password) {
    this._password = password;
    // generate salt
    this.salt = this.makeSalt();
    // encrypt password
    this.hashed_password = this.encryptPassword(password);
})
    .get(function () {
    return this._password;
});
// Schema Methods > authenticate, encryptPassword, makeSalt
UserSchema.methods.encryptPassword = function (password) {
    if (!password)
        return "";
    try {
        return crypto_1.default.createHmac("sha1", this.salt).update(password).digest("hex");
    }
    catch (error) {
        return "";
    }
};
UserSchema.methods.makeSalt = function () {
    return Math.round(new Date().valueOf() * Math.random()) + "";
};
UserSchema.methods.authenticate = function (plainText) {
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
const User = (0, mongoose_1.model)("user", UserSchema);
exports.default = User;
