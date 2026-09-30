import { apiClient } from "./client";

import type {
  Task,
  CreateTaskInput,
  UpdateTaskInput,
} from "@/types";

export interface TasksResponse {
  success: boolean;
  data: Task[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
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
  sort_by?: "due_date" | "created_at" | "priority";
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export async function getTasks(
  projectId: string,
  params: GetTasksParams = {}
): Promise<TasksResponse> {
  const query = new URLSearchParams();

  if (params.status) {
    query.set("status", params.status);
  }

  if (params.sort_by) {
    query.set("sort_by", params.sort_by);
  }

  if (params.order) {
    query.set("order", params.order);
  }

  query.set("page", String(params.page ?? 1));
  query.set("limit", String(params.limit ?? 10));

  return apiClient.get<TasksResponse>(
    `/projects/${encodeURIComponent(projectId)}/tasks?${query.toString()}`
  );
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