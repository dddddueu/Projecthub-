import { Timestamp } from 'firebase/firestore';

export type ProjectStatus = 'planning' | 'in_progress' | 'completed' | 'on_hold';
export type ProjectPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Project {
  id: string;
  userId: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  createdAt: Timestamp | { seconds: number; nanoseconds: number };
  updatedAt: Timestamp | { seconds: number; nanoseconds: number };
}

export interface CreateProjectInput {
  name: string;
  description?: string;
  status?: ProjectStatus;
  priority?: ProjectPriority;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
  status?: ProjectStatus;
  priority?: ProjectPriority;
}

export type ViewMode = 'grid' | 'table';
export type SortOption = 'newest' | 'oldest' | 'name-asc' | 'name-desc' | 'priority';
