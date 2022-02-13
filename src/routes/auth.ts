import { Router } from "express";

import {
  ActivationController,
  ForgotPasswordController,
  LoginController,
  RegisterController,
  ResetPasswordController,
} from "../controllers/auth";
import { requireSignin } from "../middlewares/auth";
import { runValidation } from "../validators";
import {
  authLoginValidator,
  authRegisterValidator,
  forgetPasswordValidator,
  resetPasswordValidator,
} from "../validators/auth";

const AuthRoute = Router();

AuthRoute.post(
  "/register",
  authRegisterValidator,
  runValidation,
  RegisterController
);

AuthRoute.post("/login", authLoginValidator, runValidation, LoginController);
AuthRoute.post("/activate", ActivationController);
AuthRoute.put(
  "/forgot-password",
  forgetPasswordValidator,
  runValidation,
  ForgotPasswordController
);
AuthRoute.post(
  "/reset-password",
  resetPasswordValidator,
  runValidation,
  ResetPasswordController
);
// AuthRoute.post("/me", MeController);

export default AuthRoute;
