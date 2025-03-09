import { User } from "../types/user.types";
import { GenericValidationCriteria } from "../common/types";

const userCriteria: GenericValidationCriteria<User>[] = [
  {
    field: "name",
    required: true,
    type: "string",
  },
  {
    field: "email",
    required: true,
    type: "string",
  },
  {
    field: "password",
    required: true,
    type: "string",
  },
];

export { userCriteria };
