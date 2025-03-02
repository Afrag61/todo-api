import { SubTodo } from "../types/sub-todo.types";
import {GenericValidationCriteria} from "../common/types";

const subTodoCriteria: GenericValidationCriteria<SubTodo>[] = [
  {
    field: 'title',
    required: true,
    type: 'string',
  },
  {
    field: 'description',
    required: true,
    type: 'string',
  }
]

export {subTodoCriteria};
