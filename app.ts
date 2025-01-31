import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

import todosRoutes from "./src/controllers/todos-routes";

const uri =
  "mongodb+srv://mfrag38:Wx11Aa50E^nV@cluster0.5yhdu.mongodb.net/todo-app?retryWrites=true&w=majority&appName=Cluster0";

const clientOptions: mongoose.ConnectOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};

const app = express();

// CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json());

app.use("/todos", todosRoutes);

mongoose
  .connect(uri, clientOptions)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(3000);
  })
  .catch((err) => {
    console.log("Connection Error:", err);
  });
