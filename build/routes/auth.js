"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../controllers/auth");
const validator_1 = require("../middlewares/validator");
const AuthRoute = (0, express_1.Router)();
AuthRoute.post("/register", validator_1.authRegisterValidator, validator_1.runValidation, auth_1.RegisterController);
AuthRoute.post("/login", validator_1.authLoginValidator, validator_1.runValidation, auth_1.LoginController);
AuthRoute.post("/activate", auth_1.ActivationController);
exports.default = AuthRoute;
