import React, { useState, useEffect } from "react";
import TaskList from "./components/TaskList";
import TaskDetails from "./components/TaskDetails";
import { Subtask, Task, Time } from "./types";
import { useHttpClient } from "../shared/hooks/http-hook";
import { useTaskContext } from './context/TaskContext';

const Sidebar = () => {

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const { isLoading, sendRequest, error, clearError } = useHttpClient();
  const {  tasks, setTasks, token } = useTaskContext();

  useEffect(() => {
    if (selectedTask) {
      tasks.map(task => {
        if (task.id === selectedTask.id) {
          setSelectedTask(task);
        } 
      });
    }
  }, [tasks]);


  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };
  
  const handleBackToList = () => {
    setSelectedTask(null);
  };

  const handleUpdateSubtask = (subtask: Subtask) => {
    sendRequest(
      `http://localhost:3000/api/tasks/subtask/${subtask.id}`,
      "POST",
      JSON.stringify({
        completed: subtask.completed
      }),
      {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    )
      .then((resData) => {
        let taskWithUpdatedSubtask = {...selectedTask};
        
        taskWithUpdatedSubtask.subtasks.map(sub => {
          if (sub.id === subtask.id) {
            sub.completed = subtask.completed
          } 
        });
        
        taskWithUpdatedSubtask.completed = resData.taskCompleted;
        const allTasks = tasks.map((task) => (task.id === taskWithUpdatedSubtask.id ? taskWithUpdatedSubtask : task));
        setTasks(allTasks);
        setSelectedTask(taskWithUpdatedSubtask);
      })
      .catch((err) => {
        console.log(error);
      });
  };

  if (!token) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold">
          You need to log in to view tasks.
        </p>
      </div>
    );
  }

  return (
      <div className="w-full p-6 bg-gray-100 rounded-lg shadow-md max-h-screen overflow-y-auto">
        {!selectedTask ? (
          <TaskList tasks={tasks} onTaskClick={handleTaskClick} />
        ) : (
          <TaskDetails 
            task={selectedTask} 
            onBack={handleBackToList} 
            onUpdateSubtask={handleUpdateSubtask} 
          />
        )}
      </div>
  );
};

export default Sidebar;
