const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { projectValidation, queryValidation } = require('../middleware/validation');

/**
 * GET /projects
 * Get all projects
 */
router.get('/', projectController.getProjects);

/**
 * POST /projects
 * Create a new project
 */
router.post('/', projectValidation.create, projectController.createProject);

/**
 * GET /projects/:id
 * Get a single project by ID
 */
router.get('/:id', projectValidation.id, projectController.getProjectById);

/**
 * PUT /projects/:id
 * Update a project
 */
router.put(
  '/:id',
  [...projectValidation.id, ...projectValidation.update],
  projectController.updateProject
);

/**
 * DELETE /projects/:id
 * Delete a project
 */
router.delete('/:id', projectValidation.id, projectController.deleteProject);

/**
 * GET /projects/:project_id/tasks
 * Get all tasks for a specific project
 */
router.get(
  '/:project_id/tasks',
  [...projectValidation.projectId, ...queryValidation.taskFilters],
  projectController.getProjectTasks
);

/**
 * POST /projects/:project_id/tasks
 * Create a new task for a project
 */
router.post(
  '/:project_id/tasks',
  [...projectValidation.projectId, ...require('../middleware/validation').taskValidation.create],
  projectController.createProjectTask
);

module.exports = router;
