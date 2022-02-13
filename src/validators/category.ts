import { check } from "express-validator";

export const categoryCreateValidator = [
  check("name").not().isEmpty().withMessage("Name is required"),
  check("image").not().isEmpty().withMessage("Image is required"),
  check("content").isLength({ min: 20 }).withMessage("Content is required"),
];

export const categoryUpdateValidator = [
  check("name").not().isEmpty().withMessage("Name is required"),
  check("content").isLength({ min: 20 }).withMessage("Content is required"),
];

// export const authLoginValidator = [
//   check("email").not().isEmpty().withMessage("Email is required"),
//   check("email").isEmail().withMessage("Email must be valid"),
//   check("password").not().isEmpty().withMessage("Password is required"),
//   check("password")
//     .isLength({ min: 6 })
//     .withMessage("Password must be at least 6 characters"),
// ];
// export const forgetPasswordValidator = [
//   check("email").not().isEmpty().withMessage("Email is required"),
//   check("email").isEmail().withMessage("Email must be valid"),
// ];
// export const resetPasswordValidator = [
//   check("new_password").not().isEmpty().withMessage("Password is required"),
//   check("new_password").isLength({ min: 6 }),
//   check("reset_password_link")
//     .not()
//     .isEmpty()
//     .withMessage("Reset password link is required"),
// ];

// export const runValidation = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     const set = new Set();
//     const errorMessages = errors
//       .array()
//       .filter(({ msg, param }) => {
//         if (set.has(param)) return false;
//         set.add(param);
//         return msg;
//       })
//       .map(({ msg }) => msg);
//     return res.status(400).json({
//       errors: errorMessages,
//     });
//   }
//   next();
// };
