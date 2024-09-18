import mongoose from "mongoose";
import { RequestHandler } from "express";
import { validationResult } from "express-validator";

import Task from "../models/task";
import Subtask from "../models/subtask";

import { ITask, ISubtask } from "../types/task";

import HttpError from "../models/http-error";

export const createTask: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const {
    title,
    description,
    timeEstimate,
    subtasks: newSubtasks,
  } = req.body as ITask;

  const createdTask = new Task({
    title,
    description,
    timeEstimate,
    creator: req.userData!.userId,
  });

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const savedTask = await createdTask.save();

    const createdSubtasks = newSubtasks.map((subtask: ISubtask) => {
      return new Subtask({
        title: subtask.title,
        completed: false,
        taskId: savedTask._id,
      });
    });

    const savedSubtasks = await Subtask.insertMany(createdSubtasks);

    const savedSubtasksWithIds = savedSubtasks.map((subtask) =>
      subtask.toObject({ getters: true })
    );

    savedTask.subtasks = savedSubtasksWithIds.map(
      (subtask) => subtask.id
    ) as mongoose.Types.ObjectId[];

    await savedTask.save();

    await session.commitTransaction();
    session.endSession();

    const taskData = savedTask.toObject({ getters: true });

    res.status(201).json({
      task: { ...taskData, subtasks: savedSubtasksWithIds },
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    return next(new HttpError("Creating task failed, please try again", 500));
  }
};

export const getTasksByUserId: RequestHandler = async (req, res, next) => {
  const userId = req.userData!.userId;
  let tasksWithSubtasks;
  try {
    tasksWithSubtasks = await Task.find({ creator: userId }).populate(
      "subtasks"
    );
  } catch (error) {
    return next(new HttpError("Fetching tasks failed, pleace try again", 500));
  }

  if (!tasksWithSubtasks || tasksWithSubtasks.length === 0) {
    return res.json({ tasks: [] });
  }

  res.json({
    tasks: tasksWithSubtasks.map((task) => task.toObject({ getters: true })),
  });
};

export const deleteTask: RequestHandler = async (req, res, next) => {
  const userId = req.userData!.userId;
  const taskId = req.params.tid;

  let task;
  try {
    task = await Task.findById(taskId);
  } catch (error) {
    return next(
      new HttpError("Something went wrong, could not delete task", 500)
    );
  }

  if (!task) {
    return next(new HttpError("Could not find task for provided id.", 404));
  }

  if (task.creator.toString() !== userId) {
    return next(new HttpError("You are not allowed to delete this task.", 401));
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await Subtask.deleteMany({
      _id: { $in: task.subtasks.map((subtask) => subtask._id) },
    });

    await task.deleteOne();

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: "Task deleted" });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return next(
      new HttpError("Something went wrong, could not delete task.", 500)
    );
  }
};

export const updateTask: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const userId = req.userData!.userId;
  const taskId = req.params.tid;

  let task;
  try {
    task = await Task.findById(taskId);
  } catch (error) {
    return next(
      new HttpError("Something went wrong, could not delete task", 500)
    );
  }

  if (!task) {
    return next(new HttpError("Could not find task for provided id.", 404));
  }

  if (task.creator.toString() !== userId) {
    return next(new HttpError("You are not allowed to delete this task.", 401));
  }

  const {
    title,
    description,
    timeEstimate,
    subtasks: newSubtasks,
  } = req.body as ITask;

  task.title = title;
  task.description = description;
  task.timeEstimate = timeEstimate;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const currentSubtaskIds = task.subtasks.map((subtask) =>
      subtask._id.toString()
    );

    const newSubtaskIds = newSubtasks
      .filter((subtask) => subtask.id.toString())
      .map((subtask) => subtask.id);

    const subtasksToDelete = currentSubtaskIds.filter(
      (_id) => !newSubtaskIds.includes(_id.toString())
    );

    const subtasksTokeep = currentSubtaskIds.filter((_id) =>
      newSubtaskIds.includes(_id.toString())
    );

    const subtaskToCreate = newSubtasks.filter(
      (subtask) => !subtasksTokeep.includes(subtask.id.toString())
    );

    if (subtasksToDelete.length > 0) {
      await Subtask.deleteMany({ _id: { $in: subtasksToDelete } });
      task.subtasks = task.subtasks.filter((subtask) =>
        subtasksTokeep.includes(subtask._id.toString())
      );
    }

    if (subtaskToCreate.length > 0) {
      const createdSubtasks = subtaskToCreate.map((subtask: ISubtask) => {
        return new Subtask({
          title: subtask.title,
          completed: subtask.completed || false,
          taskId: task._id,
        });
      });

      const savedSubtasks = await Subtask.insertMany(createdSubtasks);

      const savedSubtasksIds = savedSubtasks.map(
        (subtask) => subtask._id
      ) as mongoose.Types.ObjectId[];

      savedSubtasksIds.map((_id) => task.subtasks.push(_id));
    }

    await task.save();
    await task.populate("subtasks");

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      task: task.toObject({ getters: true }),
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    return next(new HttpError("Creating task failed, please try again", 500));
  }
};

export const updateSubtask: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const userId = req.userData!.userId;
  const subtaskId = req.params.subtid;
  const { completed } = req.body;

  let subtask;
  try {
    subtask = await Subtask.findById(subtaskId);
    if (!subtask) {
      return next(new HttpError("Subtask not found.", 404));
    }
  } catch (error) {
    return next(new HttpError("Something went wrong, could not find subtask.", 500));
  }

  let task;
  try {
    task = await Task.findById(subtask.taskId);

    if (!task || task.creator.toString() !== userId) {
      return next(new HttpError("You are not authorized to update this subtask.", 401));
    }

    if (!task.subtasks.filter(subtask => subtask.id.toString() == subtaskId)) {
      return next(new HttpError("This subtask does not belong to the task.", 403));
    }
  } catch (error) {
    return next(new HttpError("Something went wrong, could not verify task.", 500));
  }

  subtask.completed = completed;

  const session = await mongoose.startSession();
  session.startTransaction();

  let allSubtasksCompleted;
  try {
    await subtask.save(); 

    const allSubtask = await Subtask.find({ taskId: task._id });

    allSubtasksCompleted = allSubtask.every((subtask) => subtask.completed);
  
    if (allSubtasksCompleted) {
      task.completed = true;
    } else {
      task.completed = false; 
    }

    await task.save();

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ taskCompleted: allSubtasksCompleted });

  }  catch (error) {
    await session.abortTransaction();
    session.endSession();
    return next(new HttpError("Something went wrong, could not update subtask.", 500));
  }  
}

export const updateTaskTime: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const userId = req.userData!.userId;
  const taskId = req.params.tid;
  const { timeSpent, lastStartTime } = req.body;
  
  let task;
  try {
    task = await Task.findById(taskId);

    if (!task || task.creator.toString() !== userId) {
      return next(new HttpError("You are not authorized to update this subtask.", 401));
    }

  } catch (error) {
    return next(new HttpError("Something went wrong, could not verify task.", 500));
  }
  
  task.timeSpent = timeSpent;
  task.lastStartTime = lastStartTime;

  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    await task.save();
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ timeSpent: task.timeSpent, lastStartTime: task.lastStartTime });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return next(new HttpError("Something went wrong, could not verify task.", 500));
  }
}
