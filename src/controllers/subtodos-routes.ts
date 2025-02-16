import express from "express";
import TodoModel from "../models/Todo";
import { SubTodo } from "../types";
import { RouteParameters } from 'express-serve-static-core';
import { Schema, Types } from "mongoose";

type WithParentParams<T extends string> = RouteParameters<':todoId'> & RouteParameters<T>

let route;

const router = express.Router({ mergeParams: true });

route = '/add-sub-todo' as const;
router.post<typeof route, WithParentParams<typeof route>>("/add-sub-todo", async (req, res) => {
    const { todoId } = req.params;
    const { title, description, isChecked, dueDateTime } = req.body;

    if (!title || !description) {
        res.status(400).json({
            isSuccess: false,
            error: "Title, description are required.",
        });
    }

    try {
        const subTodo: SubTodo = {
            _id: new Types.ObjectId(),
            title: title,
            description: description,
            dueDateTime: dueDateTime,
            createdOn: new Date().toISOString(),
            isChecked: isChecked,
        }
        const todo = await TodoModel.findByIdAndUpdate(todoId, {
            $push: {
                subTodos: subTodo,
                history: {
                    actionOn: new Date().toISOString(),
                    actionType: 'Add',
                    field: 'subTodos',
                    value: subTodo
                }
            }
        }, { safe: true, upsert: true, new: true }).exec();

        res.status(201).json({
            isSuccess: true,
            todo,
        });
    } catch (error) {
        res.status(500).json({ isSuccess: false, error: "Error adding todo." });
    }
});

route = '/:subTodoId' as const;
router.get<typeof route, WithParentParams<typeof route>>("/:subTodoId", async (req, res) => {
    const { todoId, subTodoId } = req.params;

    try {
        const todo = await TodoModel.findById(todoId).exec();
        const subTodo = todo?.subTodos?.find(subTodo => subTodo._id.toString() == subTodoId);
        if (subTodo) {
            res.status(200).json({
                isSuccess: true,
                data: subTodo
            });
        } else {
            res.status(404).json({ isSuccess: false, error: "Cannot find the sub todo." });
        }
    } catch (error) {
        res.status(500).json({ isSuccess: false, error: "Error getting sub todo." });
    }
});

router.delete<typeof route, WithParentParams<typeof route>>("/:subTodoId", async (req, res) => {
    const { todoId, subTodoId } = req.params;

    try {
        const todo = await TodoModel.findById(todoId);
        if (!todo) {
            res.status(404).json({
                isSuccess: false,
                error: "Todo not found.",
            });
        } else {
            const subTodo = todo?.subTodos?.find(subTodo => subTodo?._id?.toString() == subTodoId);
            if (!subTodo) {
                res.status(404).json({
                    isSuccess: false,
                    error: "Sub todo not found.",
                });
            } else {
                todo.updateOne({
                    $pull: {
                        subTodos: {
                            _id: {
                                $in: [subTodoId]
                            }
                        }
                    },
                    $push: {
                        history: {
                            actionOn: new Date().toISOString(),
                            actionType: 'Delete',
                            field: 'subTodos',
                            value: subTodo
                        }
                    }
                }, { new: true }).then(result => {
                    res.json({ isSuccess: true, deleted: result.modifiedCount });
                }).catch(_ => {
                    res.json({ isSuccess: false });
                })
            }
        }
    } catch (error) {
        res.status(500).json({ isSuccess: false, error: "Error deleting sub todo." });
    }
});


route = '/:subTodoId/toggle-check' as const;
router.patch<typeof route, WithParentParams<typeof route>>("/:subTodoId/toggle-check", async (req, res) => {
    const { todoId, subTodoId } = req.params;

    try {
        const todo = await TodoModel.findOne({ _id: todoId });
        if (!todo) {
            res.status(404).json({
                isSuccess: false,
                error: "Todo not found.",
            });
        } else {
            const subTodo = todo?.subTodos?.find(subTodo => subTodo?._id?.toString() == subTodoId);
            if (!subTodo) {
                res.status(404).json({
                    isSuccess: false,
                    error: "Sub todo not found.",
                });
            } else {
                subTodo.isChecked = !subTodo.isChecked;

                todo.save().then(_ => {
                    res.json({ isSuccess: true });
                }).catch(_ => {
                    res.status(400).json({
                        isSuccess: false,
                        error: "Some error happened while checking the sub todo.",
                    });
                })
            }
        }
    }
    catch (error) {
        res.status(500).json({ isSuccess: false, error: "Error checking sub todo." });
    }
});


route = '/' as const;
router.get<typeof route, WithParentParams<typeof route>>("/", async (req, res) => {
    const { todoId } = req.params;

    try {
        const todo = await TodoModel.findById(todoId, 'subTodos').exec();
        res.json({ isSuccess: true, subTodos: todo?.subTodos });
    } catch (error) {
        res.status(500).json({ isSuccess: false, error: "Error loading todos." });
    }
});

export default router;