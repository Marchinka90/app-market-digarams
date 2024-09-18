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
  // timeSpent: number;
  // completed: boolean,
  subtasks: Subtask[];
  // lastStartTime?: number;
}

export interface TaskFormProps {
  task: Task | null;
  onSubmit: (task: Task) => void;
}

export interface TaskListProps {
  tasks: Task[];
  selectedTask: Task;
  onEditTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}