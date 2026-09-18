import { Project, Task } from '@/types';
import { isTaskOverdue } from './task-utils';

/**
 * Calculate workspace-wide statistics
 */
export interface WorkspaceStats {
  totalProjects: number;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  todoTasks: number;
  overdueTasks: number;
  completionRate: number;
}

export function getWorkspaceStats(
  projects: Project[],
  tasks: Task[]
): WorkspaceStats {
  const completedTasks = tasks.filter((t) => t.status === 'done').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'in-progress')
    .length;
  const todoTasks = tasks.filter((t) => t.status === 'todo').length;
  const overdueTasks = tasks.filter(isTaskOverdue).length;
  const completionRate =
    tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  return {
    totalProjects: projects.length,
    totalTasks: tasks.length,
    completedTasks,
    inProgressTasks,
    todoTasks,
    overdueTasks,
    completionRate,
  };
}

/**
 * Get status distribution for charts
 */
export interface StatusDistribution {
  todo: number;
  inProgress: number;
  done: number;
}

export function getStatusDistribution(tasks: Task[]): StatusDistribution {
  return {
    todo: tasks.filter((t) => t.status === 'todo').length,
    inProgress: tasks.filter((t) => t.status === 'in-progress').length,
    done: tasks.filter((t) => t.status === 'done').length,
  };
}

/**
 * Get priority distribution
 */
export interface PriorityDistribution {
  low: number;
  medium: number;
  high: number;
}

export function getPriorityDistribution(tasks: Task[]): PriorityDistribution {
  return {
    low: tasks.filter((t) => t.priority === 'low').length,
    medium: tasks.filter((t) => t.priority === 'medium').length,
    high: tasks.filter((t) => t.priority === 'high').length,
  };
}
