import { FolderGit2, PlayCircle, CheckCircle2, Clock, Layers } from 'lucide-react';
import { Project, ProjectStatus } from '../types/project.ts';

interface ProjectStatsProps {
  projects: Project[];
  selectedStatus: ProjectStatus | 'all';
  onSelectStatus: (status: ProjectStatus | 'all') => void;
}

export function ProjectStats({ projects, selectedStatus, onSelectStatus }: ProjectStatsProps) {
  const total = projects.length;
  const inProgress = projects.filter((p) => p.status === 'in_progress').length;
  const planning = projects.filter((p) => p.status === 'planning').length;
  const completed = projects.filter((p) => p.status === 'completed').length;
  const onHold = projects.filter((p) => p.status === 'on_hold').length;

  const statItems = [
    {
      id: 'all' as const,
      label: 'All Projects',
      count: total,
      icon: Layers,
      color: 'text-indigo-400',
      activeBorder: 'border-indigo-500/50 bg-indigo-500/5',
    },
    {
      id: 'in_progress' as const,
      label: 'In Progress',
      count: inProgress,
      icon: PlayCircle,
      color: 'text-blue-400',
      activeBorder: 'border-blue-500/50 bg-blue-500/5',
    },
    {
      id: 'planning' as const,
      label: 'Planning',
      count: planning,
      icon: Clock,
      color: 'text-purple-400',
      activeBorder: 'border-purple-500/50 bg-purple-500/5',
    },
    {
      id: 'completed' as const,
      label: 'Completed',
      count: completed,
      icon: CheckCircle2,
      color: 'text-emerald-400',
      activeBorder: 'border-emerald-500/50 bg-emerald-500/5',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {statItems.map((item) => {
        const Icon = item.icon;
        const isSelected = selectedStatus === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onSelectStatus(item.id)}
            className={`p-4 rounded-xl border text-left transition-all relative group overflow-hidden ${
              isSelected
                ? `${item.activeBorder} shadow-sm`
                : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-850/60'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-400 group-hover:text-slate-300">
                {item.label}
              </span>
              <div className={`p-1.5 rounded-lg bg-slate-800/80 ${item.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-white">{item.count}</span>
              {item.id === 'all' && onHold > 0 && (
                <span className="text-xs text-amber-400/80">({onHold} on hold)</span>
              )}
            </div>
            {isSelected && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
            )}
          </button>
        );
      })}
    </div>
  );
}
