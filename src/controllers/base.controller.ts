import { NextFunction, Request, Response } from "express";
import { Document, Model, UpdateQuery } from 'mongoose';
import AppError from "../utils/app-error";
import { GenericValidationCriteria, GenericValidationError } from "../common/types";
import { validate } from "../validators/generic.validators";
import paginateQuery from "../utils/pagination-helper";

type GenericModel<T extends Document> = Model<T>;

const createOne = async <T extends Document>(model: GenericModel<T>, data: T, criteria: GenericValidationCriteria<T>[], next: NextFunction) => {
    try {
        const { isValid, errors } = validate(data, criteria);

        if (!isValid) {
            throw new AppError(400, 'fail', errors as GenericValidationError<{}>[]);
        }

        const doc = await model.create(data);

        if (!doc) {
            throw new AppError(500, 'fail', [{
                field: 'generic',
                message: 'Could not create document'
            }] as GenericValidationError<{}>[]);
        }

        return doc;
    } catch (error) {
        next(error);
    }
}

const getOne = async <T extends Document>(model: GenericModel<T>, id: string, next: NextFunction) => {
    try {
        const doc = await model.findById(id);

        if (!doc) {
            return next(new AppError(404, 'fail', 'No document found with that id'));
        }

        return doc;
    } catch (error) {
        next(error);
    }
}

const updateOne = async <T extends Document>(model: GenericModel<T>, id: string, data: UpdateQuery<T>, next: NextFunction) => {
    try {
        const doc = await model.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        });

        if (!doc) {
            throw new AppError(404, 'fail', 'No document found with that id');
        }

        return doc;
    } catch (error) {
        next(error);
    }
}

const deleteOne = <T extends Document>(model: GenericModel<T>) => async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
        const doc = await model.findByIdAndDelete(id);

        if (!doc) {
            return next(new AppError(404, 'fail', 'No document found with that id'));
        }

        res.status(200).json({
            isSuccess: true,
        });
    } catch (error) {
        next(error);
    }
}

const getAll = async <T extends Document>(model: GenericModel<T>, next: NextFunction, pagination: { page: number, limit: number }, projections?: (keyof T)[]) => {
    try {
        const { page, limit } = pagination;

        const docs = await paginateQuery(model.find({}, projections?.join(' ')), Number(page ?? 1), Number(limit));

        return docs;
    } catch (error) {
        next(error);
    }
}

export default { deleteOne, updateOne, createOne, getOne, getAll };