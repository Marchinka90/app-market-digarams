import React from "react";
import { createRoot } from "react-dom/client";
import Sidebar from "./sidebar";
import "../assets/taiwlinds.css";
import { TaskProvider } from "./context/TaskContext";

function init() {
  const appContainer = document.createElement("div");
  document.body.appendChild(appContainer);
  if (!appContainer) {
    throw new Error("Can not find AppContainer");
  }
  const root = createRoot(appContainer);
  root.render(
    <TaskProvider>
      <Sidebar />
    </TaskProvider>
  );
}

init();
