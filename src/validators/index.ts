import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

export const runValidation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const set = new Set();
    const errorMessages = errors
      .array()
      .filter(({ msg, param }) => {
        if (set.has(param)) return false;
        set.add(param);
        return msg;
      })
      .map(({ msg }) => msg);
    return res.status(400).json({
      errors: errorMessages,
    });
  }
  next();
};
