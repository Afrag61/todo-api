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

const todosRouter = express.Router();

todosRouter.post("/add-todo", addTodo);

todosRouter
  .route("/:todoId")
  .get(getTodoById)
  .patch(updateTodoById)
  .delete(deleteTodoById);

todosRouter.route("/:todoId/toggle-check").patch(toggleTodoCheck);

todosRouter.use("/:todoId/sub-todos", subTodosRoutes);

todosRouter.get("/", getAllTodos);

export default todosRouter;
