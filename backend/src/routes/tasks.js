const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { taskValidation, queryValidation } = require('../middleware/validation');

/**
 * GET /tasks
 * Get all tasks with optional filtering
 */
router.get('/', queryValidation.taskFilters, taskController.getTasks);

/**
 * GET /tasks/:id
 * Get a single task by ID
 */
router.get('/:id', taskValidation.id, taskController.getTaskById);

/**
 * PUT /tasks/:id
 * Update a task
 */
router.put(
  '/:id',
  [...taskValidation.id, ...taskValidation.update],
  taskController.updateTask
);

/**
 * DELETE /tasks/:id
 * Delete a task
 */
router.delete('/:id', taskValidation.id, taskController.deleteTask);

module.exports = router;
