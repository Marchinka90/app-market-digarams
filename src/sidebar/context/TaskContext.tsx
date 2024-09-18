import React, { createContext, useContext, useState, useEffect, useCallback,ReactNode } from 'react';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { Subtask, Task, Time, TaskContextType } from "../types";

const TaskContext = createContext<TaskContextType | null>(null);

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [token, setToken] = useState(null);
  const { isLoading, sendRequest, error, clearError } = useHttpClient();

  useEffect(() => {
    chrome.storage.onChanged.addListener((changes, area) => {
      if (changes.token) {
        if (changes.token.newValue) {
          setToken(changes.token.newValue);
          fetchAllTasks(changes.token.newValue); 
        } else {
          setToken(""); 
        }
      }
    });

    chrome.storage.session.get(["token"], (sessionResult) => {
      if (sessionResult.token) {
        setToken(sessionResult.token);
        fetchAllTasks(sessionResult.token); 
      } else {
        chrome.storage.sync.get(["token"], (syncResult) => {
          if (syncResult.token) {
            setToken(syncResult.token);
            fetchAllTasks(syncResult.token);
          }
        });
      }
    });

    return () => {
      chrome.storage.onChanged.removeListener(() => {});
    };
  }, []);

  const fetchAllTasks = useCallback(async (token: string) => {
    if (!token) return;
    sendRequest("http://localhost:3000/api/tasks", "GET", null, {
      "Authorization": `Bearer ${token}`
    })
      .then((resData) => {
        setTasks(resData.tasks);
      })
      .catch((err) => {
        console.log(error);
      });
  }, []);

  const startTimer = async (taskId: string) => {
    const currentTime = Date.now();
    const selectedTask = tasks.filter((task) => task.id === taskId)[0];
    const result = await updateTaskTime(taskId, selectedTask.timeSpent, currentTime);
    const allTasks = tasks.map((task) => (task.id === taskId ? {
      ...task, timeSpent: result.timeSpent, lastStartTime: result.lastStartTime
    } : task));

    setTasks(allTasks);
  };

  const stopTimer = async (taskId: string) => {
    const selectedTask = tasks.filter((task) => task.id === taskId)[0];
    if(selectedTask.lastStartTime) {
      const currentTime = Date.now();
      const timeElapsed = Math.floor((currentTime - selectedTask.lastStartTime) / 1000 / 60); 
      const timespent = selectedTask.timeSpent + timeElapsed;
  
      const result = await updateTaskTime(taskId, timespent, null);

      const allTasks = tasks.map((task) => (task.id === taskId ? {
        ...task, timeSpent: result.timeSpent, lastStartTime: result.lastStartTime
      } : task));
  
      setTasks(allTasks);
    }
  };

  useEffect(() => {
    const updateAllTasksTime = async () => {
      const updatedTasks = await Promise.all(
        tasks.map(async (task) => {
          if (task.lastStartTime) {
            const currentTime = Date.now();
            const timeElapsed = Math.floor((currentTime - task.lastStartTime) / 1000 / 60);
            const timespent = task.timeSpent + timeElapsed;
            const result = await updateTaskTime(task.id, timespent, currentTime);
      
            return { ...task, timeSpent: result.timeSpent, lastStartTime: result.lastStartTime };
          }
          return task;
        })
      );
  
      setTasks(updatedTasks);
    };
    
    const interval = setInterval(() => {
      updateAllTasksTime();
    }, 60000); 

    return () => clearInterval(interval);
  }, [tasks]);

  const updateTaskTime = async (taskId: string, timeSpent: number, lastStartTime: number | null) => {
    return sendRequest(
      `http://localhost:3000/api/tasks/${taskId}/time`,
      "POST",
      JSON.stringify({
        timeSpent,
        lastStartTime
      }),
      {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    )
      .then((resData) => {return resData})
      .catch((err) => {
        console.log(error);
      });
  } 

  return (
    <TaskContext.Provider value={{ tasks, setTasks, token, startTimer, stopTimer }}>
      {children}
    </TaskContext.Provider>
  );
}