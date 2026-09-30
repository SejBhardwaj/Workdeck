import { apiClient } from "./client";

import type {
  Task,
  CreateTaskInput,
  UpdateTaskInput,
} from "@/types";

export interface TasksResponse {
  success: boolean;
  data: Task[];
}

export interface TaskResponse {
  success: boolean;
  data: Task;
}

export interface DeleteTaskResponse {
  success: boolean;
  message?: string;
}

export interface GetTasksParams {
  status?: "todo" | "in-progress" | "done";
  sortBy?: "due_date" | "created_at" | "priority";
  sortOrder?: "asc" | "desc";
}

export async function getTasks(
  projectId: string,
  params: GetTasksParams = {}
): Promise<TasksResponse> {
  const query = new URLSearchParams();

  if (params.status) {
    query.set("status", params.status);
  }

  if (params.sortBy) {
    query.set("sortBy", params.sortBy);
  }

  if (params.sortOrder) {
    query.set("sortOrder", params.sortOrder);
  }

  const queryString = query.toString();
  const url = `/projects/${encodeURIComponent(projectId)}/tasks${queryString ? `?${queryString}` : ''}`;
  
  return apiClient.get<TasksResponse>(url);
}

export async function createTask(
  projectId: string,
  data: CreateTaskInput
): Promise<TaskResponse> {
  return apiClient.post<TaskResponse>(
    `/projects/${encodeURIComponent(projectId)}/tasks`,
    data
  );
}

export async function updateTask(
  id: string,
  data: UpdateTaskInput
): Promise<TaskResponse> {
  return apiClient.put<TaskResponse>(
    `/tasks/${encodeURIComponent(id)}`,
    data
  );
}

export async function deleteTask(
  id: string
): Promise<DeleteTaskResponse> {
  return apiClient.delete<DeleteTaskResponse>(
    `/tasks/${encodeURIComponent(id)}`
  );
}