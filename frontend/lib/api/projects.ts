import { apiClient } from "./client";
import type {
  Project,
  CreateProjectInput,
} from "@/types";

export interface ProjectsResponse {
  success: boolean;
  data: Project[];
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
  // Future: Add filtering/sorting params here
}

export async function getProjects(
  params: GetProjectsParams = {}
): Promise<ProjectsResponse> {
  return apiClient.get<ProjectsResponse>('/projects');
}

export async function getProject(
  id: string
): Promise<ProjectResponse> {
  const url = `/projects/${encodeURIComponent(id)}`;
  console.log('getProject API call:', { id, url, idLength: id.length });
  return apiClient.get<ProjectResponse>(url);
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