"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginController = exports.ActivationController = exports.RegisterController = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const jsonwebtoken_1 = require("jsonwebtoken");
const shortid_1 = __importDefault(require("shortid"));
const User_1 = __importDefault(require("../models/User"));
const email_tempates_1 = require("../helpers/email-tempates");
const SES = new aws_sdk_1.default.SES({ apiVersion: "2010-12-01" });
const RegisterController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, name } = req.body;
    try {
        // check if user is exist in db
        const isUserExist = yield User_1.default.findOne({ email });
        if (isUserExist) {
            return res.status(404).json({
                message: "user is already exist",
            });
        }
        // generate token with user name email and password
        const token = (0, jsonwebtoken_1.sign)({ name, email, password }, process.env.JWT_ACCOUNT_ACTIVATION, {
            expiresIn: "10h",
        });
        const params = (0, email_tempates_1.getEmailRegistrationParams)(name, email, token);
        const sendEmailRegistration = SES.sendEmail(params).promise();
        return sendEmailRegistration
            .then((resp) => {
            res.json({ message: `email has been sent to ${email}` });
        })
            .catch((err) => {
            console.error(err);
            res.json({ message: "we can't verify your email, please try again" });
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "something went wrong when sending email registration",
        });
    }
});
exports.RegisterController = RegisterController;
const ActivationController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.body;
    try {
        (0, jsonwebtoken_1.verify)(token, process.env.JWT_ACCOUNT_ACTIVATION);
        const decoded = (0, jsonwebtoken_1.decode)(token);
        const { email, name, password } = decoded;
        const username = shortid_1.default.generate();
        const isUserExist = yield User_1.default.findOne({ email });
        if (isUserExist)
            return res.status(401).json({ message: "email has already taken" });
        try {
            const newUser = new User_1.default({
                name,
                email,
                password,
                username,
            });
            yield newUser.save();
            res.json({ message: "success registering user" });
        }
        catch (error) {
            return res
                .status(401)
                .json({ message: "error when creating user, try again later" });
        }
        // register user
    }
    catch (error) {
        return res.status(404).json({ message: "link has expired" });
    }
});
exports.ActivationController = ActivationController;
const LoginController = (req, res) => {
    // const { email, body } = req.body;
    return res.json({
        data: req.body,
    });
};
exports.LoginController = LoginController;
