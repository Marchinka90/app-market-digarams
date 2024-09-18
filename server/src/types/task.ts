export interface ISubtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface ITask {
  id: string;
  title: string;
  description: string;
  timeEstimate: number;
  timeSpent: number;
  completed: boolean;
  subtasks: ISubtask[];
  lastStartTime: number | null;
}
