import React from 'react';
import { Bot, LogOut, Code, Briefcase } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const isLanding = location.pathname === '/' && !token;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <header className={`${isLanding ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'} border-b sticky top-0 z-50`}>
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">
            <Link to={token ? '/dashboard' : '/'} className="flex items-center gap-2.5 group">
              <Bot className={`${isLanding ? 'text-blue-400' : 'text-blue-600'} h-7 w-7`} />
              <span className={`text-lg font-bold tracking-tight ${isLanding ? 'text-white' : 'text-slate-900'}`}>
                AI CareerForge
              </span>
            </Link>

            <nav className="flex items-center gap-3">
              {token ? (
                <>
                  <Link to="/dashboard"
                    className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors px-3 py-2 rounded-lg hover:bg-slate-50">
                    Dashboard
                  </Link>
                  <button onClick={handleLogout}
                    className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors px-3 py-2 rounded-lg hover:bg-slate-50">
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login"
                    className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${isLanding ? 'text-slate-300 hover:text-white hover:bg-white/10' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'}`}>
                    Login
                  </Link>
                  <Link to="/register"
                    className="text-sm font-semibold bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                    Get Started
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2.5">
              <Bot className="text-slate-400 h-5 w-5" />
              <span className="text-sm font-semibold text-slate-500">AI CareerForge</span>
            </div>
            <p className="text-sm text-slate-400">
              &copy; {new Date().getFullYear()} AI CareerForge. All rights reserved.
            </p>
            <div className="flex items-center gap-5 text-slate-400">
              <a href="https://github.com/Sridhar-GS/AICarrerForge" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors"><Code size={18} /></a>
              <a href="#" className="hover:text-blue-600 transition-colors"><Briefcase size={18} /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}