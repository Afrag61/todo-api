import express from "express";
import {
  addUser,
  deleteUserById,
  getAllUsers,
  getUserById,
  updateUserById,
} from "../controllers/users.controller";

const usersRouter = express.Router();

usersRouter.post("/add-user", addUser);

usersRouter
  .route("/:userId")
  .get(getUserById)
  .patch(updateUserById)
  .delete(deleteUserById);

usersRouter.get("/", getAllUsers);

export default usersRouter;
