import { GenericValidationCriteria, GenericValidationError, GenericValidationResult } from "../common/types";
import { isObject } from "lodash";

const validate = <T,>(data: T, criteria: GenericValidationCriteria<T>[]): GenericValidationResult<T> => {
    const errors: GenericValidationError<T>[] = [];

    if (!criteria || !criteria.length) {
        return {
            isValid: true,
            errors: []
        }
    }

    criteria.forEach((criterion) => {
        const { field, required, type } = criterion;
        const value = (data as T)[field];

        if (value && typeof value !== type) {
            errors.push({
                field,
                message: `${field as string} must be of type ${type}`
            });
        }

        if (required && !value) {
            if (isObject(required) && required.isRequired) {
                errors.push({
                    field,
                    message: required.message ?? `${field as string} is required`
                })
            } else {
                errors.push({
                    field,
                    message: `${field as string} is required`
                });
            }
        }
    });

    return {
        isValid: errors.length === 0,
        errors
    };
}

export { validate };
