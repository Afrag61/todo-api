import { Todo } from "../types/todo.types";
import {GenericValidationCriteria} from "../common/types";

const todoCriteria: GenericValidationCriteria<Todo>[] = [
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

export {todoCriteria};
