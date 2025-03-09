import baseController from "./base.controller";
import { UserModel } from "../models/user.model";
import { userCriteria } from "../validators/users.validators";
import { NextFunction, Request, Response } from "express";
import AppError from "../utils/app-error";
import { GenericValidationError } from "../common/types";

const addUser = async (req: Request, res: Response, next: NextFunction) => {
  const doc = await baseController.createOne({
    model: UserModel,
    data: req.body,
    criteria: userCriteria,
    next,
  });

  if (doc) {
    res.status(201).json({
      status: "success",
      data: {
        id: doc.id,
        name: doc.name,
        email: doc.email,
      },
    });
  }
};

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;

  baseController
    .getOne({ model: UserModel, id: userId, next })
    .then((doc) => {
      return res.status(200).json({
        status: "success",
        data: doc,
      });
    })
    .catch((error) => {
      next(new AppError(400, "fail", error as GenericValidationError<{}>[]));
    });
};

const updateUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.params;

  baseController
    .updateOne({ model: UserModel, id: userId, data: req.body, next })
    .then((newDoc) => {
      return res.status(200).json({
        status: "success",
        data: newDoc,
      });
    })
    .catch((error) => {
      next(new AppError(400, "fail", error as GenericValidationError<{}>[]));
    });
};

const deleteUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.params;

  baseController
    .deleteOne({ model: UserModel, id: userId, next })
    .then(() => {
      return res.status(200).json({
        status: "success",
      });
    })
    .catch((error) => {
      next(new AppError(400, "fail", error as GenericValidationError<{}>[]));
    });
};

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  const { page, limit } = req.body;
  const docs = await baseController.getAll({
    model: UserModel,
    next,
    pagination: { page, limit },
  });

  if (docs) {
    res.status(200).json({
      status: "success",
      length: docs.length,
      data: docs,
    });
  }
};

export { addUser, getUserById, updateUserById, deleteUserById, getAllUsers };
