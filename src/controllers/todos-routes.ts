import express from "express";
import TodoModel from "../models/Todo";
import SubTodosRouter from './subtodos-routes';

const router = express.Router();

router.post("/add-todo", async (req, res) => {
  const {title, description, isChecked, dueDateTime, subTodos} = req.body;

  if (!title || !description) {
    res.status(400).json({
      isSuccess: false,
      error: "Title, description are required.",
    });
  }

  try {
    const todo = new TodoModel({
      title: title,
      description: description,
      dueDateTime: dueDateTime,
      createdOn: new Date().toISOString(),
      isChecked: isChecked,
      subTodos: subTodos,
      history: [
        {
          actionOn: new Date().toISOString(),
          actionType: 'Create',
          field: 'Todo',
        }
      ],
    });

    await todo.save();

    res.status(201).send({
      isSuccess: true,
      todo,
    });
  } catch (error) {
    res.status(500).json({isSuccess: false, error: "Error adding todo."});
  }
});

router.get("/:todoId", async (req, res) => {
  const {todoId} = req.params;

  try {
    const todo = await TodoModel.findById(todoId).exec();
    if (!todo) {
      res.status(404).json({isSuccess: false, error: "Todo not found."});
    } else {
      res.json({isSuccess: true, todo});
    }
  } catch (error) {
    res.status(500).json({isSuccess: false, error: "Error getting todo."});
  }
});

router.delete("/:todoId", async (req, res) => {
  const {todoId} = req.params;

  try {
    const isDeleted = await TodoModel.findByIdAndDelete(todoId).exec();

    if (!isDeleted) {
      res.status(400).json({
        isSuccess: false,
        error: "Some error happened while deleting the todo.",
      });
    } else {
      res.json({isSuccess: true});
    }
  } catch (error) {
    res.status(500).json({isSuccess: false, error: "Error deleting todo."});
  }
});

router.patch("/:todoId/toggle-check", async (req, res) => {
  const {todoId} = req.params;

  try {
    const currentTodo = await TodoModel.findById(todoId, "isChecked history");
    const updatedTodo = await TodoModel.findByIdAndUpdate(todoId, {
      isChecked: !currentTodo?.isChecked,
      $push: {
        history: {
          actionOn: new Date().toISOString(),
          actionType: 'Update',
          field: 'isChecked',
          value: !currentTodo?.isChecked
        }
      },
    }).exec();

    if (!updatedTodo) {
      res.status(400).json({
        isSuccess: false,
        error: "Some error happened while checking the todo.",
      });
    }
    res.json({isSuccess: true});
  } catch (error) {
    res.status(500).json({isSuccess: false, error: "Error checking todo."});
  }
});

router.use('/:todoId/sub-todos', SubTodosRouter)

router.get("/", async (_, res) => {
  try {
    const todos = await TodoModel.find().exec();
    res.json({isSuccess: true, todos});
  } catch (error) {
    res.status(500).json({isSuccess: false, error: "Error loading todos."});
  }
});

export default router;
