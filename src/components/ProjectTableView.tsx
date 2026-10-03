import { Edit2, Trash2, Eye } from 'lucide-react';
import { Project } from '../types/project.ts';
import { formatRelativeTime, getPriorityDetails, getStatusDetails } from '../lib/format.ts';

interface ProjectTableViewProps {
  projects: Project[];
  onView: (project: Project) => void;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

export function ProjectTableView({
  projects,
  onView,
  onEdit,
  onDelete,
}: ProjectTableViewProps) {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-medium uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Project Name</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Priority</th>
              <th className="py-3 px-4 hidden md:table-cell">Created</th>
              <th className="py-3 px-4 hidden lg:table-cell">UUID</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 text-slate-300">
            {projects.map((project) => {
              const statusInfo = getStatusDetails(project.status);
              const priorityInfo = getPriorityDetails(project.priority);

              return (
                <tr
                  key={project.id}
                  onClick={() => onView(project)}
                  className="hover:bg-slate-850/60 cursor-pointer transition-colors group"
                >
                  <td className="py-3.5 px-4 font-medium text-white group-hover:text-indigo-300 transition-colors">
                    <div className="max-w-xs truncate font-semibold">{project.name}</div>
                    {project.description && (
                      <div className="text-[11px] text-slate-500 truncate max-w-sm">
                        {project.description}
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${statusInfo.bg}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
                      {statusInfo.label}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${priorityInfo.badge}`}
                    >
                      {priorityInfo.label}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 hidden md:table-cell whitespace-nowrap">
                    {formatRelativeTime(project.createdAt)}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[10px] text-slate-500 hidden lg:table-cell">
                    {project.id.slice(0, 8)}...
                  </td>
                  <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onView(project)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEdit(project)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition-colors"
                        title="Edit Project"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(project)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete Project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
