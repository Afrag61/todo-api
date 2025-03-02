import baseController from "./base.controller";
import { SubTodoModel } from "../models/sub-todo.model";
import { subTodoCriteria } from "../validators/sub-todos.validators";
import { NextFunction, Request, Response } from "express";
import { TodoModel } from "../models/todo.model";
import AppError from "../utils/app-error";
import { GenericValidationError } from "../common/types";

const addSubTodo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { todoId } = req.params;

    baseController
      .createOne(SubTodoModel, { ...req.body, todoId }, subTodoCriteria, next)
      .then((doc) => {
        if (doc) {
          baseController
            .updateOne(
              TodoModel,
              todoId,
              { $push: { subTodos: doc._id } },
              next
            )
            .then((newDoc) => {
              return res.status(201).json({
                status: "success",
                data: newDoc,
              });
            })
            .catch((error) => {
              next(
                new AppError(400, "fail", error as GenericValidationError<{}>[])
              );
            });
        } else {
          next(
            new AppError(500, "fail", [
              {
                field: "subTodo",
                message: "Could not create subTodo",
              },
            ] as GenericValidationError<{}>[])
          );
        }
      })
      .catch((error) => {
        next(new AppError(400, "fail", error as GenericValidationError<{}>[]));
      });
  } catch (error) {
    next(error);
  }
};

const getSubTodoById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { subTodoId } = req.params;
  baseController
    .getOne(SubTodoModel, subTodoId, next)
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

const updateSubTodoById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { subTodoId } = req.params;

  baseController
    .updateOne(SubTodoModel, subTodoId, req.body, next)
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

const deleteSubTodoById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { todoId, subTodoId } = req.params;

  baseController
    .deleteOne(SubTodoModel, subTodoId, next)
    .then((doc) => {
      if (doc) {
        baseController
          .updateOne(TodoModel, todoId, { $pull: { subTodos: doc._id } }, next)
          .then(() => {
            return res.status(200).json({
              status: "success",
            });
          })
          .catch((error) => {
            next(
              new AppError(400, "fail", error as GenericValidationError<{}>[])
            );
          });
      } else {
        next(
          new AppError(500, "fail", [
            {
              field: "subTodo",
              message: "Could not create subTodo",
            },
          ] as GenericValidationError<{}>[])
        );
      }
    })
    .catch((error) => {
      next(new AppError(400, "fail", error as GenericValidationError<{}>[]));
    });
};

const getAllSubTodosById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { todoId } = req.params;

  baseController
    .getOne(TodoModel, todoId, next, ["subTodos"])
    .then((doc) => {
      return res.status(200).json({
        status: "success",
        length: doc?.subTodos?.length,
        data: doc?.subTodos,
      });
    })
    .catch((error) => {
      next(new AppError(400, "fail", error as GenericValidationError<{}>[]));
    });
};

const getAllSubTodos = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { page, limit } = req.body;

  baseController
    .getAll(SubTodoModel, next, { page, limit })
    .then((docs) => {
      return res.status(200).json({
        status: "success",
        length: docs?.length,
        data: docs,
      });
    })
    .catch((error) => {
      next(new AppError(400, "fail", error as GenericValidationError<{}>[]));
    });
};

export {
  addSubTodo,
  getSubTodoById,
  updateSubTodoById,
  deleteSubTodoById,
  getAllSubTodosById,
  getAllSubTodos,
};
