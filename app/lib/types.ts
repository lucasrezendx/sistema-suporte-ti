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

// Inventory Types
export interface InventoryItem {
  id: string;
  name: string;
  category: InventoryCategory;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

export enum InventoryCategory {
  KEYBOARD = 'KEYBOARD',
  MOUSE = 'MOUSE',
  MONITOR = 'MONITOR',
  HEADSET = 'HEADSET',
  WEBCAM = 'WEBCAM',
  OTHER = 'OTHER'
}

export interface InventoryTransaction {
  id: string;
  itemId: string;
  type: TransactionType;
  quantity: number;
  recipient?: string;
  notes?: string;
  createdAt: Date;
}

export enum TransactionType {
  IN = 'IN',
  OUT = 'OUT'
}

export interface CreateInventoryItemData {
  name: string;
  category: InventoryCategory;
  quantity: number;
}

export interface CreateInventoryTransactionData {
  itemId: string;
  type: TransactionType;
  quantity: number;
  recipient?: string;
  notes?: string;
}