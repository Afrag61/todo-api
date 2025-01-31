import express from "express";
import TodoModel from "../models/Todo";
import {SubTodo} from "../types";

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

router.post("/:id/add-sub-todo", async (req, res) => {
  const {id} = req.params;
  const {title, description, isChecked, dueDateTime} = req.body;

  if (!title || !description) {
    res.status(400).json({
      isSuccess: false,
      error: "Title, description are required.",
    });
  } else {
    try {
      const subTodo: SubTodo = {
        title: title,
        description: description,
        dueDateTime: dueDateTime,
        createdOn: new Date().toISOString(),
        isChecked: isChecked,
      }
      const todo = await TodoModel.findByIdAndUpdate(id, {
          $push: {
            subTodos: subTodo, history: {
              actionOn: new Date().toISOString(),
              actionType: 'Add',
              field: 'subTodos',
              value: subTodo
            }
          },
        }, {safe: true, upsert: true, new: true},
      ).exec();

      res.status(201).send({
        isSuccess: true,
        todo,
      });
    } catch (error) {
      res.status(500).json({isSuccess: false, error: "Error getting todo."});
    }
  }
})

router.get("/:id", async (req, res) => {
  const {id} = req.params;

  try {
    const todo = await TodoModel.findById(id).exec();
    if (!todo) {
      res.status(404).json({isSuccess: false, error: "Todo not found."});
    } else {
      res.json({isSuccess: true, todo});
    }
  } catch (error) {
    res.status(500).json({isSuccess: false, error: "Error getting todo."});
  }
});

router.delete("/:id", async (req, res) => {
  const {id} = req.params;

  try {
    const isDeleted = await TodoModel.findByIdAndDelete(id).exec();

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

router.patch("/:id/toggle-check", async (req, res) => {
  const {id} = req.params;

  try {
    const currentTodo = await TodoModel.findById(id, "isChecked history");
    const updatedTodo = await TodoModel.findByIdAndUpdate(id, {
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

router.get("/", async (_, res) => {
  try {
    const todos = await TodoModel.find().exec();
    res.json({isSuccess: true, todos});
  } catch (error) {
    res.status(500).json({isSuccess: false, error: "Error loading todos."});
  }
});

export default router;
