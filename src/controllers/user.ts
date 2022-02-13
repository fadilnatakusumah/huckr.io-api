import { Request, Response } from "express";
import { MyRequest } from "../middlewares/auth";

export const MeController = (req: Request, res: Response) => {
  res.json({
    message: "success get profile",
    data: (req as MyRequest).profile,
  });
};
