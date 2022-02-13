// ts-ignore-no-unused-parameters
import AWS from "aws-sdk";
import { Request, Response } from "express";
import { decode, sign, verify } from "jsonwebtoken";
import shortid from "shortid";
import {
  getEmailForgotPassword,
  getEmailRegistrationParams,
} from "../helpers/email-tempates";
import User from "../models/User";

const SES = new AWS.SES({ apiVersion: "2010-12-01" });

interface IRegisterBody {
  email: string;
  password: string;
  name: string;
}

export const RegisterController = async (req: Request, res: Response) => {
  const { email, password, name } = req.body as IRegisterBody;

  try {
    // check if user is exist in db
    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
      return res.status(404).json({
        message: "user is already exist",
      });
    }

    // generate token with user name email and password
    const token = sign(
      { name, email, password },
      process.env.JWT_ACCOUNT_ACTIVATION!,
      {
        expiresIn: "10h",
      }
    );

    const params = getEmailRegistrationParams(name, email, token);

    const sendEmailRegistration = SES.sendEmail(params).promise();

    return sendEmailRegistration
      .then((_resp) => {
        res.json({ message: `email has been sent to ${email}` });
      })
      .catch((_err) => {
        res
          .status(401)
          .json({ message: "we can't verify your email, please try again" });
      });
  } catch (error) {
    return res.status(500).json({
      message: "something went wrong when sending email registration",
    });
  }
};

export const ActivationController = async (req: Request, res: Response) => {
  const { token } = req.body;

  try {
    const decoded = verify(token, process.env.JWT_ACCOUNT_ACTIVATION!);
    const { email, name, password } = decoded as IRegisterBody;
    const username = shortid.generate();
    const isUserExist = await User.findOne({ email });
    if (isUserExist)
      return res.status(401).json({ message: "email has already taken" });

    try {
      const newUser = new User({
        name,
        email,
        password,
        username,
      });

      await newUser.save();

      res.json({ message: "success registering user" });
    } catch (error) {
      return res
        .status(401)
        .json({ message: "error when creating user, try again later" });
    }

    // register user
  } catch (error) {
    return res.status(404).json({ message: "link has expired" });
  }
};

export const LoginController = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "user is not exist",
      });
    }

    // aunthetiucate
    if (!user.authenticate(password))
      return res.status(400).json({
        message: "email and password don't match",
      });

    // generate token for client
    const token = sign({ _id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    const { _id, name, role } = user;
    return res.json({
      message: "success login",
      data: {
        user: { id: _id, role, name, email },
        token,
      },
    });
  } catch (_error) {
    return res.status(500).json({
      message: "something went wrong when finding user",
    });
  }
};

export const ForgotPasswordController = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "user is not exist",
      });
    }

    // generate token for client
    const token = sign({ name: user.name }, process.env.JWT_RESET_PASSWORD!, {
      expiresIn: "10m",
    });

    await user.updateOne({ reset_password_link: token });

    const params = getEmailForgotPassword(user.name, user.email, token);
    const sendEmailConfirmation = SES.sendEmail(params).promise();

    return sendEmailConfirmation
      .then((_resp) => {
        res.json({ message: `email reset password has been sent to ${email}` });
      })
      .catch((_err) => {
        res
          .status(401)
          .json({ message: "we can't verify your email, please try again" });
      });
  } catch (_error) {
    return res.status(500).json({
      message: "something went wrong when finding user",
    });
  }
};

export const ResetPasswordController = async (req: Request, res: Response) => {
  const { new_password, reset_password_link } = req.body;

  try {
    const user = await User.findOne({ reset_password_link });

    if (!user) {
      return res.status(400).json({
        message: "invalid token. please try again",
      });
    }

    try {
      // check expiration token
      verify(reset_password_link, process.env.JWT_RESET_PASSWORD!);

      user.password = new_password;
      user.reset_password_link = "";
      await user.save();

      return res.json({ message: "success resetting password" });
    } catch (error) {
      return res.status(400).json({
        message: "link is expired. please try again",
      });
    }
  } catch (_error) {
    return res.status(500).json({
      message: "something went wrong when finding user",
    });
  }
};
