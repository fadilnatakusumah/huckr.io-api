import { Router } from "express";
import AuthRoute from "./auth";
import UserRoute from "./user";
import CategoryRoute from "./category";

const APIRoutes = Router();

APIRoutes.use("/auth", AuthRoute);
APIRoutes.use("/user", UserRoute);
APIRoutes.use("/category", CategoryRoute);

export default APIRoutes;
