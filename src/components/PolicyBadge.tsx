import { useState } from 'react';
import { ShieldCheck, ChevronDown, ChevronUp, Terminal, Key } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.tsx';

export function PolicyBadge() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="bg-slate-900 border border-slate-800 text-slate-200 rounded-xl overflow-hidden shadow-sm transition-all">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2.5 flex items-center justify-between text-left hover:bg-slate-850/50 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Row Level Security Active
              </span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-xs text-slate-400 font-mono truncate max-w-md">
              using (auth.uid() = user_id)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-400 text-xs">
          <span className="hidden sm:inline">Inspect Security Policy</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="px-4 py-3 border-t border-slate-800 bg-slate-950/70 text-xs space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1.5 font-medium text-slate-300">
              <Terminal className="w-3.5 h-3.5 text-indigo-400" />
              Database Security Rules & RLS Parity
            </span>
            {user && (
              <span className="flex items-center gap-1 font-mono text-[11px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">
                <Key className="w-3 h-3 text-amber-400" />
                UID: {user.uid}
              </span>
            )}
          </div>

          <div className="bg-slate-900/90 rounded-lg p-3 font-mono text-[11px] leading-relaxed border border-slate-800 overflow-x-auto text-slate-300">
            <div className="text-slate-500 mb-1">// Configured Row Level Security Policy</div>
            <div className="text-emerald-400 font-semibold">
              CREATE POLICY &quot;Users can manage own projects&quot;
            </div>
            <div className="text-indigo-300">
              ON public.projects FOR ALL
            </div>
            <div className="text-amber-300 font-semibold">
              USING (auth.uid() = user_id);
            </div>
          </div>

          <p className="text-slate-400 text-[11px] leading-normal">
            Enforced at the database engine layer. Every query is scoped to your authenticated UID.
            Cross-tenant reads, modifications, and deletions by external users are rejected before reaching storage.
          </p>
        </div>
      )}
    </div>
  );
}
