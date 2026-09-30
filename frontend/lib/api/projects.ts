import { apiClient } from "./client";
import type {
  Project,
  CreateProjectInput,
} from "@/types";

export interface ProjectsResponse {
  success: boolean;
  data: Project[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ProjectResponse {
  success: boolean;
  data: Project;
}

export interface DeleteProjectResponse {
  success: boolean;
  message?: string;
}

export interface GetProjectsParams {
  page?: number;
  limit?: number;
}

export async function getProjects(
  params: GetProjectsParams = {}
): Promise<ProjectsResponse> {
  const page = params.page ?? 1;
  const limit = params.limit ?? 10;

  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  return apiClient.get<ProjectsResponse>(
    `/projects?${query.toString()}`
  );
}

export async function getProject(
  id: string
): Promise<ProjectResponse> {
  return apiClient.get<ProjectResponse>(
    `/projects/${encodeURIComponent(id)}`
  );
}

export async function createProject(
  data: CreateProjectInput
): Promise<ProjectResponse> {
  return apiClient.post<ProjectResponse>(
    "/projects",
    data
  );
}

export async function deleteProject(
  id: string
): Promise<DeleteProjectResponse> {
  return apiClient.delete<DeleteProjectResponse>(
    `/projects/${encodeURIComponent(id)}`
  );
}