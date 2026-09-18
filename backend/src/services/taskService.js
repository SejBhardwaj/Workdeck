const database = require('../db/database');
const { v4: uuidv4 } = require('uuid');

class TaskService {
  /**
   * Get all tasks with optional filtering and sorting
   */
  async getTasks(filters = {}) {
    let sql = 'SELECT * FROM tasks WHERE 1=1';
    const params = [];

    // Filter by status
    if (filters.status) {
      sql += ' AND status = ?';
      params.push(filters.status);
    }

    // Filter by priority
    if (filters.priority) {
      sql += ' AND priority = ?';
      params.push(filters.priority);
    }

    // Filter by project_id
    if (filters.project_id) {
      sql += ' AND project_id = ?';
      params.push(filters.project_id);
    }

    // Sorting
    const sortBy = filters.sortBy || 'created_at';
    const sortOrder = filters.sortOrder === 'asc' ? 'ASC' : 'DESC';
    
    // Validate sortBy to prevent SQL injection
    const allowedSortFields = ['created_at', 'due_date', 'title', 'priority', 'status'];
    if (allowedSortFields.includes(sortBy)) {
      sql += ` ORDER BY ${sortBy} ${sortOrder}`;
    } else {
      sql += ' ORDER BY created_at DESC';
    }

    // Pagination
    if (filters.limit) {
      sql += ' LIMIT ?';
      params.push(parseInt(filters.limit));

      if (filters.offset) {
        sql += ' OFFSET ?';
        params.push(parseInt(filters.offset));
      }
    }

    return await database.all(sql, params);
  }

  /**
   * Get tasks for a specific project
   */
  async getTasksByProject(projectId, filters = {}) {
    return await this.getTasks({ ...filters, project_id: projectId });
  }

  /**
   * Get a single task by ID
   */
  async getTaskById(id) {
    const sql = 'SELECT * FROM tasks WHERE id = ?';
    return await database.get(sql, [id]);
  }

  /**
   * Create a new task
   */
  async createTask(projectId, data) {
    const id = uuidv4();
    const created_at = new Date().toISOString();

    const sql = `
      INSERT INTO tasks (id, project_id, title, description, status, priority, due_date, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await database.run(sql, [
      id,
      projectId,
      data.title,
      data.description || '',
      data.status || 'todo',
      data.priority || 'medium',
      data.due_date || null,
      created_at,
    ]);

    return await this.getTaskById(id);
  }

  /**
   * Update an existing task
   */
  async updateTask(id, data) {
    const updates = [];
    const params = [];

    if (data.title !== undefined) {
      updates.push('title = ?');
      params.push(data.title);
    }

    if (data.description !== undefined) {
      updates.push('description = ?');
      params.push(data.description);
    }

    if (data.status !== undefined) {
      updates.push('status = ?');
      params.push(data.status);
    }

    if (data.priority !== undefined) {
      updates.push('priority = ?');
      params.push(data.priority);
    }

    if (data.due_date !== undefined) {
      updates.push('due_date = ?');
      params.push(data.due_date);
    }

    if (updates.length === 0) {
      return await this.getTaskById(id);
    }

    params.push(id);
    const sql = `UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`;

    await database.run(sql, params);
    return await this.getTaskById(id);
  }

  /**
   * Delete a task
   */
  async deleteTask(id) {
    const sql = 'DELETE FROM tasks WHERE id = ?';
    const result = await database.run(sql, [id]);
    return result.changes > 0;
  }

  /**
   * Check if task exists
   */
  async taskExists(id) {
    const task = await this.getTaskById(id);
    return !!task;
  }

  /**
   * Count tasks for a project
   */
  async countTasksByProject(projectId) {
    const sql = 'SELECT COUNT(*) as count FROM tasks WHERE project_id = ?';
    const result = await database.get(sql, [projectId]);
    return result.count;
  }
}

module.exports = new TaskService();
