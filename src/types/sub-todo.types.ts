import { Schema } from "mongoose";
import { Todo } from "./todo.types";

export type SubTodo = Omit<Todo, "subTodos" | "history"> & {
  todoId: Schema.Types.ObjectId;
};
