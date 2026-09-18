// ============================================
// CORE API-COMPATIBLE TYPES
// ============================================

export type TaskStatus = "todo" | "in-progress" | "done";
export type TaskPriority = "low" | "medium" | "high";

/**
 * Project entity - matches backend contract
 */
export interface Project {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

/**
 * Task entity - matches backend contract
 */
export interface Task {
  id: string;
  project_id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  created_at: string;
}

// ============================================
// API INPUT TYPES (for future use)
// ============================================

export interface CreateProjectInput {
  name: string;
  description?: string;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
}

export interface CreateTaskInput {
  project_id: string;
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  due_date?: string | null;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  due_date?: string | null;
}

// ============================================
// DERIVED UI TYPES
// ============================================

/**
 * Extended project data with derived statistics
 * Used for UI display only - not stored in backend
 */
export interface ProjectWithStats extends Project {
  progress: number;
  taskCount: number;
  completedCount: number;
}

/**
 * Extended task data with derived display information
 * Used for UI display only - not stored in backend
 */
export interface TaskWithProject extends Task {
  projectName: string;
  isOverdue: boolean;
  displayDueDate: string;
}
