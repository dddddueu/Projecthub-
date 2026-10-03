import { X, Calendar, Key, ShieldCheck, Clock, Edit2, Trash2 } from 'lucide-react';
import { Project } from '../types/project.ts';
import { formatTimestamp, getPriorityDetails, getStatusDetails } from '../lib/format.ts';

interface ProjectDetailsModalProps {
  isOpen: boolean;
  project: Project | null;
  onClose: () => void;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

export function ProjectDetailsModal({
  isOpen,
  project,
  onClose,
  onEdit,
  onDelete,
}: ProjectDetailsModalProps) {
  if (!isOpen || !project) return null;

  const statusInfo = getStatusDetails(project.status);
  const priorityInfo = getPriorityDetails(project.priority);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-2">
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

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto">
          <div>
            <h2 className="text-xl font-bold text-white break-words">{project.name}</h2>
            <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                Created {formatTimestamp(project.createdAt)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                Updated {formatTimestamp(project.updatedAt)}
              </span>
            </div>
          </div>

          {/* Description Section */}
          <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800/80">
            <h4 className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
              Project Description
            </h4>
            {project.description ? (
              <p className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
                {project.description}
              </p>
            ) : (
              <p className="text-xs italic text-slate-500">No detailed description provided.</p>
            )}
          </div>

          {/* Metadata & Security Specs */}
          <div className="bg-slate-950/40 rounded-xl p-4 border border-slate-800/80 space-y-2.5 text-xs">
            <div className="flex items-center gap-2 text-slate-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Row Level Security Attributes
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-400 font-mono text-[11px]">
              <div className="bg-slate-900 p-2 rounded border border-slate-800 overflow-hidden">
                <span className="text-slate-500 block text-[10px]">Record ID (uuid)</span>
                <span className="text-slate-300 truncate block">{project.id}</span>
              </div>
              <div className="bg-slate-900 p-2 rounded border border-slate-800 overflow-hidden">
                <span className="text-slate-500 block text-[10px]">Owner ID (user_id)</span>
                <span className="text-slate-300 truncate block">{project.userId}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onDelete(project);
            }}
            className="px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete Project
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onEdit(project);
              }}
              className="px-4 py-2 rounded-xl text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Edit Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
