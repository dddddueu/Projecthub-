import { Timestamp } from 'firebase/firestore';
import { ProjectPriority, ProjectStatus } from '../types/project.ts';

export function formatTimestamp(ts: Timestamp | { seconds: number; nanoseconds: number } | undefined | null): string {
  if (!ts) return 'Just now';
  let date: Date;
  if ('toDate' in ts && typeof ts.toDate === 'function') {
    date = ts.toDate();
  } else if ('seconds' in ts) {
    date = new Date(ts.seconds * 1000);
  } else {
    date = new Date();
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

export function formatRelativeTime(ts: Timestamp | { seconds: number; nanoseconds: number } | undefined | null): string {
  if (!ts) return 'Just now';
  let timeMs: number;
  if ('toDate' in ts && typeof ts.toDate === 'function') {
    timeMs = ts.toDate().getTime();
  } else if ('seconds' in ts) {
    timeMs = ts.seconds * 1000;
  } else {
    return 'Just now';
  }

  const diffSec = Math.floor((Date.now() - timeMs) / 1000);
  if (diffSec < 60) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDays = Math.floor(diffHr / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatTimestamp(ts);
}

export function getStatusDetails(status: ProjectStatus) {
  switch (status) {
    case 'in_progress':
      return {
        label: 'In Progress',
        bg: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        dot: 'bg-blue-400',
      };
    case 'completed':
      return {
        label: 'Completed',
        bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        dot: 'bg-emerald-400',
      };
    case 'on_hold':
      return {
        label: 'On Hold',
        bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        dot: 'bg-amber-400',
      };
    case 'planning':
    default:
      return {
        label: 'Planning',
        bg: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
        dot: 'bg-purple-400',
      };
  }
}

export function getPriorityDetails(priority: ProjectPriority) {
  switch (priority) {
    case 'urgent':
      return {
        label: 'Urgent',
        badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      };
    case 'high':
      return {
        label: 'High',
        badge: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
      };
    case 'medium':
      return {
        label: 'Medium',
        badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      };
    case 'low':
    default:
      return {
        label: 'Low',
        badge: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
      };
  }
}
