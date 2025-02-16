import { Schema, Types } from "mongoose";
import { TodoActionType } from "./enums";

export type Todo = {
  _id: Types.ObjectId;
  id?: Schema.Types.ObjectId;
  title: string;
  description: string;
  isChecked: boolean;
  createdOn: string;
  dueDateTime: string;
  subTodos: SubTodo[];
  history: History[];
};

export type SubTodo = Omit<Todo, "subTodos" | "history">;

export type History = {
  actionOn: string;
  actionType: keyof typeof TodoActionType;
  field: keyof (Todo & { Todo: string });
  value?: unknown;
};
