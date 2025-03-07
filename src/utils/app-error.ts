import {GenericValidationError} from "../common/types";

class AppError {
  public statusCode: number;
  public status: string;
  public errors: GenericValidationError<{}>[] | string;

  constructor(statusCode: number, status: string, errors: GenericValidationError<{}>[] | string) {
    this.statusCode = statusCode;
    this.status = status;
    this.errors = errors;
  }
}

export default AppError;
