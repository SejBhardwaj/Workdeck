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
