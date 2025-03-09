import jwt from "jsonwebtoken";
import baseController from "./base.controller";
import { TodoModel } from "../models/todo.model";
import { todoCriteria } from "../validators/todos.validators";
import { NextFunction, Request, Response } from "express";
import AppError from "../utils/app-error";
import { GenericValidationError } from "../common/types";

const addTodo = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  const user = jwt.decode(token as string, {
    json: true,
  });

  const doc = await baseController.createOne({
    model: TodoModel,
    data: { ...req.body, userId: user?.userId },
    criteria: todoCriteria,
    next,
  });

  if (doc) {
    res.status(201).json({
      status: "success",
      data: doc,
    });
  }
};

const getTodoById = async (req: Request, res: Response, next: NextFunction) => {
  const { todoId } = req.params;

  baseController
    .getOne({
      model: TodoModel,
      id: todoId,
      next,
      populate: ["subTodos", "userId"],
    })
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

const updateTodoById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { todoId } = req.params;

  baseController
    .updateOne({ model: TodoModel, id: todoId, data: req.body, next })
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

const deleteTodoById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { todoId } = req.params;

  baseController
    .deleteOne({ model: TodoModel, id: todoId, next })
    .then(() => {
      return res.status(200).json({
        status: "success",
      });
    })
    .catch((error) => {
      next(new AppError(400, "fail", error as GenericValidationError<{}>[]));
    });
};

const toggleTodoCheck = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { todoId } = req.params;

  const currentTodo = await baseController.getOne({
    model: TodoModel,
    id: todoId,
    next,
    projections: ["isChecked"],
  });

  const updatedTodo = await baseController.updateOne({
    model: TodoModel,
    id: todoId,
    data: { isChecked: !currentTodo?.isChecked },
    next,
  });

  if (updatedTodo) {
    res.status(200).json({
      status: "success",
      data: updatedTodo,
    });
  }
};

const getAllTodos = async (req: Request, res: Response, next: NextFunction) => {
  const { page, limit } = req.body;
  const docs = await baseController.getAll({
    model: TodoModel,
    next,
    pagination: { page, limit },
    populate: ["subTodos", "userId"],
  });

  if (docs) {
    res.status(200).json({
      status: "success",
      length: docs.length,
      data: docs,
    });
  }
};

export {
  addTodo,
  getTodoById,
  updateTodoById,
  deleteTodoById,
  toggleTodoCheck,
  getAllTodos,
};
