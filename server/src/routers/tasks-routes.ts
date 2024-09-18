import express from "express";
import { body } from "express-validator";
import {
  createTask,
  deleteTask,
  getTasksByUserId,
  updateTask,
  updateSubtask,
  updateTaskTime
} from "../controllers/tasks-controller";
import CheckAuth from "../middlewares/check-auth";

const router = express.Router();

router.use(CheckAuth);

router.post(
  "/create",
  body("title").trim().not().isEmpty(),
  body("description").trim().isLength({ min: 5 }),
  body("timeEstimate").trim().isLength({ min: 1 }),
  body("subtasks").isArray({ min: 1 }),
  body("subtasks.*.title").trim().not().isEmpty(),
  createTask
);

router.patch(
  "/:tid",
  body("title").trim().not().isEmpty(),
  body("description").trim().isLength({ min: 5 }),
  body("timeEstimate").trim().isLength({ min: 1 }),
  body("subtasks").isArray({ min: 1 }),
  body("subtasks.*.title").trim().not().isEmpty(),
  updateTask
);

router.get("/", getTasksByUserId);
router.delete("/:tid", deleteTask);

router.post(
  "/subtask/:subtid",
  body("completed").isBoolean(),
  updateSubtask
);

router.post(
  "/:tid/time",
  body("timeSpent").trim().isLength({ min: 1 }),
  body("lastStartTime").custom((value) => {
    if (value === null || typeof value === 'number') {
      return true;
    }
    return false
  }),
  updateTaskTime
);

export default router;
