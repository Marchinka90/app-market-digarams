import React from "react";
import { TaskListProps } from "../types";

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  selectedTask,
  onEditTask,
  onDeleteTask,
}) => {
  return (
    <div className="w-1/3 p-6 bg-gray-100 rounded-lg shadow-md max-h-screen overflow-y-auto">
      <h2 className="text-2xl font-semibold mb-4">Tasks</h2>
      {tasks.length === 0 ? (
        <p className="text-gray-500">No tasks available</p>
      ) : (
        tasks.map((task) => (
          <div key={task.id} className="mb-4 p-4 bg-white rounded-md shadow-sm">
            <h4 className="text-lg font-semibold">{task.title}</h4>
            <p className="text-sm text-gray-600">{task.description}</p>
            <p className="text-sm mt-2">
              <strong>Time Estimate:</strong> {task.timeEstimate} (minutes)
            </p>
            {selectedTask && selectedTask.id == task.id ? null : (
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => onEditTask(task.id)}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDeleteTask(task.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default TaskList;
