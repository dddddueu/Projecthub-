import { Shield, KeyRound, Lock, Database, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.tsx';

export function LandingHero() {
  const { signInWithGoogle, authError } = useAuth();

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-12">
      {/* Top Banner / Hero */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
          <Shield className="w-3.5 h-3.5" />
          <span>Active Policy: using (auth.uid() = user_id)</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          Secure, isolated projects for every team member.
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Manage your development, infrastructure, and feature initiatives with full cryptographic
          isolation. You only see what you own.
        </p>

        {authError && (
          <div className="max-w-md mx-auto p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs">
            {authError}
          </div>
        )}

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={signInWithGoogle}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-medium text-sm text-slate-900 bg-white hover:bg-slate-100 shadow-lg shadow-white/10 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {/* Google G SVG */}
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.19 0 10.04 0 12s.45 3.81 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Continue with Google</span>
            <ArrowRight className="w-4 h-4 text-slate-500" />
          </button>
        </div>
      </div>

      {/* SQL & Architecture Schema Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-400" />
            <h3 className="font-semibold text-white text-sm sm:text-base">
              Configured Database Schema & Security Policy
            </h3>
          </div>
          <span className="text-[11px] font-mono bg-slate-800 text-slate-300 px-2.5 py-1 rounded">
            PostgreSQL DDL + RLS
          </span>
        </div>

        <div className="bg-slate-950 rounded-xl p-4 sm:p-5 font-mono text-xs text-slate-300 overflow-x-auto border border-slate-850 space-y-2">
          <div className="text-slate-500">// 1. Projects Table Definition</div>
          <div>
            <span className="text-indigo-400">CREATE TABLE</span> public.projects (
          </div>
          <div className="pl-4 text-slate-400">
            id <span className="text-amber-300">uuid</span> DEFAULT gen_random_uuid() PRIMARY KEY,
          </div>
          <div className="pl-4 text-slate-400">
            user_id <span className="text-amber-300">uuid</span> REFERENCES auth.users NOT NULL,
          </div>
          <div className="pl-4 text-slate-400">
            name <span className="text-emerald-400">text</span> NOT NULL,
          </div>
          <div className="pl-4 text-slate-400">
            description <span className="text-emerald-400">text</span>,
          </div>
          <div className="pl-4 text-slate-400">
            created_at <span className="text-amber-300">timestamp with time zone</span> DEFAULT timezone(&apos;utc&apos;::text, now()) NOT NULL
          </div>
          <div>);</div>

          <div className="pt-2 text-slate-500">// 2. Enable Row Level Security</div>
          <div>
            <span className="text-indigo-400">ALTER TABLE</span> public.projects <span className="text-indigo-400">ENABLE ROW LEVEL SECURITY</span>;
          </div>

          <div className="pt-2 text-slate-500">// 3. User Ownership Policy</div>
          <div>
            <span className="text-indigo-400">CREATE POLICY</span> <span className="text-amber-300">&quot;Users can manage own projects&quot;</span>
          </div>
          <div className="pl-4">
            <span className="text-indigo-400">ON</span> public.projects <span className="text-indigo-400">FOR ALL</span>
          </div>
          <div className="pl-4 text-emerald-400 font-semibold">
            <span className="text-indigo-400">USING</span> (auth.uid() = user_id);
          </div>
        </div>

        {/* Feature Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-semibold text-white">Zero Leakage</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Unauthorized queries are blocked at the engine layer before execution.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <KeyRound className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-semibold text-white">OAuth Verification</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                User identity binds automatically to the session via Google OpenID tokens.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-semibold text-white">Real-Time Sync</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Mutations are pushed instantly to all active tabs without manual refreshes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
