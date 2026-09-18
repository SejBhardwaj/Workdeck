const database = require('../db/database');
const { v4: uuidv4 } = require('uuid');

class ProjectService {
  /**
   * Get all projects
   */
  async getProjects() {
    const sql = 'SELECT * FROM projects ORDER BY created_at DESC';
    return await database.all(sql);
  }

  /**
   * Get a single project by ID
   */
  async getProjectById(id) {
    const sql = 'SELECT * FROM projects WHERE id = ?';
    return await database.get(sql, [id]);
  }

  /**
   * Create a new project
   */
  async createProject(data) {
    const id = uuidv4();
    const created_at = new Date().toISOString();

    const sql = `
      INSERT INTO projects (id, name, description, created_at)
      VALUES (?, ?, ?, ?)
    `;

    await database.run(sql, [
      id,
      data.name,
      data.description || '',
      created_at,
    ]);

    return await this.getProjectById(id);
  }

  /**
   * Update an existing project
   */
  async updateProject(id, data) {
    const updates = [];
    const params = [];

    if (data.name !== undefined) {
      updates.push('name = ?');
      params.push(data.name);
    }

    if (data.description !== undefined) {
      updates.push('description = ?');
      params.push(data.description);
    }

    if (updates.length === 0) {
      return await this.getProjectById(id);
    }

    params.push(id);
    const sql = `UPDATE projects SET ${updates.join(', ')} WHERE id = ?`;

    await database.run(sql, params);
    return await this.getProjectById(id);
  }

  /**
   * Delete a project (and cascade delete its tasks)
   */
  async deleteProject(id) {
    const sql = 'DELETE FROM projects WHERE id = ?';
    const result = await database.run(sql, [id]);
    return result.changes > 0;
  }

  /**
   * Check if project exists
   */
  async projectExists(id) {
    const project = await this.getProjectById(id);
    return !!project;
  }
}

module.exports = new ProjectService();
