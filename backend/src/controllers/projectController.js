const projectService = require('../services/projectService');
const taskService = require('../services/taskService');

class ProjectController {
  /**
   * GET /projects
   * Get all projects
   */
  async getProjects(req, res, next) {
    try {
      const projects = await projectService.getProjects();
      res.json({
        success: true,
        data: projects,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /projects/:id
   * Get a single project by ID
   */
  async getProjectById(req, res, next) {
    try {
      const { id } = req.params;
      const project = await projectService.getProjectById(id);

      if (!project) {
        return res.status(404).json({
          success: false,
          error: 'Project not found',
        });
      }

      res.json({
        success: true,
        data: project,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /projects
   * Create a new project
   */
  async createProject(req, res, next) {
    try {
      const project = await projectService.createProject(req.body);

      res.status(201).json({
        success: true,
        data: project,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /projects/:id
   * Update a project
   */
  async updateProject(req, res, next) {
    try {
      const { id } = req.params;

      // Check if project exists
      const exists = await projectService.projectExists(id);
      if (!exists) {
        return res.status(404).json({
          success: false,
          error: 'Project not found',
        });
      }

      const project = await projectService.updateProject(id, req.body);

      res.json({
        success: true,
        data: project,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /projects/:id
   * Delete a project (and cascade delete its tasks)
   */
  async deleteProject(req, res, next) {
    try {
      const { id } = req.params;

      const deleted = await projectService.deleteProject(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: 'Project not found',
        });
      }

      res.json({
        success: true,
        message: 'Project deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /projects/:project_id/tasks
   * Get all tasks for a specific project
   */
  async getProjectTasks(req, res, next) {
    try {
      const { project_id } = req.params;

      // Check if project exists
      const projectExists = await projectService.projectExists(project_id);
      if (!projectExists) {
        return res.status(404).json({
          success: false,
          error: 'Project not found',
        });
      }

      // Extract query parameters for filtering/sorting
      const filters = {
        status: req.query.status,
        priority: req.query.priority,
        sortBy: req.query.sortBy,
        sortOrder: req.query.sortOrder,
        limit: req.query.limit,
        offset: req.query.offset,
      };

      const tasks = await taskService.getTasksByProject(project_id, filters);

      res.json({
        success: true,
        data: tasks,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /projects/:project_id/tasks
   * Create a new task for a project
   */
  async createProjectTask(req, res, next) {
    try {
      const { project_id } = req.params;

      // Check if project exists
      const projectExists = await projectService.projectExists(project_id);
      if (!projectExists) {
        return res.status(404).json({
          success: false,
          error: 'Project not found',
        });
      }

      const task = await taskService.createTask(project_id, req.body);

      res.status(201).json({
        success: true,
        data: task,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProjectController();
