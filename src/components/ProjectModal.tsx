import { useState, useEffect, FormEvent } from 'react';
import { X, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { Project, ProjectPriority, ProjectStatus } from '../types/project.ts';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    description: string;
    status: ProjectStatus;
    priority: ProjectPriority;
  }) => Promise<void>;
  projectToEdit?: Project | null;
}

export function ProjectModal({
  isOpen,
  onClose,
  onSubmit,
  projectToEdit,
}: ProjectModalProps) {
  const isEditing = Boolean(projectToEdit);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('planning');
  const [priority, setPriority] = useState<ProjectPriority>('medium');
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (projectToEdit) {
      setName(projectToEdit.name);
      setDescription(projectToEdit.description || '');
      setStatus(projectToEdit.status || 'planning');
      setPriority(projectToEdit.priority || 'medium');
    } else {
      setName('');
      setDescription('');
      setStatus('planning');
      setPriority('medium');
    }
    setValidationError(null);
  }, [projectToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const trimmedName = name.trim();
    if (!trimmedName) {
      setValidationError('Project name is required.');
      return;
    }
    if (trimmedName.length > 120) {
      setValidationError('Project name cannot exceed 120 characters.');
      return;
    }
    if (description.length > 2000) {
      setValidationError('Description cannot exceed 2000 characters.');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        name: trimmedName,
        description: description.trim(),
        status,
        priority,
      });
      onClose();
    } catch (err: unknown) {
      console.error('Error saving project:', err);
      setValidationError(
        err instanceof Error ? err.message : 'Failed to save project. Please verify permissions.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div>
            <h2 className="text-lg font-semibold text-white">
              {isEditing ? 'Edit Project' : 'Create New Project'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {isEditing
                ? 'Update your project specifications and status'
                : 'Define project scope and metadata under your secure user workspace'}
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {validationError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Project Name */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="name" className="text-xs font-medium text-slate-300">
                Project Name <span className="text-rose-400">*</span>
              </label>
              <span className={`text-[11px] ${name.length > 120 ? 'text-rose-400' : 'text-slate-500'}`}>
                {name.length}/120
              </span>
            </div>
            <input
              id="name"
              type="text"
              required
              maxLength={120}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Next-Gen Mobile Redesign"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="description" className="text-xs font-medium text-slate-300">
                Description
              </label>
              <span
                className={`text-[11px] ${
                  description.length > 2000 ? 'text-rose-400' : 'text-slate-500'
                }`}
              >
                {description.length}/2000
              </span>
            </div>
            <textarea
              id="description"
              rows={4}
              maxLength={2000}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Outline project objectives, architecture decisions, and target milestones..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
            />
          </div>

          {/* Status & Priority Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="status" className="block text-xs font-medium text-slate-300 mb-1.5">
                Lifecycle Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500 transition-all"
              >
                <option value="planning">Planning</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="on_hold">On Hold</option>
              </select>
            </div>

            <div>
              <label htmlFor="priority" className="block text-xs font-medium text-slate-300 mb-1.5">
                Priority Tier
              </label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as ProjectPriority)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500 transition-all"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* Quick preset templates for fast prototyping */}
          {!isEditing && (
            <div className="pt-2">
              <span className="text-[11px] text-slate-400 font-medium block mb-1.5">
                Quick Template:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { name: 'API Microservices Gateway', status: 'in_progress', priority: 'high' },
                  { name: 'Mobile App v2.0 Architecture', status: 'planning', priority: 'medium' },
                  { name: 'Database Audit & RLS Testing', status: 'completed', priority: 'urgent' },
                ].map((tpl) => (
                  <button
                    key={tpl.name}
                    type="button"
                    onClick={() => {
                      setName(tpl.name);
                      setStatus(tpl.status as ProjectStatus);
                      setPriority(tpl.priority as ProjectPriority);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-750 text-slate-300 text-xs border border-slate-700/60 transition-colors"
                  >
                    + {tpl.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-600/20 flex items-center gap-2 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{isEditing ? 'Save Changes' : 'Create Project'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
