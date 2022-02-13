import { check } from "express-validator";

export const authRegisterValidator = [
  check("name").not().isEmpty().withMessage("Name is required"),
  check("email").not().isEmpty().withMessage("Email is required"),
  check("email").isEmail().withMessage("Email must be valid"),
  check("password").not().isEmpty().withMessage("Password is required"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

export const authLoginValidator = [
  check("email").not().isEmpty().withMessage("Email is required"),
  check("email").isEmail().withMessage("Email must be valid"),
  check("password").not().isEmpty().withMessage("Password is required"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];
export const forgetPasswordValidator = [
  check("email").not().isEmpty().withMessage("Email is required"),
  check("email").isEmail().withMessage("Email must be valid"),
];
export const resetPasswordValidator = [
  check("new_password").not().isEmpty().withMessage("Password is required"),
  check("new_password").isLength({ min: 6 }),
  check("reset_password_link")
    .not()
    .isEmpty()
    .withMessage("Reset password link is required"),
];
