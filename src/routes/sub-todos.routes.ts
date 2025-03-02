import express from 'express';
import {
  addSubTodo,
  deleteSubTodoById,
  getAllSubTodos,
  getSubTodoById,
  updateSubTodoById
} from "../controllers/sub-todos.controller";

const router = express.Router({mergeParams: true});

router.post('/add-sub-todo', addSubTodo);

router.route('/:subTodoId').get(getSubTodoById).patch(updateSubTodoById).delete(deleteSubTodoById);

router.get('/', getAllSubTodos);

export default router;
