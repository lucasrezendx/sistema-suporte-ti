
export interface Task {
  id: string;
  description: string;
  requester: string;
  urgency: UrgencyLevel;
  category: TaskCategory;
  status: TaskStatus;
  createdAt: Date;
  resolvedAt?: Date | null;
  updatedAt: Date;
}

export enum UrgencyLevel {
  URGENT = 'URGENT',
  IMPORTANT = 'IMPORTANT',
  NOT_URGENT = 'NOT_URGENT',
  NOT_IMPORTANT = 'NOT_IMPORTANT'
}

export enum TaskCategory {
  EXPANSION = 'EXPANSION',
  SUPPORT = 'SUPPORT',
  MONITORING = 'MONITORING',
  CENTRAL_PROJECTS = 'CENTRAL_PROJECTS'
}

export enum TaskStatus {
  PENDING = 'PENDING',
  RESOLVED = 'RESOLVED'
}

export interface TaskFilters {
  urgency?: UrgencyLevel;
  category?: TaskCategory;
  status?: TaskStatus;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface CreateTaskData {
  description: string;
  requester: string;
  urgency: UrgencyLevel;
  category: TaskCategory;
}

export interface UpdateTaskData {
  description?: string;
  requester?: string;
  urgency?: UrgencyLevel;
  category?: TaskCategory;
  status?: TaskStatus;
}
