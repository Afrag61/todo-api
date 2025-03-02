import baseController from "./base.controller";
import { TodoModel } from "../models/todo.model";
import { todoCriteria } from "../validators/todos.validators";
import { NextFunction, Request, Response } from "express";
import AppError from "../utils/app-error";
import { GenericValidationError } from "../common/types";

const addTodo = async (req: Request, res: Response, next: NextFunction) => {
  const doc = await baseController.createOne(
    TodoModel,
    req.body,
    todoCriteria,
    next
  );

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
    .getOne(TodoModel, todoId, next)
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
    .updateOne(TodoModel, todoId, req.body, next)
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
    .deleteOne(TodoModel, todoId, next)
    .then(() => {
      return res.status(200).json({
        status: "success",
      });
    })
    .catch((error) => {
      next(new AppError(400, "fail", error as GenericValidationError<{}>[]));
    });
};

const getAllTodos = async (req: Request, res: Response, next: NextFunction) => {
  const { page, limit } = req.body;
  const docs = await baseController.getAll(TodoModel, next, { page, limit });

  if (docs) {
    res.status(200).json({
      status: "success",
      length: docs.length,
      data: docs,
    });
  }
};

export { addTodo, getTodoById, updateTodoById, deleteTodoById, getAllTodos };
