import { Router } from "express";
import { MeController } from "../controllers/user";
import { authMiddleware, requireSignin } from "../middlewares/auth";

const UserRoute = Router();

UserRoute.get("/me", requireSignin, authMiddleware, MeController);

export default UserRoute;
