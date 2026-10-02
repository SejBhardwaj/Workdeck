# WorkDeck

**Focused work, visible progress**

WorkDeck is a modern, full-stack task and project management application designed to help individuals and teams organize their work, track progress, and stay productive. Built with a beautiful dark theme and lime-green accents, WorkDeck offers an intuitive interface for managing projects and tasks efficiently.

🔗 **Live Demo:** [https://workdeck-pearl.vercel.app](https://workdeck-pearl.vercel.app)

---

## ✨ Features

### Project Management
- Create, edit, and delete projects
- Track project progress with completion percentages
- View projects in grid or list layout
- Filter and search projects
- Project-specific task views

### Task Management
- Create tasks with titles, descriptions, and metadata
- Set task priorities (Low, Medium, High)
- Track task status (To Do, In Progress, Done)
- Assign due dates
- Link tasks to projects
- Global task view across all projects

### Filtering & Sorting
- Filter tasks by status, priority, and project
- Sort tasks by created date, due date, title, priority, or status
- Semantic priority ordering (Low → Medium → High)
- Clear filters with one click
- Real-time search functionality

### Dashboard & Analytics
- Real-time project and task statistics
- Completion metrics and progress tracking
- Task distribution by status
- Priority breakdown
- Overdue task monitoring
- Visual data representation

### User Experience
- Clean, modern dark-themed interface
- Responsive design for all screen sizes
- Intuitive navigation
- Toast notifications for user actions
- Loading states for better UX
- Error handling and validation

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 13 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI
- **State Management:** React Hooks
- **HTTP Client:** Fetch API
- **Deployment:** Vercel

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL (Supabase)
- **Validation:** Express Validator
- **CORS:** CORS middleware
- **Environment:** dotenv
- **Deployment:** Render

### Database Schema
- **Projects:** id, name, description, created_at
- **Tasks:** id, project_id, title, description, status, priority, due_date, created_at

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database (or Supabase account)
- Git

### Local Development

#### 1. Clone the Repository
```bash
git clone https://github.com/SejBhardwaj/Workdeck.git
cd Workdeck
```

#### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Edit .env with your database credentials
# DATABASE_URL=postgresql://user:password@host:port/database
# PORT=5000
# NODE_ENV=development
# CORS_ORIGIN=http://localhost:3000,http://localhost:3001

# Run database seed (optional - adds sample data)
npm run seed

# Start backend server
npm run dev
```

Backend runs at: `http://localhost:5000`

#### 3. Frontend Setup
```bash
cd frontend
npm install

# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local

# Start frontend development server
npm run dev
```

Frontend runs at: `http://localhost:3000`

---

## 📁 Project Structure

```
Workdeck/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── db/              # Database connection & seed
│   │   ├── middleware/      # Error handling & validation
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   └── index.js         # Express app entry point
│   ├── .env                 # Environment variables
│   └── package.json
│
├── frontend/
│   ├── app/                 # Next.js app directory
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Home page
│   ├── components/          # React components
│   │   ├── ui/             # Radix UI components
│   │   └── datasker.tsx    # Main app component
│   ├── lib/                 # Utilities
│   │   ├── api/            # API client & endpoints
│   │   └── utils.ts        # Helper functions
│   ├── public/             # Static assets
│   ├── .env.local          # Environment variables
│   └── package.json
│
└── README.md
```

---

## 🌐 API Endpoints

### Projects
- `GET /projects` - Get all projects
- `POST /projects` - Create new project
- `GET /projects/:id` - Get project by ID
- `PUT /projects/:id` - Update project
- `DELETE /projects/:id` - Delete project

### Tasks
- `GET /tasks` - Get all tasks (supports filtering & sorting)
- `POST /tasks` - Create new task
- `GET /tasks/:id` - Get task by ID
- `PUT /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task

### Query Parameters
- `status` - Filter by task status (todo, in-progress, done)
- `priority` - Filter by priority (low, medium, high)
- `project_id` - Filter by project ID
- `sortBy` - Sort field (created_at, due_date, title, priority, status)
- `sortOrder` - Sort direction (asc, desc)

---

## 🚢 Deployment

### Backend (Render)
1. Create account at [render.com](https://render.com)
2. Create new Web Service
3. Connect GitHub repository
4. Configure:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Add environment variables:
   - `DATABASE_URL` (Supabase Session Pooler connection string)
   - `NODE_ENV=production`
   - `CORS_ORIGIN` (Your Vercel frontend URL)

### Frontend (Vercel)
1. Create account at [vercel.com](https://vercel.com)
2. Import GitHub repository
3. Configure:
   - Root Directory: `frontend`
   - Framework: Next.js
4. Add environment variable:
   - `NEXT_PUBLIC_API_URL` (Your Render backend URL)
5. Deploy

---

## 🔒 Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@host:port/database
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## 🎨 Features Showcase

- **Dark Theme:** Modern dark UI with lime-green accent colors
- **Responsive Design:** Optimized for desktop, tablet, and mobile
- **Real-time Updates:** Instant feedback on all actions
- **Smart Filtering:** Multi-criteria filtering with clear controls
- **Semantic Sorting:** Intuitive priority ordering
- **Progress Tracking:** Visual progress indicators
- **Clean Architecture:** Separation of concerns (routes → controllers → services)

---

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

---

## 👨‍💻 Author

**Sejal Bhardwaj**

- GitHub: [@SejBhardwaj](https://github.com/SejBhardwaj)

---

## 🙏 Acknowledgments

- Built with Next.js and Express.js
- UI components from Radix UI
- Hosted on Vercel and Render
- Database by Supabase

---

**WorkDeck** - Focused work, visible progress ⚡
