import express from "express";
import {
  addSubTodo,
  deleteSubTodoById,
  // getAllSubTodos,
  getAllSubTodosById,
  getSubTodoById,
  toggleSubTodoCheck,
  updateSubTodoById,
} from "../controllers/sub-todos.controller";

const router = express.Router({ mergeParams: true });

router.post("/add-sub-todo", addSubTodo);

router
  .route("/:subTodoId")
  .get(getSubTodoById)
  .patch(updateSubTodoById)
  .delete(deleteSubTodoById);

router.route("/:subTodoId/toggle-check").patch(toggleSubTodoCheck);

router.get("/", getAllSubTodosById);

export default router;
