'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Activity, ArrowUpRight, Bell, CalendarDays, Check, ChevronDown, ChevronLeft,
  ChevronRight, Clock3, Command, FolderKanban, Grid2X2, LayoutDashboard,
  List, Menu, MoreHorizontal, Plus, Search, Settings, SlidersHorizontal, Sparkles,
  Target, TrendingUp, X, Zap,
} from 'lucide-react';

// Import new types and data
import { Project, Task, TaskStatus, TaskPriority } from '@/types';
import { mockProjects, mockTasks } from '@/lib/mock';
import {
  enrichProjectsWithStats,
  getProjectById,
  getProjectTone,
  getTasksForProject,
  getProjectProgress,
  getProjectTaskCount,
  getCompletedTaskCount,
} from '@/lib/project-utils';
import {
  enrichTasksWithProject,
  formatTaskDueDate,
  formatTaskCreatedDate,
  formatProjectCreatedDate,
  formatTaskStatus,
  formatTaskPriority,
  isTaskOverdue,
  getProjectNameForTask,
  getUpcomingTasks,
} from '@/lib/task-utils';
import { getWorkspaceStats, getStatusDistribution } from '@/lib/statistics';

const navItems = [
  { label: 'Overview', href: '/', icon: LayoutDashboard },
  { label: 'Projects', href: '/projects', icon: FolderKanban },
  { label: 'Tasks', href: '/tasks', icon: Check },
  { label: 'Analytics', href: '/analytics', icon: Activity },
];

function cn(...values: Array<string | false | undefined>) {
  return values.filter(Boolean).join(' ');
}

export function DataTaskerApp() {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [modal, setModal] = useState<'project' | 'task' | null>(null);
  const [toast, setToast] = useState('');
  
  const isDetail = pathname.startsWith('/projects/') && pathname !== '/projects';
  const page = isDetail
    ? 'Project detail'
    : pathname === '/'
    ? 'Overview'
    : pathname.slice(1).replace('-', ' ');

  // Get canonical data
  const projects = mockProjects;
  const tasks = mockTasks;

  // Enrich projects with stats for UI display
  const projectsWithStats = enrichProjectsWithStats(projects, tasks);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(''), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f2]">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-[248px] flex-col border-r border-[#292b2d] bg-[#111214] px-4 py-5 transition-transform duration-300 lg:translate-x-0',
          collapsed && 'lg:w-[84px]',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className={cn('mb-9 flex items-center gap-3 px-2', collapsed && 'lg:justify-center lg:px-0')}>
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-[13px] bg-[#b8ff3d] text-[#0a0a0a] shadow-[0_0_24px_rgba(184,255,61,.18)]">
            <span className="absolute h-5 w-5 rotate-45 rounded-[5px] border-[3px] border-[#0a0a0a]" />
            <span className="relative h-2 w-2 rounded-full bg-[#0a0a0a]" />
          </div>
          <span className={cn('text-[17px] font-semibold tracking-[-.04em]', collapsed && 'lg:hidden')}>
            DataTasker
          </span>
          <button
            className="ml-auto rounded-full p-1 text-[#898b87] hover:bg-[#1d1f20] hover:text-white lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <div className={cn('mb-3 px-3 text-[10px] font-medium uppercase tracking-[.2em] text-[#6f716f]', collapsed && 'lg:hidden')}>
          Workspace
        </div>
        <nav className="space-y-1">
          {navItems.map(({ label, href, icon: Icon }) => (
            <button
              key={href}
              onClick={() => {
                router.push(href);
                setSidebarOpen(false);
              }}
              className={cn(
                'group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] capitalize text-[#898b87] transition hover:bg-[#1d1f20] hover:text-[#f5f5f2]',
                pathname === href && 'bg-[#1d1f20] text-[#f5f5f2] shadow-[inset_3px_0_0_#b8ff3d]',
                collapsed && 'lg:justify-center lg:px-0'
              )}
            >
              <Icon size={17} className={cn('shrink-0', pathname === href && 'text-[#b8ff3d]')} />
              <span className={cn(collapsed && 'lg:hidden')}>{label}</span>
              {label === 'Tasks' && (
                <span className={cn('ml-auto rounded-full bg-[#292b2d] px-2 py-0.5 text-[10px] text-[#a7a7a3]', collapsed && 'lg:hidden')}>
                  {tasks.length}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Recent Projects */}
        <div className={cn('mb-3 mt-9 px-3 text-[10px] font-medium uppercase tracking-[.2em] text-[#6f716f]', collapsed && 'lg:hidden')}>
          Recent projects
        </div>
        <div className={cn('space-y-1', collapsed && 'lg:hidden')}>
          {projectsWithStats.slice(0, 4).map((project, index) => (
            <button
              key={project.id}
              onClick={() => router.push(`/projects/${project.id}`)}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-[12px] text-[#898b87] transition hover:bg-[#1d1f20] hover:text-white"
            >
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: getProjectTone(project, index) }} />
              {project.name}
            </button>
          ))}
        </div>

        {/* Settings & Collapse */}
        <div className="mt-auto space-y-1 border-t border-[#292b2d] pt-4">
          <button
            onClick={() => router.push('/settings')}
            className={cn(
              'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] text-[#898b87] hover:bg-[#1d1f20] hover:text-white',
              pathname === '/settings' && 'bg-[#1d1f20] text-white',
              collapsed && 'lg:justify-center lg:px-0'
            )}
          >
            <Settings size={17} />
            <span className={cn(collapsed && 'lg:hidden')}>Settings</span>
          </button>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden w-full items-center justify-center rounded-xl py-2 text-[#6f716f] hover:bg-[#1d1f20] hover:text-white lg:flex"
            aria-label="Collapse sidebar"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
      </aside>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <button
          className="fixed inset-0 z-30 bg-black/70 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close menu overlay"
        />
      )}

      {/* Main Content */}
      <main className={cn('min-h-screen transition-[padding] duration-300 lg:pl-[248px]', collapsed && 'lg:pl-[84px]')}>
        {/* Header */}
        <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-[#292b2d]/70 bg-[#0a0a0a]/90 px-5 backdrop-blur-xl sm:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl border border-[#292b2d] p-2 text-[#a7a7a3] lg:hidden"
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>
            <div className="hidden items-center gap-2 text-[12px] text-[#6f716f] sm:flex">
              <span>Workspace</span>
              <ChevronRight size={13} />
              <span className="capitalize text-[#a7a7a3]">{page}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex h-10 items-center gap-2 rounded-full border border-[#292b2d] bg-[#111214] px-3 text-[#898b87] transition hover:border-[#494c4d] hover:text-white sm:w-[214px]"
            >
              <Search size={16} />
              <span className="hidden flex-1 text-left text-[12px] sm:block">Search anything...</span>
              <kbd className="hidden rounded-md border border-[#292b2d] px-1.5 py-0.5 text-[10px] text-[#6f716f] sm:block">
                ⌘ K
              </kbd>
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotifications(!notifications)}
                className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#292b2d] bg-[#111214] text-[#a7a7a3] hover:border-[#494c4d] hover:text-white"
                aria-label="Notifications"
              >
                <Bell size={17} />
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#b8ff3d]" />
              </button>
              {notifications && (
                <div className="absolute right-0 top-12 w-[300px] rounded-2xl border border-[#292b2d] bg-[#171819] p-3 shadow-2xl">
                  <div className="mb-3 flex items-center justify-between px-2">
                    <span className="text-sm font-medium">Notifications</span>
                    <span className="text-[10px] uppercase tracking-widest text-[#b8ff3d]">3 new</span>
                  </div>
                  {[
                    'Fix authentication is due tomorrow.',
                    'Website Redesign reached 78%.',
                    'Update landing page was completed.',
                  ].map((text, i) => (
                    <div key={text} className="flex gap-3 rounded-xl p-2.5 hover:bg-[#1d1f20]">
                      <span className={cn('mt-1 h-2 w-2 shrink-0 rounded-full', i === 1 ? 'bg-[#ffc46b]' : 'bg-[#b8ff3d]')} />
                      <div>
                        <p className="text-xs text-[#f5f5f2]">
                          {i === 0 ? 'Task deadline approaching' : i === 1 ? 'Project progress' : 'Task completed'}
                        </p>
                        <p className="mt-1 text-[11px] leading-4 text-[#898b87]">{text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* User Avatar */}
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d9e7ba] text-sm font-semibold text-[#16200b]">
              SJ
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="mx-auto max-w-[1500px] px-5 py-8 sm:px-8 lg:px-10">
          {isDetail ? (
            <ProjectDetail projects={projects} tasks={tasks} onToast={setToast} onAddTask={() => setModal('task')} />
          ) : pathname === '/' ? (
            <Dashboard projects={projects} tasks={tasks} onCreate={() => setModal('project')} />
          ) : pathname === '/projects' ? (
            <Projects projects={projects} tasks={tasks} onCreate={() => setModal('project')} onToast={setToast} />
          ) : pathname === '/tasks' ? (
            <TasksPage projects={projects} tasks={tasks} onCreate={() => setModal('task')} onToast={setToast} />
          ) : pathname === '/analytics' ? (
            <Analytics projects={projects} tasks={tasks} />
          ) : (
            <SettingsPage />
          )}
        </div>
      </main>

      {/* Command Palette */}
      {searchOpen && (
        <CommandPalette
          projects={projects}
          onClose={() => setSearchOpen(false)}
          onNavigate={(href) => {
            setSearchOpen(false);
            router.push(href);
          }}
        />
      )}

      {/* Form Modal */}
      {modal && (
        <FormModal
          kind={modal}
          onClose={() => setModal(null)}
          onSave={() => {
            setModal(null);
            setToast(`${modal === 'project' ? 'Project' : 'Task'} created successfully.`);
          }}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border border-[#3e5b1c] bg-[#171e11] px-4 py-3 text-xs text-[#e9f9ce] shadow-2xl">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#b8ff3d] text-[#0a0a0a]">
            <Check size={13} strokeWidth={3} />
          </span>
          {toast}
        </div>
      )}
    </div>
  );
}

// ============================================
// REUSABLE COMPONENTS
// ============================================

function PageHeading({
  eyebrow,
  title,
  copy,
  action,
}: {
  eyebrow?: string;
  title: string;
  copy: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div>
        <div className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.2em] text-[#b8ff3d]">
          {eyebrow || 'Your workspace'}
          <span className="h-1 w-1 rounded-full bg-[#b8ff3d]" />
        </div>
        <h1 className="text-3xl font-semibold tracking-[-.055em] text-[#f5f5f2] sm:text-[40px]">{title}</h1>
        <p className="mt-2 text-sm text-[#898b87]">{copy}</p>
      </div>
      {action}
    </div>
  );
}

function PillButton({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex h-9 items-center gap-2 whitespace-nowrap rounded-full border px-3 text-xs transition',
        active
          ? 'border-[#b8ff3d]/40 bg-[#b8ff3d] text-[#0a0a0a]'
          : 'border-[#292b2d] bg-[#111214] text-[#a7a7a3] hover:border-[#555957] hover:text-white'
      )}
    >
      {children}
    </button>
  );
}

function Surface({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <section
      className={cn(
        'rounded-[32px] border-0 bg-[#1f1f1f] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.4)] transition-all duration-300 hover:shadow-[0_0_35px_rgba(184,255,61,0.15),0_4px_20px_rgba(0,0,0,0.4)] sm:p-7',
        className
      )}
    >
      {children}
    </section>
  );
}

function Stat({
  label,
  value,
  change,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  change: string;
  icon: React.ElementType;
  accent?: boolean;
}) {
  return (
    <Surface className="relative overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(184,255,61,0.25)]">
      <div className="mb-8 flex items-center justify-between">
        <span className="text-[10px] font-medium uppercase tracking-[.16em] text-[#898b87]">{label}</span>
        <span className={cn('flex h-8 w-8 items-center justify-center rounded-full border-0 bg-[#2a2a2a]', accent && 'bg-[#b8ff3d]/10 text-[#b8ff3d]')}>
          <Icon size={15} />
        </span>
      </div>
      <div className="text-3xl font-semibold tracking-[-.06em]">{value}</div>
      <div className="mt-3 flex items-center gap-1.5 text-[11px] text-[#898b87]">
        <TrendingUp size={13} className="text-[#b8ff3d]" />
        {change}
      </div>
      {accent && <div className="pointer-events-none absolute -bottom-16 -right-8 h-32 w-32 rounded-full bg-[#b8ff3d]/[.05] blur-2xl" />}
    </Surface>
  );
}

function StatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span
      className={cn(
        'hidden rounded-full px-2.5 py-1 text-[9px] uppercase tracking-wider sm:inline-flex',
        status === 'done'
          ? 'bg-[#b8ff3d] text-[#0a0a0a]'
          : status === 'in-progress'
          ? 'bg-[#353938] text-[#d2d8ce]'
          : 'bg-[#292b2d] text-[#898b87]'
      )}
    >
      {formatTaskStatus(status)}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return (
    <span
      className={cn(
        'rounded-full px-2.5 py-1 text-[9px] uppercase tracking-wider',
        priority === 'high'
          ? 'bg-[#3c251f] text-[#ff9b7d]'
          : priority === 'medium'
          ? 'bg-[#3a321e] text-[#ffc46b]'
          : 'bg-[#292b2d] text-[#a7a7a3]'
      )}
    >
      {formatTaskPriority(priority)}
    </span>
  );
}

// ============================================
// DASHBOARD PAGE
// ============================================

function Dashboard({ projects, tasks, onCreate }: { projects: Project[]; tasks: Task[]; onCreate: () => void }) {
  const stats = getWorkspaceStats(projects, tasks);
  const projectsWithStats = enrichProjectsWithStats(projects, tasks);
  const upcomingTasks = getUpcomingTasks(tasks).slice(0, 4);

  return (
    <>
      <PageHeading
        eyebrow="Monday, April 14"
        title="Good morning, Sejal"
        copy="Here's what's happening across your workspace."
        action={
          <button
            onClick={onCreate}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#b8ff3d] px-5 text-sm font-semibold text-[#0a0a0a] shadow-[0_0_25px_rgba(184,255,61,.12)] transition hover:scale-[1.02] hover:bg-[#c9ff69]"
          >
            <Plus size={17} />
            Create
          </button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          label="Total projects"
          value={String(stats.totalProjects).padStart(2, '0')}
          change="+2 this month"
          icon={FolderKanban}
          accent
        />
        <Stat label="Total tasks" value={String(stats.totalTasks)} change="+12% from last month" icon={Target} />
        <Stat label="In progress" value={String(stats.inProgressTasks)} change="6 due this week" icon={Zap} />
        <Stat label="Completed" value={String(stats.completedTasks)} change="+18% from last month" icon={Check} accent />
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-[1.55fr_1fr]">
        <Productivity />
        <StatusDistribution tasks={tasks} />
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-[1.1fr_.9fr]">
        <RecentProjects projects={projectsWithStats} />
        <Upcoming tasks={upcomingTasks} projects={projects} />
      </div>
    </>
  );
}

function Productivity() {
  const points = '0,172 55,146 110,158 165,116 220,130 275,92 330,108 385,68 440,82 495,42 550,56 605,22';
  return (
    <Surface className="min-h-[345px]">
      <div className="mb-7 flex items-start justify-between">
        <div>
          <p className="text-base font-medium">Productivity overview</p>
          <p className="mt-1 text-xs text-[#898b87]">Task activity over the last 30 days</p>
        </div>
        <PillButton>
          Last 30 days <ChevronDown size={14} />
        </PillButton>
      </div>
      <div className="relative h-[220px] overflow-hidden">
        <div className="absolute inset-0 flex flex-col justify-between text-[10px] text-[#6f716f]">
          <div className="border-t border-[#292b2d] pt-1">80</div>
          <div className="border-t border-[#292b2d] pt-1">60</div>
          <div className="border-t border-[#292b2d] pt-1">40</div>
          <div className="border-t border-[#292b2d] pt-1">20</div>
          <div className="border-t border-[#292b2d] pt-1">0</div>
        </div>
        <svg viewBox="0 0 605 190" preserveAspectRatio="none" className="absolute inset-x-7 bottom-5 h-[190px] w-[calc(100%-56px)] overflow-visible">
          <defs>
            <linearGradient id="area" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#b8ff3d" stopOpacity=".24" />
              <stop offset="1" stopColor="#b8ff3d" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={`${points} L605,190 L0,190 Z`} fill="url(#area)" />
          <polyline points={points} fill="none" stroke="#b8ff3d" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="ml-7 mt-1 flex justify-between text-[10px] text-[#6f716f]">
        <span>Mar 16</span>
        <span>Mar 23</span>
        <span>Mar 30</span>
        <span>Apr 06</span>
        <span>Apr 14</span>
      </div>
      <div className="mt-5 flex gap-5 text-[11px] text-[#898b87]">
        <span className="flex items-center gap-2">
          <i className="h-2 w-2 rounded-full bg-[#b8ff3d]" />
          Completed
        </span>
        <span className="flex items-center gap-2">
          <i className="h-2 w-2 rounded-full bg-[#606361]" />
          Created
        </span>
      </div>
    </Surface>
  );
}

function StatusDistribution({ tasks }: { tasks: Task[] }) {
  const distribution = getStatusDistribution(tasks);
  const total = tasks.length;
  const donePercentage = total > 0 ? Math.round((distribution.done / total) * 100) : 0;
  const todoPercentage = total > 0 ? Math.round((distribution.todo / total) * 100) : 0;
  const inProgressPercentage = total > 0 ? Math.round((distribution.inProgress / total) * 100) : 0;

  return (
    <Surface className="min-h-[345px]">
      <div className="mb-7">
        <p className="text-base font-medium">Task status</p>
        <p className="mt-1 text-xs text-[#898b87]">A clear view of what needs attention</p>
      </div>
      <div className="flex items-center gap-7">
        <div
          className="relative flex h-36 w-36 shrink-0 items-center justify-center rounded-full"
          style={{
            background: `conic-gradient(#b8ff3d 0 ${donePercentage}%, #798079 ${donePercentage}% ${donePercentage + inProgressPercentage}%, #353938 ${donePercentage + inProgressPercentage}% 100%)`,
          }}
        >
          <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-[#1f1f1f]">
            <span className="text-2xl font-semibold">{donePercentage}%</span>
            <span className="text-[10px] uppercase tracking-widest text-[#898b87]">done</span>
          </div>
        </div>
        <div className="w-full space-y-4">
          {[
            ['Todo', distribution.todo, '#353938', todoPercentage],
            ['In Progress', distribution.inProgress, '#798079', inProgressPercentage],
            ['Done', distribution.done, '#b8ff3d', donePercentage],
          ].map(([label, value, color, percentage]) => (
            <div key={String(label)}>
              <div className="mb-1.5 flex justify-between text-xs">
                <span className="text-[#a7a7a3]">{label}</span>
                <span>{value}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-[#3a3a3a]">
                <div className="h-full rounded-full" style={{ width: `${percentage}%`, backgroundColor: String(color) }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-8 flex items-center justify-between rounded-[24px] bg-[#2a2a2a] p-4 text-xs">
        <span className="text-[#898b87]">Completion rate</span>
        <span className="font-medium text-[#b8ff3d]">+12.4%</span>
      </div>
    </Surface>
  );
}

function RecentProjects({ projects }: { projects: ReturnType<typeof enrichProjectsWithStats> }) {
  const router = useRouter();
  return (
    <Surface>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-base font-medium">Recent projects</p>
          <p className="mt-1 text-xs text-[#898b87]">Your latest workspaces</p>
        </div>
        <button className="text-xs text-[#b8ff3d] hover:underline">View all</button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {projects.slice(0, 4).map((p, index) => (
          <div
            key={p.id}
            className="rounded-[28px] border-0 bg-[#2a2a2a] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(184,255,61,0.3),0_4px_20px_rgba(0,0,0,0.5)]"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ background: getProjectTone(p, index) }} />
                <p className="text-sm font-medium">{p.name}</p>
              </div>
              <ArrowUpRight size={15} className="text-[#6f716f]" />
            </div>
            <p className="mt-2 line-clamp-1 text-[11px] text-[#898b87]">{p.description}</p>
            <div className="mt-5 flex items-center justify-between text-[11px] text-[#898b87]">
              <span>{p.taskCount} tasks</span>
              <span className="text-[#f5f5f2]">{p.progress}%</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#3a3a3a]">
              <div className="h-full rounded-full bg-[#b8ff3d]" style={{ width: `${p.progress}%` }} />
            </div>
            <div className="mt-4 flex justify-between text-[10px] text-[#6f716f]">
              <span>{p.completedCount} completed</span>
              <span>{formatProjectCreatedDate(p.created_at)}</span>
            </div>
          </div>
        ))}
      </div>
    </Surface>
  );
}

function Upcoming({ tasks, projects }: { tasks: Task[]; projects: Project[] }) {
  return (
    <Surface>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-base font-medium">Upcoming deadlines</p>
          <p className="mt-1 text-xs text-[#898b87]">Stay one step ahead</p>
        </div>
        <CalendarDays size={18} className="text-[#b8ff3d]" />
      </div>
      <div className="space-y-2">
        {tasks.map((task) => {
          const projectName = getProjectNameForTask(task, projects);
          const displayDue = formatTaskDueDate(task);
          const overdue = isTaskOverdue(task);

          return (
            <div
              key={task.id}
              className="group flex items-center gap-3 rounded-[24px] bg-[#2a2a2a] p-4 transition-all duration-300 hover:bg-[#323232] hover:shadow-[0_0_20px_rgba(184,255,61,0.2)]"
            >
              <div
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#3a3a3a] text-[#898b87]',
                  task.status === 'done' && 'border-[#b8ff3d]/30 text-[#b8ff3d]'
                )}
              >
                <Check size={14} />
              </div>
              <div className="min-w-0 flex-1">
                <p className={cn('truncate text-xs', task.status === 'done' && 'text-[#6f716f] line-through')}>{task.title}</p>
                <p className="mt-1 text-[10px] text-[#6f716f]">
                  {projectName} · {displayDue}
                </p>
              </div>
              <span
                className={cn(
                  'rounded-full px-2 py-1 text-[9px] uppercase tracking-wider',
                  task.priority === 'high'
                    ? 'bg-[#3c251f] text-[#ff9b7d]'
                    : task.priority === 'medium'
                    ? 'bg-[#3a321e] text-[#ffc46b]'
                    : 'bg-[#3a3a3a] text-[#a7a7a3]'
                )}
              >
                {formatTaskPriority(task.priority)}
              </span>
            </div>
          );
        })}
      </div>
      <button className="mt-4 w-full rounded-full border-0 bg-[#2a2a2a] py-2.5 text-xs text-[#a7a7a3] transition-all duration-300 hover:bg-[#323232] hover:text-[#b8ff3d] hover:shadow-[0_0_20px_rgba(184,255,61,0.2)]">
        View all tasks
      </button>
    </Surface>
  );
}

// ============================================
// PROJECTS PAGE
// ============================================

function Projects({
  projects,
  tasks,
  onCreate,
  onToast,
}: {
  projects: Project[];
  tasks: Task[];
  onCreate: () => void;
  onToast: (text: string) => void;
}) {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  
  const projectsWithStats = enrichProjectsWithStats(projects, tasks);
  const shown = projectsWithStats.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <PageHeading
        title="Projects"
        copy="Manage every project from one focused workspace."
        action={
          <button
            onClick={onCreate}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#b8ff3d] px-5 text-sm font-semibold text-[#0a0a0a]"
          >
            <Plus size={17} />
            New Project
          </button>
        }
      />
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <div className="flex h-10 min-w-[220px] flex-1 items-center gap-2 rounded-full border border-[#292b2d] bg-[#111214] px-3 text-[#898b87] sm:max-w-[320px]">
          <Search size={15} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="w-full bg-transparent text-xs text-white outline-none placeholder:text-[#6f716f]"
          />
        </div>
        <PillButton>
          <SlidersHorizontal size={14} />
          Sort by <ChevronDown size={14} />
        </PillButton>
        <div className="ml-auto flex rounded-full border border-[#292b2d] bg-[#111214] p-1">
          <button onClick={() => setView('grid')} className={cn('rounded-full p-2', view === 'grid' && 'bg-[#b8ff3d] text-[#0a0a0a]')}>
            <Grid2X2 size={14} />
          </button>
          <button onClick={() => setView('list')} className={cn('rounded-full p-2', view === 'list' && 'bg-[#b8ff3d] text-[#0a0a0a]')}>
            <List size={14} />
          </button>
        </div>
      </div>
      {view === 'grid' ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {shown.map((p, index) => (
            <ProjectCard key={p.id} project={p} index={index} onToast={onToast} />
          ))}
        </div>
      ) : (
        <Surface className="overflow-hidden p-0">
          <div className="hidden grid-cols-[1.5fr_.6fr_.7fr_.6fr_40px] gap-4 border-b border-[#292b2d] px-5 py-4 text-[10px] uppercase tracking-widest text-[#6f716f] md:grid">
            <span>Project</span>
            <span>Tasks</span>
            <span>Progress</span>
            <span>Created</span>
            <span />
          </div>
          {shown.map((p) => (
            <div
              key={p.id}
              className="grid gap-3 border-b border-[#292b2d] px-5 py-4 last:border-0 md:grid-cols-[1.5fr_.6fr_.7fr_.6fr_40px] md:items-center md:gap-4"
            >
              <div>
                <p className="text-sm font-medium">{p.name}</p>
                <p className="mt-1 text-[11px] text-[#6f716f]">{p.description}</p>
              </div>
              <span className="text-xs text-[#a7a7a3]">{p.taskCount} tasks</span>
              <div>
                <span className="text-xs">{p.progress}%</span>
                <div className="mt-1 h-1 w-24 rounded-full bg-[#292b2d]">
                  <div className="h-full rounded-full bg-[#b8ff3d]" style={{ width: `${p.progress}%` }} />
                </div>
              </div>
              <span className="text-xs text-[#898b87]">{formatProjectCreatedDate(p.created_at)}</span>
              <button onClick={() => onToast('Project menu opened.')} className="text-[#898b87] hover:text-white">
                <MoreHorizontal size={17} />
              </button>
            </div>
          ))}
        </Surface>
      )}
    </>
  );
}

function ProjectCard({
  project: p,
  index,
  onToast,
}: {
  project: ReturnType<typeof enrichProjectsWithStats>[0];
  index: number;
  onToast: (text: string) => void;
}) {
  const router = useRouter();
  return (
    <Surface className="group transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(184,255,61,0.3)]">
      <div className="flex items-start justify-between">
        <button onClick={() => router.push(`/projects/${p.id}`)} className="flex items-center gap-2 text-left">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: getProjectTone(p, index) }} />
          <span className="text-base font-medium">{p.name}</span>
        </button>
        <button onClick={() => onToast('Project menu opened.')} className="rounded-full p-1.5 text-[#6f716f] hover:bg-[#2a2a2a] hover:text-white">
          <MoreHorizontal size={17} />
        </button>
      </div>
      <p className="mt-5 h-10 text-xs leading-5 text-[#898b87]">{p.description}</p>
      <div className="mt-6 flex items-end justify-between">
        <span className="text-3xl font-semibold tracking-[-.06em]">{p.progress}%</span>
        <ArrowUpRight size={17} className="text-[#6f716f]" />
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#3a3a3a]">
        <div className="h-full rounded-full bg-[#b8ff3d] transition-all" style={{ width: `${p.progress}%` }} />
      </div>
      <div className="mt-5 flex justify-between border-t border-[#3a3a3a] pt-4 text-[11px] text-[#898b87]">
        <span>
          {p.taskCount} tasks · {p.completedCount} completed
        </span>
        <span>{formatProjectCreatedDate(p.created_at)}</span>
      </div>
    </Surface>
  );
}

// ============================================
// PROJECT DETAIL PAGE
// ============================================

function ProjectDetail({
  projects,
  tasks,
  onToast,
  onAddTask,
}: {
  projects: Project[];
  tasks: Task[];
  onToast: (text: string) => void;
  onAddTask: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const projectId = pathname.split('/projects/')[1];
  
  const project = getProjectById(projects, projectId);
  const [filter, setFilter] = useState<'All' | TaskStatus>('All');

  if (!project) {
    return (
      <div className="text-center py-20">
        <p className="text-[#898b87]">Project not found</p>
      </div>
    );
  }

  const projectTasks = getTasksForProject(tasks, project.id);
  const filtered = filter === 'All' ? projectTasks : projectTasks.filter((task) => task.status === filter);
  const progress = getProjectProgress(tasks, project.id);
  const taskCount = getProjectTaskCount(tasks, project.id);
  const completedCount = getCompletedTaskCount(tasks, project.id);
  const todoCount = projectTasks.filter((t) => t.status === 'todo').length;
  const inProgressCount = projectTasks.filter((t) => t.status === 'in-progress').length;

  return (
    <>
      <button onClick={() => router.push('/projects')} className="mb-6 flex items-center gap-1 text-xs text-[#898b87] hover:text-[#b8ff3d]">
        <ChevronLeft size={14} />
        Back to projects
      </button>
      <PageHeading
        eyebrow={`Projects / ${project.name}`}
        title={project.name}
        copy={project.description}
        action={
          <button
            onClick={onAddTask}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#b8ff3d] px-5 text-sm font-semibold text-[#0a0a0a]"
          >
            <Plus size={17} />
            Add Task
          </button>
        }
      />
      <div className="mb-4 grid gap-4 sm:grid-cols-4">
        <Stat label="Total tasks" value={String(taskCount)} change="Across this project" icon={Target} />
        <Stat label="Completed" value={String(completedCount)} change={`${progress}% of project`} icon={Check} accent />
        <Stat label="In progress" value={String(inProgressCount).padStart(2, '0')} change="Keep the momentum" icon={Zap} />
        <Stat label="Todo" value={String(todoCount).padStart(2, '0')} change="Up next" icon={Clock3} />
      </div>
      <div className="grid gap-4 xl:grid-cols-[.8fr_1.2fr]">
        <Surface>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium">Project progress</p>
              <p className="mt-2 text-xs text-[#898b87]">
                {completedCount} of {taskCount} tasks completed
              </p>
            </div>
            <span className="text-4xl font-semibold tracking-[-.08em] text-[#b8ff3d]">{progress}%</span>
          </div>
          <div className="mt-8 h-3 rounded-full bg-[#3a3a3a]">
            <div className="h-full rounded-full bg-[#b8ff3d]" style={{ width: `${progress}%` }} />
          </div>
          <div className="mt-7 rounded-[24px] bg-[#2a2a2a] p-4 text-xs text-[#898b87]">
            <div className="flex justify-between">
              <span>Created {formatProjectCreatedDate(project.created_at)}</span>
              <span className="text-[#b8ff3d]">On track</span>
            </div>
          </div>
        </Surface>
        <Surface className="p-0">
          <div className="border-b border-[#3a3a3a] p-5 sm:p-6">
            <div className="flex flex-wrap gap-2">
              {(['All', 'todo', 'in-progress', 'done'] as const).map((value) => (
                <PillButton key={value} active={filter === value} onClick={() => setFilter(value)}>
                  {value === 'All' ? 'All' : formatTaskStatus(value)}
                </PillButton>
              ))}
            </div>
          </div>
          <div>
            {filtered.map((task) => (
              <TaskRow key={task.id} task={task} projects={projects} onToast={onToast} />
            ))}
          </div>
        </Surface>
      </div>
    </>
  );
}

function TaskRow({ task, projects, onToast }: { task: Task; projects: Project[]; onToast: (text: string) => void }) {
  const projectName = getProjectNameForTask(task, projects);
  const displayDue = formatTaskDueDate(task);
  const overdue = isTaskOverdue(task);
  const createdDate = formatTaskCreatedDate(task);

  return (
    <div className="flex items-center gap-3 border-b border-[#292b2d] px-5 py-4 last:border-0 sm:px-6">
      <button
        onClick={() => onToast(task.status === 'done' ? 'Task reopened.' : 'Task marked as complete.')}
        className={cn(
          'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition hover:border-[#b8ff3d]',
          task.status === 'done' ? 'border-[#b8ff3d] bg-[#b8ff3d] text-[#0a0a0a]' : 'border-[#4b4e4c] text-transparent'
        )}
      >
        <Check size={13} strokeWidth={3} />
      </button>
      <div className="min-w-0 flex-1">
        <p className={cn('truncate text-xs font-medium', task.status === 'done' && 'text-[#6f716f] line-through')}>{task.title}</p>
        <p className="mt-1 text-[10px] text-[#6f716f]">
          {projectName} · Created {createdDate}
        </p>
      </div>
      <StatusBadge status={task.status} />
      <PriorityBadge priority={task.priority} />
      <span className={cn('hidden min-w-[70px] text-right text-[11px] sm:block', overdue ? 'text-[#ff9b7d]' : 'text-[#898b87]')}>
        {overdue ? 'Overdue' : displayDue}
      </span>
      <button onClick={() => onToast('Task actions opened.')} className="text-[#6f716f] hover:text-white">
        <MoreHorizontal size={16} />
      </button>
    </div>
  );
}

// ============================================
// TASKS PAGE
// ============================================

function TasksPage({
  projects,
  tasks,
  onCreate,
  onToast,
}: {
  projects: Project[];
  tasks: Task[];
  onCreate: () => void;
  onToast: (text: string) => void;
}) {
  const [query, setQuery] = useState('');
  const filtered = tasks.filter((t) => t.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <>
      <PageHeading
        title="All tasks"
        copy="Track everything happening across your projects."
        action={
          <button
            onClick={onCreate}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#b8ff3d] px-5 text-sm font-semibold text-[#0a0a0a]"
          >
            <Plus size={17} />
            New Task
          </button>
        }
      />
      <div className="mb-5 flex items-center gap-2">
        <div className="flex h-10 flex-1 items-center gap-2 rounded-full border border-[#292b2d] bg-[#111214] px-3 text-[#898b87] sm:max-w-[320px]">
          <Search size={15} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tasks..."
            className="w-full bg-transparent text-xs text-white outline-none placeholder:text-[#6f716f]"
          />
        </div>
      </div>
      {filtered.length > 0 ? (
        <Surface className="p-0">
          {filtered.map((task) => (
            <TaskRow key={task.id} task={task} projects={projects} onToast={onToast} />
          ))}
        </Surface>
      ) : (
        <EmptyState title="No tasks found" copy="Try adjusting your search or create a new task." action={onCreate} />
      )}
    </>
  );
}

function EmptyState({ title, copy, action }: { title: string; copy: string; action: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#b8ff3d]/30 bg-[#b8ff3d]/10 text-[#b8ff3d]">
        <Target size={23} />
      </div>
      <p className="text-base font-medium">{title}</p>
      <p className="mt-2 max-w-sm text-xs leading-5 text-[#898b87]">{copy}</p>
      <button onClick={action} className="mt-5 rounded-full bg-[#b8ff3d] px-4 py-2.5 text-xs font-semibold text-[#0a0a0a]">
        Create task
      </button>
    </div>
  );
}

// ============================================
// ANALYTICS PAGE
// ============================================

function Analytics({ projects, tasks }: { projects: Project[]; tasks: Task[] }) {
  const stats = getWorkspaceStats(projects, tasks);

  return (
    <>
      <PageHeading
        title="Analytics"
        copy="Understand how your workspace is progressing."
        action={
          <PillButton>
            Last 30 days <ChevronDown size={14} />
          </PillButton>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Total projects" value={String(stats.totalProjects).padStart(2, '0')} change="+2 this month" icon={FolderKanban} />
        <Stat label="Total tasks" value={String(stats.totalTasks)} change="+12% from last month" icon={Target} />
        <Stat label="In progress" value={String(stats.inProgressTasks)} change="6 due this week" icon={Zap} />
        <Stat label="Completed" value={String(stats.completedTasks)} change="+18% from last month" icon={Check} accent />
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <Productivity />
        <StatusDistribution tasks={tasks} />
      </div>
    </>
  );
}

// ============================================
// SETTINGS PAGE
// ============================================

function SettingsPage() {
  const [dark, setDark] = useState(true);
  return (
    <>
      <PageHeading title="Settings" copy="Tune your workspace to work the way you do." />
      <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
        <div className="hidden space-y-1 lg:block">
          {['Profile', 'Workspace', 'Appearance', 'Notifications', 'Preferences', 'Danger Zone'].map((item, i) => (
            <button
              key={item}
              className={cn(
                'w-full rounded-xl px-4 py-2.5 text-left text-sm transition hover:bg-[#1d1f20]',
                i === 2 && 'bg-[#1d1f20] font-medium text-[#f5f5f2]'
              )}
            >
              {item}
            </button>
          ))}
        </div>
        <Surface>
          <div className="mb-6">
            <p className="text-base font-medium">Appearance</p>
            <p className="mt-1 text-xs text-[#898b87]">Customize how DataTasker looks</p>
          </div>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#f5f5f2]">Theme</label>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => setDark(true)}
                  className={cn(
                    'flex h-20 w-28 items-center justify-center rounded-xl border',
                    dark ? 'border-[#b8ff3d] bg-[#1d1f20]' : 'border-[#292b2d] bg-[#111214]'
                  )}
                >
                  <div className="text-xs font-medium">Dark</div>
                </button>
                <button
                  onClick={() => setDark(false)}
                  className={cn(
                    'flex h-20 w-28 items-center justify-center rounded-xl border',
                    !dark ? 'border-[#b8ff3d] bg-[#f5f5f2]' : 'border-[#292b2d] bg-[#f5f5f2]/10'
                  )}
                >
                  <div className="text-xs font-medium text-[#0a0a0a]">Light</div>
                </button>
              </div>
            </div>
          </div>
        </Surface>
      </div>
    </>
  );
}

// ============================================
// COMMAND PALETTE
// ============================================

function CommandPalette({
  projects,
  onClose,
  onNavigate,
}: {
  projects: Project[];
  onClose: () => void;
  onNavigate: (href: string) => void;
}) {
  const [search, setSearch] = useState('');
  const results = [
    ...projects.map((p) => ({ label: p.name, type: 'Project', href: `/projects/${p.id}` })),
    { label: 'Analytics', type: 'Navigation', href: '/analytics' },
    { label: 'Settings', type: 'Navigation', href: '/settings' },
  ].filter((item) => item.label.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/75 px-4 pt-[20vh]" onMouseDown={onClose}>
      <div className="w-full max-w-[580px] rounded-2xl border border-[#292b2d] bg-[#111214] shadow-2xl" onMouseDown={(e) => e.stopPropagation()}>
        <div className="flex items-center border-b border-[#292b2d] px-4">
          <Search size={18} className="text-[#898b87]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects and pages..."
            className="w-full bg-transparent px-3 py-4 text-sm text-white outline-none placeholder:text-[#6f716f]"
            autoFocus
          />
          <kbd className="rounded-md border border-[#292b2d] px-2 py-1 text-[10px] text-[#6f716f]">ESC</kbd>
        </div>
        <div className="max-h-[400px] overflow-y-auto p-2">
          {results.length > 0 ? (
            results.map((item) => (
              <button
                key={item.href}
                onClick={() => onNavigate(item.href)}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left hover:bg-[#1d1f20]"
              >
                <div className="flex items-center gap-3">
                  {item.type === 'Project' ? <FolderKanban size={16} className="text-[#b8ff3d]" /> : <Command size={16} className="text-[#898b87]" />}
                  <span className="text-sm">{item.label}</span>
                </div>
                <span className="text-[10px] uppercase tracking-wider text-[#6f716f]">{item.type}</span>
              </button>
            ))
          ) : (
            <div className="py-8 text-center text-sm text-[#6f716f]">No results found</div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// FORM MODAL
// ============================================

function FormModal({ kind, onClose, onSave }: { kind: 'project' | 'task'; onClose: () => void; onSave: () => void }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const valid = name.trim().length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4" onMouseDown={onClose}>
      <div className="w-full max-w-[520px] rounded-2xl border border-[#292b2d] bg-[#111214] p-6 shadow-2xl" onMouseDown={(e) => e.stopPropagation()}>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Create {kind}</h2>
          <button onClick={onClose} className="rounded-full p-1 text-[#898b87] hover:bg-[#1d1f20] hover:text-white">
            <X size={18} />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#f5f5f2]">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={`${kind === 'project' ? 'Project' : 'Task'} name`}
              className="mt-2 w-full rounded-xl border border-[#292b2d] bg-[#1d1f20] px-4 py-2.5 text-sm text-white outline-none focus:border-[#b8ff3d] placeholder:text-[#6f716f]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#f5f5f2]">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description..."
              rows={3}
              className="mt-2 w-full rounded-xl border border-[#292b2d] bg-[#1d1f20] px-4 py-2.5 text-sm text-white outline-none focus:border-[#b8ff3d] placeholder:text-[#6f716f]"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-full border border-[#292b2d] px-4 py-2.5 text-xs font-semibold text-[#f5f5f2] hover:bg-[#1d1f20]">
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={!valid}
            className="rounded-full bg-[#b8ff3d] px-4 py-2.5 text-xs font-semibold text-[#0a0a0a] hover:bg-[#c9ff69] disabled:opacity-50"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
