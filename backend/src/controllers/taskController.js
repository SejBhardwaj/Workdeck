const taskService = require('../services/taskService');

class TaskController {
  /**
   * GET /tasks
   * Get all tasks with optional filtering
   */
  async getTasks(req, res, next) {
    try {
      const filters = {
        status: req.query.status,
        priority: req.query.priority,
        project_id: req.query.project_id,
        sortBy: req.query.sortBy,
        sortOrder: req.query.sortOrder,
        limit: req.query.limit,
        offset: req.query.offset,
      };

      const tasks = await taskService.getTasks(filters);

      res.json({
        success: true,
        data: tasks,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /tasks/:id
   * Get a single task by ID
   */
  async getTaskById(req, res, next) {
    try {
      const { id } = req.params;
      const task = await taskService.getTaskById(id);

      if (!task) {
        return res.status(404).json({
          success: false,
          error: 'Task not found',
        });
      }

      res.json({
        success: true,
        data: task,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /tasks/:id
   * Update a task
   */
  async updateTask(req, res, next) {
    try {
      const { id } = req.params;

      // Check if task exists
      const exists = await taskService.taskExists(id);
      if (!exists) {
        return res.status(404).json({
          success: false,
          error: 'Task not found',
        });
      }

      const task = await taskService.updateTask(id, req.body);

      res.json({
        success: true,
        data: task,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /tasks/:id
   * Delete a task
   */
  async deleteTask(req, res, next) {
    try {
      const { id } = req.params;

      const deleted = await taskService.deleteTask(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: 'Task not found',
        });
      }

      res.json({
        success: true,
        message: 'Task deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TaskController();
