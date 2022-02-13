import { Router } from "express";
import {
  CreateCategoryController,
  DeleteCategoryController,
  GetCategoriesController,
  GetCategoryController,
  UpdateCategoryController,
} from "../controllers/category";
import { adminMiddleware, requireSignin } from "../middlewares/auth";
import { runValidation } from "../validators";
import {
  categoryCreateValidator,
  categoryUpdateValidator,
} from "../validators/category";

const CategoryRouter = Router();

CategoryRouter.post(
  "/",
  // categoryCreateValidator,
  // runValidation,
  requireSignin,
  adminMiddleware,
  CreateCategoryController
);

CategoryRouter.get(
  "/list",
  requireSignin,
  adminMiddleware,
  GetCategoriesController
);

CategoryRouter.get(
  "/:slug",
  requireSignin,
  adminMiddleware,
  GetCategoryController
);

CategoryRouter.put(
  "/:slug",
  categoryUpdateValidator,
  runValidation,
  requireSignin,
  adminMiddleware,
  UpdateCategoryController
);

CategoryRouter.delete(
  "/:slug",
  requireSignin,
  adminMiddleware,
  DeleteCategoryController
);

export default CategoryRouter;
