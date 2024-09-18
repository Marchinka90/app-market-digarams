
# Chrome Extension Task Tracker

## Overview
The Chrome Extension Task Tracker is a productivity tool designed to help users manage and track their tasks directly from their browser. This extension allows users to create tasks, start and stop timers, and monitor their progress in real time.Each task has an estimated time for completion, and users can track the actual time spent on each task. The extension provides an intuitive interface for organizing tasks, subtasks, and tracking their completion status. The application is built with Node.js, Express.js, and TypeScript, with a MongoDB database for storing task data.

## Features
- Popup: Users can easily log in and out of their account using the extension’s popup. 
- Options: The options page allows users to create, update, and manage tasks and subtasks.
- Side Panel: The side panel provides real-time tracking of tasks, allowing users to start and stop timers, monitor time spent on tasks, and track progress towards completion.

## Installation

### Prerequisites
- Node.js (v20 or later)
- npm (v8 or later)
- MongoDB

### Setup

1. #### Clone the repository: 

```bash
git clone https://github.com/Marchinka90/chrome-extension-task-tracker

cd chrome-extension-task-tracker
```

2. #### Install dependencies: 

```bash
npm install
```

3. #### Compile TypeScript and build the dist folder:

```bash
npm run build
```

4. #### Install dependencies on server: 

```bash
cd server
npm install
```

5. #### Environment Variables: 
```bash
# Example Variables
PORT=3000
MONGODB_URI=mongodb://localhost:27017/ext-task-manager
JWT_SECRET_KEY=privat_super_secret_key
```

6. #### Start the server:
```bash
npm dev
```

## Adding the Chrome Extension
To add the Chrome Extension Task Tracker to your Chrome browser, follow these steps:

1. #### Open Chrome Extensions Page:

- Open Google Chrome.
- Go to the Chrome Extensions page by navigating to chrome://extensions/.

2. #### Enable Developer Mode:
- In the top-right corner of the Extensions page, toggle the Developer mode switch to On.

3. #### Load Unpacked Extension:

- Click the Load unpacked button.
- A file dialog will appear. Navigate to the directory containing your extension files. This is typically the frontend directory where the compiled extension files are located.

4. #### Select Extension Folder:

- Select the dist folder and click Select Folder (or Open).

5. #### Extension Loaded:

- The extension should now appear in the list of installed extensions. You can click on Details to configure or inspect the extension.

6. #### Testing the Extension:

- Click on the extension icon in the Chrome toolbar to open the popup.
- Use the extension to ensure it is functioning as expected. You should be able to log in, create and update tasks, and manage the task details.