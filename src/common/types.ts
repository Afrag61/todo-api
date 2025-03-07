import {FieldTypes} from "./enums";

export type GenericValidationCriteria<T> = {
  field: keyof T,
  type: keyof typeof FieldTypes;
  required?: GenericValidationRequiredField;
};

export type GenericValidationRequiredField = boolean | {
  isRequired: boolean;
  message: string;
}

export type GenericValidationResult<T> = {
  isValid: boolean;
  errors?: GenericValidationError<T>[];
}

export type GenericValidationError<T> = {
  field: keyof T;
  message: string;
}
