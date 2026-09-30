const { Pool } = require('pg');
require('dotenv').config();

/**
 * Convert SQLite-style ? placeholders to PostgreSQL $1, $2, $3...
 *
 * This allows the existing service/repository code to continue using:
 *
 *   SELECT * FROM projects WHERE id = ?
 *
 * instead of immediately rewriting every query to:
 *
 *   SELECT * FROM projects WHERE id = $1
 */
function convertPlaceholders(sql) {
  let index = 0;

  return sql.replace(/\?/g, () => {
    index += 1;
    return `$${index}`;
  });
}

class Database {
  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,

      // Supabase PostgreSQL connections use SSL.
      ssl: {
        rejectUnauthorized: false,
      },

      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });

    this.pool.on('error', (err) => {
      console.error('Unexpected PostgreSQL pool error:', err);
    });
  }

  /**
   * Initialize PostgreSQL connection and create tables.
   */
  async initialize() {
    let client;

    try {
      client = await this.pool.connect();

      console.log('Connected to Supabase PostgreSQL database');

      await this.createTables();

      console.log('Database initialized successfully');
    } catch (error) {
      console.error(
        'Error initializing PostgreSQL database:',
        error.message
      );

      throw error;
    } finally {
      if (client) {
        client.release();
      }
    }
  }

  /**
   * Create database tables and indexes.
   */
  async createTables() {
    // Projects table
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id UUID PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description VARCHAR(1000),
        created_at TIMESTAMPTZ NOT NULL
      )
    `);

    // Tasks table
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id UUID PRIMARY KEY,
        project_id UUID NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(20) NOT NULL
          CHECK (status IN ('todo', 'in-progress', 'done')),
        priority VARCHAR(20) NOT NULL
          CHECK (priority IN ('low', 'medium', 'high')),
        due_date TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL,

        CONSTRAINT fk_tasks_project
          FOREIGN KEY (project_id)
          REFERENCES projects(id)
          ON DELETE CASCADE
      )
    `);

    // Indexes for task filtering and sorting
    await this.pool.query(`
      CREATE INDEX IF NOT EXISTS idx_tasks_project_id
      ON tasks(project_id)
    `);

    await this.pool.query(`
      CREATE INDEX IF NOT EXISTS idx_tasks_status
      ON tasks(status)
    `);

    await this.pool.query(`
      CREATE INDEX IF NOT EXISTS idx_tasks_priority
      ON tasks(priority)
    `);

    await this.pool.query(`
      CREATE INDEX IF NOT EXISTS idx_tasks_due_date
      ON tasks(due_date)
    `);

    await this.pool.query(`
      CREATE INDEX IF NOT EXISTS idx_tasks_created_at
      ON tasks(created_at)
    `);

    console.log('PostgreSQL tables and indexes ready');
  }

  /**
   * Run INSERT, UPDATE or DELETE queries.
   *
   * Keeps the old database.run(sql, params) interface
   * so existing backend code can continue working.
   */
  async run(sql, params = []) {
    const postgresSql = convertPlaceholders(sql);

    const result = await this.pool.query(postgresSql, params);

    return {
      lastID: null,
      changes: result.rowCount,
    };
  }

  /**
   * Get a single row.
   */
  async get(sql, params = []) {
    const postgresSql = convertPlaceholders(sql);

    const result = await this.pool.query(postgresSql, params);

    return result.rows[0];
  }

  /**
   * Get all matching rows.
   */
  async all(sql, params = []) {
    const postgresSql = convertPlaceholders(sql);

    const result = await this.pool.query(postgresSql, params);

    return result.rows;
  }

  /**
   * Close PostgreSQL connection pool.
   */
  async close() {
    try {
      await this.pool.end();
      console.log('PostgreSQL connection pool closed');
    } catch (error) {
      console.error(
        'Error closing PostgreSQL connection:',
        error.message
      );

      throw error;
    }
  }
}

// Singleton database instance
const database = new Database();

module.exports = database;