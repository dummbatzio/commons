import type { TaskPriority, TaskRepeat, TaskStatus } from "./tasks";

export interface Assignment {
  id: string;
  title: string;
  status: string;
  description: string;
  reward: number;
}

export interface User {
  id: string;
  status: string;
  username: string;
  email: string;
  firstname?: string | null;
  lastname?: string | null;
  bio?: string | null;
  profile?: Profile | null;
  visibility: string;
}

export interface Profile {
  id: string;
  type: string;
}

export interface TaskCategory {
  id: string;
  name: string;
  parent?: TaskCategory | null;
}

export interface Task {
  id?: string;
  title: string;
  description?: string | null;
  priority: TaskPriority | string;
  expense: number;
  factor: number;
  due?: Date | null;
  categories?: TaskCategory[] | null;
  type?: string | null;
  status: TaskStatus | string;
  repeat?: TaskRepeat | string | null;
  parent?: Partial<Task> | null;
  series?: Partial<Task>[] | null;
}

export interface Link {
  id?: string;
  label: string;
  url: string;
}
