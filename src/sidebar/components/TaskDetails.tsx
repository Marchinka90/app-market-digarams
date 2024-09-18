import React, { useState, useEffect, useRef } from "react";
import { Task, TaskDetailsProps, Time } from "../types";
import { useTaskContext } from "../context/TaskContext";

const TaskDetails: React.FC<TaskDetailsProps> = ({
  task,
  onBack,
  onUpdateSubtask
}) => {
  const [subtasks, setSubtasks] = useState(task.subtasks);
  const [isTaskCompleted, setIsTaskCompleted] = useState(task.completed);
  const [timeSpent, setTimeSpent] = useState(task.timeSpent || 0);
  const [timerActive, setTimerActive] = useState(false);

  const {  startTimer, stopTimer } = useTaskContext();

  useEffect(() => {
    if (task.lastStartTime !== null) {
      setTimerActive(true);
      const currentTime = Date.now();
      const timeElapsed = Math.floor((currentTime - task.lastStartTime) / 1000 / 60);
      setTimeSpent(task.timeSpent + timeElapsed);
    }
    
    if (task.completed) {
      setIsTaskCompleted(true);
      if (timerActive) {
        stopTimer(task.id);
      }
    } else {
      setIsTaskCompleted(false);
    }
  }, [task]);

  const handleSubtaskToggle = (id: string) => {
    const updatedSubtask = subtasks.filter((subtask) => subtask.id == id)[0];
    onUpdateSubtask({...updatedSubtask, completed: !updatedSubtask.completed});
  };

  const handleStartPause = () => {
    if (timerActive) {
      stopTimer(task.id);
      setTimerActive(false);
    } else {
      startTimer(task.id);
      setTimerActive(true);
    }
  };

  const timeRemaining = task.timeEstimate - timeSpent;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-h-screen overflow-y-auto">
      <button onClick={onBack} className="mb-4 text-blue-500 hover:underline">
        Back to task list
      </button>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold">{task.title}</h2>
        <p className="text-gray-600 mt-2">{task.description}</p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold">Subtasks</h3>
        <ul className="list-disc pl-5">
          {subtasks.map((subtask, index) => (
            <li key={subtask.id} className="mb-2 flex items-center">
              <input
                type="checkbox"
                checked={subtask.completed}
                onChange={() => handleSubtaskToggle(subtask.id)}
                className="mr-2"
              />
              <span
                className={
                  subtask.completed ? "line-through text-gray-500" : ""
                }
              >
                {subtask.title}
              </span>
            </li>
          ))}
        </ul>

        {isTaskCompleted && (
          <p className="mt-4 text-green-600 font-semibold">
            Task is completed!
          </p>
        )}
      </div>

      {!isTaskCompleted && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Time Management</h3>
          <p className="text-sm">
            <strong>Time Estimate:</strong> {task.timeEstimate} minutes
          </p>
          <p className="text-sm">
            <strong>Time Spent:</strong> {timeSpent} minutes
          </p>
          <p className="text-sm">
            <strong>Time Remaining:</strong>{" "}
            {timeRemaining > 0 ? timeRemaining : 0} minutes
          </p>

          <div className="mt-4 flex space-x-4">
            <button
              onClick={handleStartPause}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            >
              {timerActive ? "Pause" : "Start"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDetails;
