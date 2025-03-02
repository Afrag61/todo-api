import { Document, Schema } from "mongoose";

export type Todo = {
  _id?: Schema.Types.ObjectId;
  id?: Schema.Types.ObjectId;
  title: string;
  description: string;
  isChecked: boolean;
  createdOn: string;
  dueDateTime: string;
  subTodos: Schema.Types.ObjectId[];
  // history: Schema.Types.ObjectId[];
};
