import React, { useState, useEffect } from "react";
import { Task, TaskFormProps, Subtask } from "../types";
import { v4 as uuidv4 } from 'uuid'; 

const TaskForm: React.FC<TaskFormProps> = ({ task, onSubmit }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [timeEstimate, setTimeEstimate] = useState(0);
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtask, setNewSubtask] = useState("");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setTimeEstimate(task.timeEstimate);
      setSubtasks(task.subtasks);
    } else {
      resetForm();
    }
  }, [task]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setTimeEstimate(0);
    setSubtasks([]);
    setNewSubtask("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (subtasks.length === 0) return alert('Need atleast 1 subtask'); // error
    const newTask: Task = {
      id: task?.id || '',
      title,
      description,
      timeEstimate,
      subtasks,
    };
    onSubmit(newTask);
    resetForm();
  };

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {  
      setSubtasks([...subtasks, { id: uuidv4(), title: newSubtask, completed: false }]);
      setNewSubtask("");
    }
  };

  const handleRemoveSubtask = (subtaskId: string) => {
    const filteredSubtasks = subtasks.filter((subtask) => subtask.id !== subtaskId);
    setSubtasks([...filteredSubtasks]);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-white rounded-lg shadow-md w-2/3"
    >
      <h2 className="text-2xl font-semibold mb-4">
        {task ? "Edit Task" : "Add New Task"}
      </h2>

      <div className="mb-4">
        <label htmlFor="title" className="block mb-2">
          Title
        </label>
        <input
          id="title"
          type="text"
          className="w-full p-2 border rounded-md"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="block mb-2">
          Description
        </label>
        <textarea
          id="description"
          className="w-full p-2 border rounded-md"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>
      </div>

      <div className="mb-4">
        <label htmlFor="timeEstimate" className="block mb-2">
          Time Estimate (minutes)
        </label>
        <input
          id="timeEstimate"
          type="number"
          className="w-full p-2 border rounded-md"
          value={timeEstimate}
          onChange={(e) => setTimeEstimate(parseInt(e.target.value))}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Subtasks</label>
        {subtasks.map((subtask, index) => (
          <div key={subtask.id} className="flex items-center mb-2">
          <span className="flex-1">{subtask.title}</span>
          <button
            type="button"
            onClick={() => handleRemoveSubtask(subtask.id)}
            className="ml-2 px-2 py-1 bg-red-500 text-white rounded-md"
          >
            Remove
          </button>
        </div>
        ))}

        <div className="flex">
          <input
            type="text"
            value={newSubtask}
            onChange={(e) => setNewSubtask(e.target.value)}
            className="w-full p-2 border rounded-md mr-2"
            placeholder="Add new subtask"
          />
          <button
            type="button"
            onClick={handleAddSubtask}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Add
          </button>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
      >
        {task ? "Update Task" : "Add Task"}
      </button>
    </form>
  );
};

export default TaskForm;
