import { Schema } from "mongoose";
import { Todo } from "./todo.types";

export type SubTodo = Omit<Todo, "subTodos"> & {
  todoId: Schema.Types.ObjectId;
};
