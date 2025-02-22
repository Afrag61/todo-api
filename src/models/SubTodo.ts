import { Schema } from "mongoose";
import { SubTodo } from "../types";

const SubTodoSchema = new Schema<SubTodo>({
  id: Schema.Types.ObjectId,
  title: String,
  description: String,
  isChecked: Boolean,
  createdOn: String,
  dueDateTime: String,
}, {
  versionKey: false,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
    }
  }
});

export default SubTodoSchema;
