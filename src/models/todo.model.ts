import { Document, Schema, model } from "mongoose";
import { Todo } from "../types/todo.types";

const TodoSchema = new Schema<Document & Todo>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    isChecked: {
      type: Boolean,
      default: false,
    },
    createdOn: {
      type: String,
      default: new Date().toUTCString(),
    },
    dueDateTime: String,
    subTodos: [
      {
        type: Schema.Types.ObjectId,
        ref: "SubTodo",
      },
    ],
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
  },
  {
    versionKey: false,
    toJSON: {
      transform: (_, ret) => {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

const TodoModel = model("Todo", TodoSchema);

export { TodoModel, TodoSchema };
