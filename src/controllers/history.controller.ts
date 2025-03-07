import baseController from "./base.controller";
import { HistoryModel } from "../models/history.model";
import { historyCriteria } from "../validators/history.validators";
import { NextFunction, Request, Response } from "express";
import AppError from "../utils/app-error";
import { GenericValidationError } from "../common/types";

const addHistory = (req: Request, res: Response, next: NextFunction) => {
  const doc = baseController.createOne({
    model: HistoryModel,
    data: req.body,
    criteria: historyCriteria,
    next,
  });

  res.status(201).json({
    status: "success",
    data: doc,
  });
};

const getHistoryById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { subTodoId } = req.params;
  baseController
    .getOne({ model: HistoryModel, id: subTodoId, next })
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

/* const deleteHistoryById = baseController.deleteOne(HistoryModel); */

// const getAllHistory = baseController.getAll(HistoryModel);

export {
  addHistory,
  getHistoryById /* deleteHistoryById */ /* getAllHistory */,
};
