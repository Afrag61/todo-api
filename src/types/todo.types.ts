import { Document, Schema } from "mongoose";

export type Todo = Document & {
  title: string;
  description: string;
  isChecked: boolean;
  createdOn: string;
  dueDateTime: string;
  subTodos: Schema.Types.ObjectId[];
  userId: Schema.Types.ObjectId;
};
