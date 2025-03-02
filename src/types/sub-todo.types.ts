import { Todo } from "./todo.types";

export type SubTodo = Omit<Todo, "subTodos" | "history">;