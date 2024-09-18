import mongoose, { Document, Schema } from "mongoose";


export interface ITask extends Document {
  title: string;
  description: string;
  timeEstimate: number;
  timeSpent: number;
  completed: boolean;
  lastStartTime: number | null;
  subtasks: mongoose.Types.ObjectId[];
  creator: mongoose.Types.ObjectId;
}

const TaksSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  timeEstimate: { type: Number, required: true },
  timeSpent: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
  lastStartTime: { type: Number, default: null },
  subtasks: [{ type: mongoose.Types.ObjectId, ref: "Subtask" }],
  creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
});

const Task = mongoose.model<ITask>("Task", TaksSchema);

export default Task;
