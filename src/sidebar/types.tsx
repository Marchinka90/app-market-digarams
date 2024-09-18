export interface Subtask {
  id: string;
  title: string; 
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  timeEstimate: number;
  timeSpent: number;
  completed: boolean,
  subtasks: Subtask[];
  lastStartTime?: number;
}

export interface Time {
  timeSpent: number; 
  lastStartTime: number | null;
}

export interface TaskDetailsProps {
  task: Task | null;
  onBack: () => void;
  onUpdateSubtask: (subtask: Subtask) => void;
}

export interface TaskListProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

export interface TaskContextType {
  tasks: Task[];
  token: string;
  setTasks: (tasks: Task[]) => void;
  startTimer: (taskId: string) => void;
  stopTimer: (taskId: string) => void;
}