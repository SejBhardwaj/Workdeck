const { body, param, query, validationResult } = require('express-validator');

/**
 * Middleware to check validation results
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array(),
    });
  }
  next();
};

/**
 * Project validation rules
 */
const projectValidation = {
  create: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Project name is required')
      .isLength({ min: 1, max: 255 })
      .withMessage('Project name must be between 1 and 255 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Description must not exceed 1000 characters'),
    validate,
  ],
  update: [
    body('name')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Project name cannot be empty')
      .isLength({ min: 1, max: 255 })
      .withMessage('Project name must be between 1 and 255 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Description must not exceed 1000 characters'),
    validate,
  ],
  id: [
    param('id')
      .notEmpty()
      .withMessage('Project ID is required')
      .isString()
      .withMessage('Project ID must be a string'),
    validate,
  ],
  projectId: [
    param('project_id')
      .notEmpty()
      .withMessage('Project ID is required')
      .isString()
      .withMessage('Project ID must be a string'),
    validate,
  ],
};

/**
 * Task validation rules
 */
const taskValidation = {
  create: [
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Task title is required')
      .isLength({ min: 1, max: 255 })
      .withMessage('Task title must be between 1 and 255 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Description must not exceed 1000 characters'),
    body('status')
      .optional()
      .isIn(['todo', 'in-progress', 'done'])
      .withMessage('Status must be one of: todo, in-progress, done'),
    body('priority')
      .optional()
      .isIn(['low', 'medium', 'high'])
      .withMessage('Priority must be one of: low, medium, high'),
    body('due_date')
      .optional()
      .custom((value) => {
        if (value === null || value === '') return true;
        const date = new Date(value);
        if (isNaN(date.getTime())) {
          throw new Error('Invalid date format. Use ISO 8601 format');
        }
        return true;
      }),
    validate,
  ],
  update: [
    body('title')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Task title cannot be empty')
      .isLength({ min: 1, max: 255 })
      .withMessage('Task title must be between 1 and 255 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Description must not exceed 1000 characters'),
    body('status')
      .optional()
      .isIn(['todo', 'in-progress', 'done'])
      .withMessage('Status must be one of: todo, in-progress, done'),
    body('priority')
      .optional()
      .isIn(['low', 'medium', 'high'])
      .withMessage('Priority must be one of: low, medium, high'),
    body('due_date')
      .optional()
      .custom((value) => {
        if (value === null || value === '') return true;
        const date = new Date(value);
        if (isNaN(date.getTime())) {
          throw new Error('Invalid date format. Use ISO 8601 format');
        }
        return true;
      }),
    validate,
  ],
  id: [
    param('id')
      .notEmpty()
      .withMessage('Task ID is required')
      .isString()
      .withMessage('Task ID must be a string'),
    validate,
  ],
};

/**
 * Query parameter validation
 */
const queryValidation = {
  taskFilters: [
    query('status')
      .optional()
      .isIn(['todo', 'in-progress', 'done'])
      .withMessage('Status must be one of: todo, in-progress, done'),
    query('priority')
      .optional()
      .isIn(['low', 'medium', 'high'])
      .withMessage('Priority must be one of: low, medium, high'),
    query('sortBy')
      .optional()
      .isIn(['created_at', 'due_date', 'title', 'priority', 'status'])
      .withMessage('Invalid sortBy field'),
    query('sortOrder')
      .optional()
      .isIn(['asc', 'desc'])
      .withMessage('sortOrder must be asc or desc'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    query('offset')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Offset must be a positive integer'),
    validate,
  ],
};

module.exports = {
  projectValidation,
  taskValidation,
  queryValidation,
  validate,
};
