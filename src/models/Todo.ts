import { Schema, model } from "mongoose";
import { Todo } from "../types";
import SubTodoSchema from "./SubTodo";
import HistorySchema from "./History";

const TodoSchema = new Schema<Todo>(
  {
    id: Schema.Types.ObjectId,
    title: String,
    description: String,
    isChecked: Boolean,
    createdOn: String,
    dueDateTime: String,
    subTodos: [SubTodoSchema],
    history: [HistorySchema],
  },
  {
    versionKey: false,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
      }
    }
  }
);

const TodoModel = model("Todo", TodoSchema);

export default TodoModel;
