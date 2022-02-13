import { NextFunction, Request, Response } from "express";
import expressJWT from "express-jwt";
import User, { IUser } from "../models/User";

export const requireSignin = expressJWT({
  secret: process.env.JWT_SECRET!,
  algorithms: ["HS256"],
});

export interface MyRequest extends Request {
  user?: { _id?: string };
  profile?: IUser;
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authUserId = (req as MyRequest).user?._id;
    const user = await User.findById(authUserId).select(
      "name username email createdAt updatedAt role"
    );
    if (!user) return res.status(400).json({ message: "user not found" });
    (req as MyRequest).profile = user;
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "something went wrong when getting user" });
  }
};

export const adminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authAdminId = (req as MyRequest).user?._id;
    const user = await User.findById(authAdminId);
    if (!user) return res.status(400).json({ message: "user not found" });

    if (user.role !== "ADMIN") {
      return res.status(403).json({ message: "user not authorized" });
    }
    (req as MyRequest).profile = user;
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "something went wrong when getting user" });
  }
};
