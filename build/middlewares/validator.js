"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runValidation = exports.authLoginValidator = exports.authRegisterValidator = void 0;
const express_validator_1 = require("express-validator");
exports.authRegisterValidator = [
    (0, express_validator_1.check)("name").not().isEmpty().withMessage("Name is required"),
    (0, express_validator_1.check)("email").not().isEmpty().withMessage("Email is required"),
    (0, express_validator_1.check)("email").isEmail().withMessage("Email must be valid"),
    (0, express_validator_1.check)("password").not().isEmpty().withMessage("Password is required"),
    (0, express_validator_1.check)("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),
];
exports.authLoginValidator = [
    (0, express_validator_1.check)("email").not().isEmpty().withMessage("Email is required"),
    (0, express_validator_1.check)("email").isEmail().withMessage("Email must be valid"),
    (0, express_validator_1.check)("password").not().isEmpty().withMessage("Password is required"),
    (0, express_validator_1.check)("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),
];
const runValidation = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const set = new Set();
        const errorMessages = errors
            .array()
            .filter(({ msg, param }) => {
            if (set.has(param))
                return false;
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
exports.runValidation = runValidation;
