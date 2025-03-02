import { Schema, model } from "mongoose";
import { Todo } from "../types/todo.types";

const TodoSchema = new Schema<Todo>(
  {
    id: Schema.Types.ObjectId,
    title: String,
    description: String,
    isChecked: Boolean,
    createdOn: String,
    dueDateTime: String,
    subTodos: [{
      type: Schema.Types.ObjectId,
      ref: "SubTodo",
    }],
    history: [{
      type: Schema.Types.ObjectId,
      ref: "History",
    }],
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

export {TodoModel, TodoSchema};
