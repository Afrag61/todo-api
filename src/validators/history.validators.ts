import { History } from "../types/history.types";
import {GenericValidationCriteria} from "../common/types";

const historyCriteria: GenericValidationCriteria<History>[] = [
  {
    field: 'actionOn',
    required: true,
    type: 'string',
  },
  {
    field: 'actionType',
    required: true,
    type: 'string',
  },
  {
    field: 'field',
    required: true,
    type: 'string',
  }
]

export {historyCriteria};
