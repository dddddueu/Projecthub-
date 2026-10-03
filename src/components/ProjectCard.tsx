import { MoreVertical, Edit2, Trash2, ExternalLink, Calendar } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Project } from '../types/project.ts';
import { formatRelativeTime, getPriorityDetails, getStatusDetails } from '../lib/format.ts';

interface ProjectCardProps {
  project: Project;
  onView: (project: Project) => void;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

export function ProjectCard({ project, onView, onEdit, onDelete }: ProjectCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const statusInfo = getStatusDetails(project.status);
  const priorityInfo = getPriorityDetails(project.priority);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  return (
    <div
      onClick={() => onView(project)}
      className="group bg-slate-900/80 hover:bg-slate-850 border border-slate-800/90 hover:border-slate-700/80 rounded-2xl p-5 transition-all duration-200 shadow-sm hover:shadow-md flex flex-col justify-between cursor-pointer relative"
    >
      <div>
        {/* Top bar with badges and action menu */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusInfo.bg}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
              {statusInfo.label}
            </span>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${priorityInfo.badge}`}
            >
              {priorityInfo.label}
            </span>
          </div>

          <div
            ref={menuRef}
            className="relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Project actions"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-7 w-36 bg-slate-900 border border-slate-700 rounded-xl shadow-xl py-1 z-20 text-xs">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onView(project);
                  }}
                  className="w-full px-3 py-1.5 text-left text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  View Details
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit(project);
                  }}
                  className="w-full px-3 py-1.5 text-left text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2"
                >
                  <Edit2 className="w-3.5 h-3.5 text-indigo-400" />
                  Edit Project
                </button>
                <div className="my-1 border-t border-slate-800" />
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete(project);
                  }}
                  className="w-full px-3 py-1.5 text-left text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 flex items-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Project Title */}
        <h3 className="text-base font-semibold text-white group-hover:text-indigo-300 transition-colors line-clamp-1 mb-2">
          {project.name}
        </h3>

        {/* Project Description */}
        <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-4 min-h-[3rem]">
          {project.description || <span className="italic text-slate-600">No description provided</span>}
        </p>
      </div>

      {/* Footer with timestamp */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
        <span className="flex items-center gap-1.5">
          <Calendar className="w-3 h-3 text-slate-500" />
          {formatRelativeTime(project.createdAt)}
        </span>
        <span className="font-mono text-[10px] text-slate-500 group-hover:text-slate-400">
          id: {project.id.slice(0, 6)}...
        </span>
      </div>
    </div>
  );
}
