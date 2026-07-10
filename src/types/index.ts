export type Priority = 'low' | 'medium' | 'high';

export interface User {
  id: string;
  name: string;
  avatar: string;
}

export interface Task {
  id: string;
  columnId: string;
  title: string;
  description: string;
  priority: Priority;
  assigneeId: string | null;
  order: number;
}

export interface Column {
  id: string;
  title: string;
  taskIds: string[];
}

export interface Board {
  id: string;
  title: string;
  columnIds: string[];
}

export type AsyncStatus = 'idle' | 'loading' | 'succeeded' | 'failed';
