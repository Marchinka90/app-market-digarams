import React, { useState, useEffect } from "react";
import { useHttpClient } from "../shared/hooks/http-hook";

import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";
import { Task } from "./types";

const OptionsPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [updateTask, setUpdateTask] = useState(false);
  const [token, setToken] = useState("");
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

  const fetchAllTasks = (token: string) => {
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
  }

  const handleTaskSubmit = (newTask: Task) => {
    if (updateTask) {
      sendRequest(
        `http://localhost:3000/api/tasks/${newTask.id}`,
        "PATCH",
        JSON.stringify({
          title: newTask.title,
          description: newTask.description,
          timeEstimate: newTask.timeEstimate,
          subtasks: newTask.subtasks.map(task => {
            return {id: task.id, title: task.title, completed: task.completed}
          })
        }),
        {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      )
        .then((resData) => {
          const allTasks = tasks.map((task) => (task.id === resData.task.id ? resData.task : task));
          setTasks(allTasks);
        })
        .catch((err) => {
          console.log(error);
        });
    } else {
      sendRequest(
        "http://localhost:3000/api/tasks/create",
        "POST",
        JSON.stringify({
          title: newTask.title,
          description: newTask.description,
          timeEstimate: newTask.timeEstimate,
          subtasks: newTask.subtasks.map(task => {
            return {title: task.title}
          })
        }),
        {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      )
        .then((resData) => {
          const allTasks = [...tasks, resData.task];
          setTasks(allTasks);
        })
        .catch((err) => {
          console.log(error);
        });
    }

    setSelectedTask(null);
    setUpdateTask(false);
  };

  const handleEditTask = (id: string) => {
    const taskForEdit = tasks.find((task) => task.id == id);
    setSelectedTask(taskForEdit);
    setUpdateTask(true);
  };

  const handleDeleteTask = (id: string) => {
    sendRequest(
      `http://localhost:3000/api/tasks/${id}`,
      "DELETE",
      null,
      {
        "Authorization": `Bearer ${token}`
      }
    )
      .then((resData) => {
        const allTasks = tasks.filter((task) => task.id !== id);
        setTasks(allTasks);
      })
      .catch((err) => {
        console.log(error);
      });
  };

  if (!token) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl font-semibold text-gray-600">
          You must be logged in to manage tasks.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-screen space-x-6 p-6">
      <TaskList
        tasks={tasks}
        selectedTask={selectedTask}
        onEditTask={handleEditTask}
        onDeleteTask={handleDeleteTask}
      />
      <TaskForm task={selectedTask} onSubmit={handleTaskSubmit} />
    </div>
  );
};

export default OptionsPage;
