import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import authRoutes from "./src/routes/auth.routes";
import todosRoutes from "./src/routes/todos.routes";
import usersRoutes from "./src/routes/users.routes";
import { verifyToken } from "./src/middleware/auth.middleware";
import errorHandler from "./src/middleware/error-handler";
import cors from "cors";

const uri =
  "mongodb+srv://mfrag38:Wx11Aa50E^nV@cluster0.5yhdu.mongodb.net/todo-app?retryWrites=true&w=majority&appName=Cluster0";

const clientOptions: mongoose.ConnectOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};

const app = express();

// CORS
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json());

// Non Authorized Routes
app.use("/auth", authRoutes);

// Auth Middleware
app.use(verifyToken);

// Authorized Routes
app.use("/todos", todosRoutes);
app.use("/users", usersRoutes);

app.use(errorHandler);

mongoose
  .connect(uri, clientOptions)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(3000);
  })
  .catch((err) => {
    console.log("Connection Error:", err);
  });

process.on("UnhandledPromiseRejection", (err) => {
  console.log("Unhandled Promise Rejection:", err);
});
