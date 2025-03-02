import express from 'express';
import {
  addTodo,
  deleteTodoById,
  getAllTodos,
  getTodoById,
  updateTodoById
} from "../controllers/todos.controller";
import subTodosRoutes from "../routes/sub-todos.routes";
import historyRoutes from "../routes/history.routes";

const router = express.Router();

router.post('/add-todo', addTodo);

router.route('/:todoId').get(getTodoById).patch(updateTodoById).delete(deleteTodoById);

router.use('/:todoId/sub-todos', subTodosRoutes);

router.use('/:todoId/history', historyRoutes);

router.get('/', getAllTodos);

export default router;
