import express from "express";
import {
  addTodo,
  deleteTodoById,
  getAllTodos,
  getTodoById,
  toggleTodoCheck,
  updateTodoById,
} from "../controllers/todos.controller";
import subTodosRoutes from "../routes/sub-todos.routes";
// import historyRoutes from "../routes/history.routes";

const router = express.Router();

router.post("/add-todo", addTodo);

router
  .route("/:todoId")
  .get(getTodoById)
  .patch(updateTodoById)
  .delete(deleteTodoById);

router.route("/:todoId/toggle-check").patch(toggleTodoCheck);

router.use("/:todoId/sub-todos", subTodosRoutes);

router.get("/", getAllTodos);

export default router;
