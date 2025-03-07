import { Document, model, Schema } from "mongoose";
import { SubTodo } from "../types/sub-todo.types";

const SubTodoSchema = new Schema<Document & SubTodo>(
  {
    todoId: Schema.Types.ObjectId,
    title: String,
    description: String,
    isChecked: {
      type: Boolean,
      default: false,
    },
    createdOn: String,
    dueDateTime: String,
  },
  {
    versionKey: false,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

const SubTodoModel = model("SubTodo", SubTodoSchema);

export { SubTodoModel, SubTodoSchema };
