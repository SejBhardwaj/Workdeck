import { Task, TaskStatus, TaskPriority, Project, TaskWithProject } from '@/types';
import { formatDistanceToNow, format, isPast, parseISO } from 'date-fns';

/**
 * Check if a task is overdue
 * A task is overdue if it has a due date in the past and is not done
 */
export function isTaskOverdue(task: Task): boolean {
  if (!task.due_date || task.status === 'done') return false;
  return isPast(parseISO(task.due_date));
}

/**
 * Get overdue tasks from a list
 */
export function getOverdueTasks(tasks: Task[]): Task[] {
  return tasks.filter(isTaskOverdue);
}

/**
 * Get upcoming tasks (not overdue, not done)
 */
export function getUpcomingTasks(tasks: Task[]): Task[] {
  return tasks.filter(
    (task) => task.status !== 'done' && !isTaskOverdue(task)
  );
}

/**
 * Get tasks by status
 */
export function getTasksByStatus(tasks: Task[], status: TaskStatus): Task[] {
  return tasks.filter((task) => task.status === status);
}

/**
 * Get tasks by priority
 */
export function getTasksByPriority(
  tasks: Task[],
  priority: TaskPriority
): Task[] {
  return tasks.filter((task) => task.priority === priority);
}

/**
 * Format task due date for display
 * Returns user-friendly strings like "Tomorrow", "In 3 days", "Apr 15"
 */
export function formatTaskDueDate(task: Task): string {
  if (!task.due_date) return 'No due date';

  const dueDate = parseISO(task.due_date);
  const now = new Date();

  // If overdue
  if (isTaskOverdue(task)) {
    const distance = formatDistanceToNow(dueDate, { addSuffix: true });
    return distance.replace('about ', '');
  }

  // Calculate days difference
  const diffTime = dueDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays <= 7) return `In ${diffDays} days`;

  // Format as "Apr 15"
  return format(dueDate, 'MMM dd');
}

/**
 * Format task created date for display
 * Returns format like "Apr 09"
 */
export function formatTaskCreatedDate(task: Task): string {
  const createdDate = parseISO(task.created_at);
  return format(createdDate, 'MMM dd');
}

/**
 * Format project created date for display
 * Returns format like "Mar 20"
 */
export function formatProjectCreatedDate(createdAt: string): string {
  const createdDate = parseISO(createdAt);
  return format(createdDate, 'MMM dd');
}

/**
 * Get project name for a task
 */
export function getProjectForTask(
  task: Task,
  projects: Project[]
): Project | undefined {
  return projects.find((p) => p.id === task.project_id);
}

/**
 * Get project name for a task
 */
export function getProjectNameForTask(
  task: Task,
  projects: Project[]
): string {
  const project = getProjectForTask(task, projects);
  return project ? project.name : 'Unknown Project';
}

/**
 * Enrich a task with derived display information
 */
export function enrichTaskWithProject(
  task: Task,
  projects: Project[]
): TaskWithProject {
  return {
    ...task,
    projectName: getProjectNameForTask(task, projects),
    isOverdue: isTaskOverdue(task),
    displayDueDate: formatTaskDueDate(task),
  };
}

/**
 * Enrich multiple tasks with derived display information
 */
export function enrichTasksWithProject(
  tasks: Task[],
  projects: Project[]
): TaskWithProject[] {
  return tasks.map((task) => enrichTaskWithProject(task, projects));
}

/**
 * Format task status for display
 * Converts API format to UI format
 */
export function formatTaskStatus(status: TaskStatus): string {
  const statusMap: Record<TaskStatus, string> = {
    todo: 'Todo',
    'in-progress': 'In Progress',
    done: 'Done',
  };
  return statusMap[status];
}

/**
 * Format task priority for display
 * Converts API format to UI format
 */
export function formatTaskPriority(priority: TaskPriority): string {
  const priorityMap: Record<TaskPriority, string> = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
  };
  return priorityMap[priority];
}

/**
 * Sort tasks by due date (earliest first, null dates last)
 */
export function sortTasksByDueDate(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    if (!a.due_date) return 1;
    if (!b.due_date) return -1;
    return parseISO(a.due_date).getTime() - parseISO(b.due_date).getTime();
  });
}

/**
 * Sort tasks by priority (high > medium > low)
 */
export function sortTasksByPriority(tasks: Task[]): Task[] {
  const priorityOrder: Record<TaskPriority, number> = {
    high: 3,
    medium: 2,
    low: 1,
  };
  return [...tasks].sort(
    (a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]
  );
}
