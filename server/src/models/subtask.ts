import mongoose, { Document, Schema } from "mongoose";

export interface ISubtask extends Document {
  title: string;
  completed: boolean;
  taskId: mongoose.Types.ObjectId;
}

const SubtaskSchema: Schema = new Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  taskId: { type: mongoose.Types.ObjectId, required: true, ref: "Task" },
});

const Subtask = mongoose.model<ISubtask>("Subtask", SubtaskSchema);

export default Subtask;
