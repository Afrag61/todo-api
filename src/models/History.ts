import {Schema} from "mongoose";
import {History} from "../types";

const actionTypes = ["Create", "Add", "Update", "Delete"];
const todoFields = [
  "title",
  "description",
  "isChecked",
  "dueDateTime",
  "subTodos",
  "history",
  "Todo"
];

const HistorySchema = new Schema<History>({
  actionOn: String,
  actionType: {
    type: String,
    enum: actionTypes,
  },
  field: {
    type: String,
    enum: todoFields,
  },
  value: Schema.Types.Mixed,
}, {
  versionKey: false,
  toJSON: {
    transform: (doc, ret) => {
      delete ret._id;
    }
  }
});

export default HistorySchema;
