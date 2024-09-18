import path from "path";
import express, { Application } from "express";
import { json } from "body-parser";
import mongoose from "mongoose";
import { errorHandler } from "./middlewares/error-handler";
import { config } from "dotenv";
config({ path: path.resolve(__dirname, "../.env") });

import { autoSignin } from "./controllers/auth-controller";
import authRoutes from './routers/auth-route';
import tasksRoutes from './routers/tasks-routes';

const app: Application = express();
const PORT = process.env.PORT || 5000;
const DB = process.env.MONGODB_URI;

if (!DB) {
  throw new Error("Missing necessary environment variables");
}

app.use(json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", tasksRoutes);

// Error Handling Middleware
app.use(errorHandler);

mongoose
  .connect(DB)
  .then(() => {
    app.listen(PORT, () => {
      autoSignin();
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
