import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import AuthConfig from "../config/auth.config";
import { UserModel } from "../models/user.model";
import { addUser } from "./users.controller";
import baseController from "./base.controller";
import AppError from "../utils/app-error";

const registerUser = (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;

  try {
    UserModel.findOne({ email: email }).then((userDoc) => {
      if (userDoc) {
        return res.status(302).json({
          message: "There is a user with this email",
        });
      }

      addUser(req, res, next);
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    const doc = await baseController.findOne({
      model: UserModel,
      searchCriteria: { email: email },
      next,
    });

    if (doc) {
      bcrypt
        .compare(password, doc.password)
        .then((doMatch) => {
          if (!doMatch) {
            next(new AppError(401, "fail", "Wrong email or password"));
          } else {
            const token = jwt.sign(
              JSON.stringify({
                userId: doc._id,
                userEmail: doc.email,
              }),
              AuthConfig.TOKEN_KEY as string
            );

            res.status(200).json({
              status: "success",
              token,
            });
          }
        })
        .catch((error) => {
          next(error);
        });
    }
  } catch (error) {
    next(error);
  }
};

export { registerUser, loginUser };
