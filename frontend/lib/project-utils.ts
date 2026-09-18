import { Project, Task, ProjectWithStats } from '@/types';

/**
 * Get all tasks belonging to a specific project
 */
export function getTasksForProject(tasks: Task[], projectId: string): Task[] {
  return tasks.filter((task) => task.project_id === projectId);
}

/**
 * Get total task count for a project
 */
export function getProjectTaskCount(tasks: Task[], projectId: string): number {
  return getTasksForProject(tasks, projectId).length;
}

/**
 * Get completed task count for a project
 */
export function getCompletedTaskCount(
  tasks: Task[],
  projectId: string
): number {
  return getTasksForProject(tasks, projectId).filter(
    (task) => task.status === 'done'
  ).length;
}

/**
 * Calculate project progress percentage (0-100)
 */
export function getProjectProgress(
  tasks: Task[],
  projectId: string
): number {
  const projectTasks = getTasksForProject(tasks, projectId);
  if (projectTasks.length === 0) return 0;

  const completedTasks = projectTasks.filter(
    (task) => task.status === 'done'
  ).length;
  return Math.round((completedTasks / projectTasks.length) * 100);
}

/**
 * Get project by ID
 */
export function getProjectById(
  projects: Project[],
  projectId: string
): Project | undefined {
  return projects.find((p) => p.id === projectId);
}

/**
 * Enrich a project with derived statistics
 */
export function enrichProjectWithStats(
  project: Project,
  tasks: Task[]
): ProjectWithStats {
  return {
    ...project,
    progress: getProjectProgress(tasks, project.id),
    taskCount: getProjectTaskCount(tasks, project.id),
    completedCount: getCompletedTaskCount(tasks, project.id),
  };
}

/**
 * Enrich multiple projects with derived statistics
 */
export function enrichProjectsWithStats(
  projects: Project[],
  tasks: Task[]
): ProjectWithStats[] {
  return projects.map((project) => enrichProjectWithStats(project, tasks));
}

/**
 * Get project color tone based on index or ID
 * (Used for visual differentiation in UI)
 */
export function getProjectTone(project: Project, index: number): string {
  const tones = [
    '#b8ff3d', // lime (primary)
    '#9ad8ff', // blue
    '#ffc46b', // orange
    '#e4a7ff', // purple
    '#ff8c9b', // pink
    '#75e4c0', // green
  ];
  return tones[index % tones.length];
}
