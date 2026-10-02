const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

/**
 * Development Seed Data
 * Creates realistic projects and tasks for local development and testing
 */

const seedProjects = [
  {
    name: 'Website Redesign',
    description: 'Rebuilding the marketing site with modern stack'
  },
  {
    name: 'Mobile Banking App',
    description: 'iOS and Android banking application development'
  },
  {
    name: 'Marketing Campaign',
    description: 'Q4 2026 product launch campaign planning'
  },
  {
    name: 'Developer Portfolio',
    description: 'Personal portfolio site with blog and projects showcase'
  },
  {
    name: 'Internal Dashboard',
    description: 'Analytics dashboard for operations team'
  }
];

/**
 * Generate tasks for each project
 */
function generateTasks(projectId, projectName) {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const nextWeek = new Date(now);
  nextWeek.setDate(nextWeek.getDate() + 7);
  
  const lastWeek = new Date(now);
  lastWeek.setDate(lastWeek.getDate() - 7);

  const projectTasks = {
    'Website Redesign': [
      { title: 'Design new homepage mockup', description: 'Create high-fidelity designs in Figma', status: 'done', priority: 'high', due_date: lastWeek },
      { title: 'Implement responsive navigation', description: 'Mobile-first navigation with hamburger menu', status: 'done', priority: 'high', due_date: lastWeek },
      { title: 'Build product showcase section', description: 'Grid layout with image cards and hover effects', status: 'in-progress', priority: 'high', due_date: tomorrow },
      { title: 'Set up analytics tracking', description: 'Integrate Google Analytics 4 and event tracking', status: 'in-progress', priority: 'medium', due_date: nextWeek },
      { title: 'Optimize images for web', description: 'Compress and convert images to WebP format', status: 'todo', priority: 'medium', due_date: nextWeek },
      { title: 'Write SEO meta descriptions', description: 'Meta tags and Open Graph for all pages', status: 'todo', priority: 'low', due_date: nextWeek },
      { title: 'Deploy to production', description: 'Final deployment and DNS configuration', status: 'todo', priority: 'high', due_date: nextWeek },
      { title: 'Browser compatibility testing', description: 'Test on Chrome, Firefox, Safari, Edge', status: 'todo', priority: 'medium', due_date: null }
    ],
    'Mobile Banking App': [
      { title: 'Design authentication flow', description: 'Login, signup, biometric auth screens', status: 'done', priority: 'high', due_date: lastWeek },
      { title: 'Implement account overview', description: 'Display balance, recent transactions, cards', status: 'done', priority: 'high', due_date: yesterday },
      { title: 'Build transfer functionality', description: 'Internal and external money transfers', status: 'in-progress', priority: 'high', due_date: tomorrow },
      { title: 'Add bill payment feature', description: 'Utility bills and credit card payments', status: 'in-progress', priority: 'high', due_date: nextWeek },
      { title: 'Integrate push notifications', description: 'Transaction alerts and security notifications', status: 'in-progress', priority: 'medium', due_date: nextWeek },
      { title: 'Implement transaction history', description: 'Searchable and filterable transaction list', status: 'todo', priority: 'medium', due_date: nextWeek },
      { title: 'Security audit', description: 'Third-party security review and penetration testing', status: 'todo', priority: 'high', due_date: nextWeek },
      { title: 'App Store submission', description: 'Prepare and submit to iOS App Store', status: 'todo', priority: 'high', due_date: null }
    ],
    'Marketing Campaign': [
      { title: 'Define target audience', description: 'Research and segment customer personas', status: 'done', priority: 'high', due_date: lastWeek },
      { title: 'Create campaign timeline', description: 'Milestone planning and resource allocation', status: 'done', priority: 'high', due_date: lastWeek },
      { title: 'Design email templates', description: 'Responsive email designs for campaign', status: 'in-progress', priority: 'medium', due_date: tomorrow },
      { title: 'Write ad copy variations', description: 'A/B test copies for social media ads', status: 'in-progress', priority: 'medium', due_date: tomorrow },
      { title: 'Set up landing pages', description: 'Campaign-specific landing pages with forms', status: 'todo', priority: 'high', due_date: nextWeek },
      { title: 'Configure marketing automation', description: 'Email sequences and lead scoring', status: 'todo', priority: 'medium', due_date: nextWeek },
      { title: 'Launch social media ads', description: 'Facebook, Instagram, LinkedIn campaigns', status: 'todo', priority: 'high', due_date: nextWeek },
      { title: 'Monitor campaign metrics', description: 'Track conversions, CTR, and ROI', status: 'todo', priority: 'medium', due_date: null }
    ],
    'Developer Portfolio': [
      { title: 'Set up Next.js project', description: 'Initialize project with TypeScript and Tailwind', status: 'done', priority: 'high', due_date: lastWeek },
      { title: 'Design portfolio layout', description: 'Hero section, projects grid, about page', status: 'done', priority: 'high', due_date: yesterday },
      { title: 'Build project showcase', description: 'Interactive project cards with live demos', status: 'in-progress', priority: 'high', due_date: tomorrow },
      { title: 'Add blog functionality', description: 'MDX blog with syntax highlighting', status: 'in-progress', priority: 'medium', due_date: nextWeek },
      { title: 'Implement dark mode', description: 'Theme toggle with system preference detection', status: 'todo', priority: 'low', due_date: nextWeek },
      { title: 'Create contact form', description: 'Email contact form with spam protection', status: 'todo', priority: 'medium', due_date: nextWeek },
      { title: 'Write about me content', description: 'Bio, skills, experience, education sections', status: 'todo', priority: 'medium', due_date: null }
    ],
    'Internal Dashboard': [
      { title: 'Set up authentication', description: 'SSO integration with company identity provider', status: 'done', priority: 'high', due_date: lastWeek },
      { title: 'Design dashboard layout', description: 'Sidebar navigation and widget grid system', status: 'done', priority: 'high', due_date: lastWeek },
      { title: 'Build revenue charts', description: 'Real-time revenue visualization with Chart.js', status: 'in-progress', priority: 'high', due_date: yesterday },
      { title: 'Implement user analytics', description: 'Active users, sessions, retention metrics', status: 'in-progress', priority: 'high', due_date: tomorrow },
      { title: 'Add export functionality', description: 'CSV and PDF export for all reports', status: 'todo', priority: 'medium', due_date: nextWeek },
      { title: 'Create team performance view', description: 'Team metrics and KPI tracking', status: 'todo', priority: 'medium', due_date: nextWeek },
      { title: 'Set up data refresh', description: 'Automated data sync every 15 minutes', status: 'todo', priority: 'low', due_date: nextWeek },
      { title: 'User permissions system', description: 'Role-based access control for dashboard views', status: 'todo', priority: 'high', due_date: null }
    ]
  };

  const tasks = projectTasks[projectName] || [];
  return tasks.map(task => ({
    project_id: projectId,
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    due_date: task.due_date ? task.due_date.toISOString().split('T')[0] : null
  }));
}

/**
 * Check if database already has seed data
 */
async function checkExistingData(client) {
  const result = await client.query('SELECT COUNT(*) as count FROM projects');
  return parseInt(result.rows[0].count, 10);
}

/**
 * Clear existing seed data (optional - for re-seeding)
 */
async function clearData(client) {
  console.log('Clearing existing data...');
  await client.query('DELETE FROM tasks');
  await client.query('DELETE FROM projects');
  console.log('Existing data cleared.');
}

/**
 * Seed the database
 */
async function seed() {
  const client = await pool.connect();
  
  try {
    console.log('==================================================');
    console.log('Database Seed Script');
    console.log('==================================================\n');

    // Check if data already exists
    const existingCount = await checkExistingData(client);
    
    if (existingCount > 0) {
      console.log(`⚠️  Database already contains ${existingCount} project(s).`);
      console.log('Clearing existing data to avoid duplicates...\n');
      await clearData(client);
    }

    // Begin transaction
    await client.query('BEGIN');

    // Insert projects and collect their IDs
    console.log('Seeding projects...');
    const projectIds = [];
    const projectNames = [];

    for (const project of seedProjects) {
      const projectId = uuidv4();
      const createdAt = new Date().toISOString();
      
      const result = await client.query(
        'INSERT INTO projects (id, name, description, created_at) VALUES ($1, $2, $3, $4) RETURNING id, name',
        [projectId, project.name, project.description, createdAt]
      );
      projectIds.push(result.rows[0].id);
      projectNames.push(result.rows[0].name);
      console.log(`  ✓ ${result.rows[0].name} (${result.rows[0].id})`);
    }

    console.log(`\n✅ Inserted ${projectIds.length} projects\n`);

    // Insert tasks for each project
    console.log('Seeding tasks...');
    let totalTasks = 0;

    for (let i = 0; i < projectIds.length; i++) {
      const projectId = projectIds[i];
      const projectName = projectNames[i];
      const tasks = generateTasks(projectId, projectName);

      for (const task of tasks) {
        const taskId = uuidv4();
        const createdAt = new Date().toISOString();
        
        await client.query(
          'INSERT INTO tasks (id, project_id, title, description, status, priority, due_date, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
          [taskId, task.project_id, task.title, task.description, task.status, task.priority, task.due_date, createdAt]
        );
        totalTasks++;
      }

      console.log(`  ✓ ${projectName}: ${tasks.length} tasks`);
    }

    console.log(`\n✅ Inserted ${totalTasks} tasks\n`);

    // Commit transaction
    await client.query('COMMIT');

    console.log('==================================================');
    console.log('Seed completed successfully!');
    console.log('==================================================\n');
    console.log('Summary:');
    console.log(`  Projects: ${projectIds.length}`);
    console.log(`  Tasks: ${totalTasks}`);
    console.log('\nSample Project IDs:');
    projectIds.forEach((id, index) => {
      console.log(`  - ${projectNames[index]}: ${id}`);
    });
    console.log('\nTest the API:');
    console.log('  GET http://localhost:5000/projects');
    console.log(`  GET http://localhost:5000/projects/${projectIds[0]}/tasks`);
    console.log('');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('\n❌ Error seeding database:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run seed
seed()
  .then(() => {
    console.log('Seed script completed.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seed script failed:', error);
    process.exit(1);
  });
