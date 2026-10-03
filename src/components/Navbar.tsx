import { FolderGit2, Plus, LogOut, LogIn, User, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.tsx';

interface NavbarProps {
  onNewProject: () => void;
}

export function Navbar({ onNewProject }: NavbarProps) {
  const { user, signInWithGoogle, signOutUser } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center shadow-md shadow-indigo-500/20 text-white">
            <FolderGit2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-base tracking-tight">ProjectHub</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                RLS v1.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Private Workspace Management
            </p>
          </div>
        </div>

        {/* User profile & actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <button
                onClick={onNewProject}
                className="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm shadow-indigo-600/30 flex items-center gap-1.5 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Plus className="w-4 h-4" />
                <span>New Project</span>
              </button>

              <div className="h-6 w-px bg-slate-800 hidden sm:block" />

              <div className="flex items-center gap-2.5">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-8 h-8 rounded-full border border-slate-700 object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-xs font-semibold border border-slate-700">
                    <User className="w-4 h-4" />
                  </div>
                )}

                <div className="hidden md:block text-left text-xs">
                  <div className="text-white font-medium truncate max-w-[140px]">
                    {user.displayName || user.email?.split('@')[0]}
                  </div>
                  <div className="text-slate-400 text-[10px] truncate max-w-[140px]">
                    {user.email}
                  </div>
                </div>

                <button
                  onClick={signOutUser}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={signInWithGoogle}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-900 bg-white hover:bg-slate-100 shadow-sm flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In with Google</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
