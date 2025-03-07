import { Document } from "mongoose";
import { TodoActionType } from "../common/enums";
import { Todo } from "./todo.types";

export type History = Document & {
    actionOn: string;
    actionType: keyof typeof TodoActionType;
    field: keyof (Omit<Todo, keyof Document> & { Todo: string });
    value?: unknown;
};
