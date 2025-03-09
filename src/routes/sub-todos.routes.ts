import express from "express";
import {
  addSubTodo,
  deleteSubTodoById,
  getAllSubTodosById,
  getSubTodoById,
  toggleSubTodoCheck,
  updateSubTodoById,
} from "../controllers/sub-todos.controller";

const subTodosRouter = express.Router({ mergeParams: true });

subTodosRouter.post("/add-sub-todo", addSubTodo);

subTodosRouter
  .route("/:subTodoId")
  .get(getSubTodoById)
  .patch(updateSubTodoById)
  .delete(deleteSubTodoById);

subTodosRouter.route("/:subTodoId/toggle-check").patch(toggleSubTodoCheck);

subTodosRouter.get("/", getAllSubTodosById);

export default subTodosRouter;
