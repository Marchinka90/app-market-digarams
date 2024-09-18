import React from "react";
import { Subtask,  TaskListProps } from "../types";

const TaskList: React.FC<TaskListProps> = ({ tasks, onTaskClick }) => {
  
  const calculateCompletionPercentage = (subtasks: Subtask[]) => {
    const completedSubtasks = subtasks.filter((subtask) => subtask.completed).length;
    return Math.round((completedSubtasks / subtasks.length) * 100);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Task List</h2>
      {tasks.length === 0 ? (
        <p className="text-gray-500">No tasks available</p>
      ) : (
        tasks.map((task) => {
          const completionPercentage = calculateCompletionPercentage(task.subtasks);
          return (
            <div
              key={task.id}
              className="mb-4 p-4 bg-white rounded-md shadow-sm cursor-pointer"
              onClick={() => onTaskClick(task)}
            >
              <h4 className="text-lg font-semibold">{task.title}</h4>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-green-500 h-2.5 rounded-full"
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
                <p className="text-sm mt-1">{completionPercentage}% complete</p>
              </div>
              <p className="text-sm mt-2">
                <strong>Time Estimate:</strong> {task.timeEstimate} minutes
                / <strong>Time Estimate:</strong> {task.timeSpent} minutes
              </p>
            </div>
          );
        })
      )}
    </div>
  );
};

export default TaskList;
