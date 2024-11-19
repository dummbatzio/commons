import type { TaskPriority, TaskRepeat } from "./tasks";

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
  profile?: Profile | null;
}

export interface Profile {
  id: string;
  status: string;
  visibility: string;
  firstname?: string | null;
  lastname?: string | null;
  bio?: string | null;
}

export interface TaskCategory {
  id: string;
  name: string;
  parent?: TaskCategory;
}

export interface Task {
  id?: string;
  title: string;
  description?: string | null;
  priority: TaskPriority;
  expense: number;
  factor: number;
  due?: Date | null;
  categories?: TaskCategory[] | null;
  type?: string | null;
  status: string;
  repeat?: TaskRepeat;
}
