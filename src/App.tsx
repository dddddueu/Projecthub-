import { useState, useEffect, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Plus,
  RefreshCw,
  FolderPlus,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { LandingHero } from './components/LandingHero.tsx';
import { PolicyBadge } from './components/PolicyBadge.tsx';
import { ProjectStats } from './components/ProjectStats.tsx';
import { ProjectCard } from './components/ProjectCard.tsx';
import { ProjectTableView } from './components/ProjectTableView.tsx';
import { ProjectModal } from './components/ProjectModal.tsx';
import { ProjectDetailsModal } from './components/ProjectDetailsModal.tsx';
import { DeleteConfirmModal } from './components/DeleteConfirmModal.tsx';
import {
  subscribeUserProjects,
  createProject,
  updateProject,
  deleteProject,
} from './services/projectService.ts';
import { Project, ProjectPriority, ProjectStatus, SortOption, ViewMode } from './types/project.ts';

function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Sorting state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<ProjectPriority | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [inspectingProject, setInspectingProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);

  // Subscribe to user projects in real-time
  useEffect(() => {
    if (!user) {
      setProjects([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = subscribeUserProjects(
      user.uid,
      (fetchedProjects) => {
        setProjects(fetchedProjects);
        setLoading(false);
      },
      (err) => {
        console.error('Subscription error:', err);
        setError('Failed to load projects. Please verify your connection.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Filtered & Sorted projects
  const filteredProjects = useMemo(() => {
    let result = [...projects];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q))
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter((p) => p.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      result = result.filter((p) => p.priority === priorityFilter);
    }

    result.sort((a, b) => {
      if (sortBy === 'newest') {
        const tA = (a.createdAt as any)?.seconds || 0;
        const tB = (b.createdAt as any)?.seconds || 0;
        return tB - tA;
      }
      if (sortBy === 'oldest') {
        const tA = (a.createdAt as any)?.seconds || 0;
        const tB = (b.createdAt as any)?.seconds || 0;
        return tA - tB;
      }
      if (sortBy === 'name-asc') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'name-desc') {
        return b.name.localeCompare(a.name);
      }
      if (sortBy === 'priority') {
        const weight: Record<ProjectPriority, number> = {
          urgent: 4,
          high: 3,
          medium: 2,
          low: 1,
        };
        return (weight[b.priority] || 0) - (weight[a.priority] || 0);
      }
      return 0;
    });

    return result;
  }, [projects, searchQuery, statusFilter, priorityFilter, sortBy]);

  // Handlers
  const handleOpenCreateModal = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleSaveProject = async (data: {
    name: string;
    description: string;
    status: ProjectStatus;
    priority: ProjectPriority;
  }) => {
    if (editingProject) {
      await updateProject(editingProject.id, data);
    } else {
      await createProject(data);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingProject) return;
    await deleteProject(deletingProject.id);
  };

  const handleSeedStarterProject = async () => {
    try {
      await createProject({
        name: 'Infrastructure Migration & RLS Rollout',
        description:
          'Establish row-level security policies across all application schemas. Validate zero-trust tenancy and automated test runners.',
        status: 'in_progress',
        priority: 'high',
      });
    } catch (err) {
      console.error('Failed to seed starter project:', err);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        <p className="text-sm font-medium">Initializing secure workspace...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      <Navbar onNewProject={handleOpenCreateModal} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!user ? (
          <LandingHero />
        ) : (
          <div className="space-y-6">
            {/* Top Security & Policy banner */}
            <PolicyBadge />

            {/* Quick Stats overview */}
            <ProjectStats
              projects={projects}
              selectedStatus={statusFilter}
              onSelectStatus={setStatusFilter}
            />

            {/* Control Bar: Search, Filters, View Modes */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-4">
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search projects by name or description..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-white"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Filter and View toggles */}
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Status selector */}
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as ProjectStatus | 'all')}
                    className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="all">All Statuses</option>
                    <option value="planning">Planning</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="on_hold">On Hold</option>
                  </select>

                  {/* Priority selector */}
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value as ProjectPriority | 'all')}
                    className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="all">All Priorities</option>
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>

                  {/* Sort selector */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="newest">Sort: Newest</option>
                    <option value="oldest">Sort: Oldest</option>
                    <option value="name-asc">Name: A to Z</option>
                    <option value="name-desc">Name: Z to A</option>
                    <option value="priority">Sort: Priority</option>
                  </select>

                  {/* View Mode Toggle */}
                  <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-0.5">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-1.5 rounded-lg text-xs transition-colors ${
                        viewMode === 'grid'
                          ? 'bg-slate-800 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                      title="Grid view"
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('table')}
                      className={`p-1.5 rounded-lg text-xs transition-colors ${
                        viewMode === 'table'
                          ? 'bg-slate-800 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                      title="Table view"
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Active filters summary */}
              {(searchQuery || statusFilter !== 'all' || priorityFilter !== 'all') && (
                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/80">
                  <span className="text-slate-400">
                    Showing <strong className="text-white">{filteredProjects.length}</strong> of{' '}
                    <strong className="text-white">{projects.length}</strong> projects
                  </span>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('all');
                      setPriorityFilter('all');
                    }}
                    className="text-indigo-400 hover:text-indigo-300 underline font-medium"
                  >
                    Reset all filters
                  </button>
                </div>
              )}
            </div>

            {/* Error Banner */}
            {error && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
                <button
                  onClick={() => window.location.reload()}
                  className="px-2.5 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-medium"
                >
                  Reload
                </button>
              </div>
            )}

            {/* Projects Presentation */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((idx) => (
                  <div
                    key={idx}
                    className="h-44 bg-slate-900/40 border border-slate-800/60 rounded-2xl animate-pulse p-5 space-y-3"
                  >
                    <div className="w-24 h-4 bg-slate-800 rounded-full" />
                    <div className="w-3/4 h-5 bg-slate-800 rounded" />
                    <div className="w-full h-12 bg-slate-800/50 rounded" />
                  </div>
                ))}
              </div>
            ) : projects.length === 0 ? (
              /* No projects at all */
              <div className="py-16 px-4 text-center bg-slate-900/40 border border-slate-800/80 rounded-2xl max-w-lg mx-auto space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
                  <FolderPlus className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">No projects yet</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
                    Your private project space is completely empty. Create your first project or seed
                    a template to get started.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={handleOpenCreateModal}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/20 flex items-center gap-2 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Create First Project
                  </button>
                  <button
                    onClick={handleSeedStarterProject}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-750 border border-slate-700 transition-colors"
                  >
                    Seed Starter Project
                  </button>
                </div>
              </div>
            ) : filteredProjects.length === 0 ? (
              /* No projects match query */
              <div className="py-12 px-4 text-center bg-slate-900/30 border border-slate-800/60 rounded-2xl max-w-md mx-auto space-y-3">
                <SlidersHorizontal className="w-8 h-8 text-slate-500 mx-auto" />
                <h3 className="text-sm font-semibold text-white">No matching projects found</h3>
                <p className="text-xs text-slate-400">
                  Try adjusting your search keywords or clearing your status and priority filters.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                    setPriorityFilter('all');
                  }}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onView={setInspectingProject}
                    onEdit={handleOpenEditModal}
                    onDelete={setDeletingProject}
                  />
                ))}
              </div>
            ) : (
              <ProjectTableView
                projects={filteredProjects}
                onView={setInspectingProject}
                onEdit={handleOpenEditModal}
                onDelete={setDeletingProject}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-600">
        <p>
          ProjectHub &bull; Row Level Security &bull; PostgreSQL DDL Parity &bull; Cryptographically Isolated
        </p>
      </footer>

      {/* Modals */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveProject}
        projectToEdit={editingProject}
      />

      <ProjectDetailsModal
        isOpen={Boolean(inspectingProject)}
        project={inspectingProject}
        onClose={() => setInspectingProject(null)}
        onEdit={(p) => {
          setInspectingProject(null);
          handleOpenEditModal(p);
        }}
        onDelete={(p) => {
          setInspectingProject(null);
          setDeletingProject(p);
        }}
      />

      <DeleteConfirmModal
        isOpen={Boolean(deletingProject)}
        project={deletingProject}
        onClose={() => setDeletingProject(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Dashboard />
    </AuthProvider>
  );
}
