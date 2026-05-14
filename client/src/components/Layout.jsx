import React from 'react';
import { Bot, LogOut, Code, Briefcase } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Layout({ children }) {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="text-blue-600 h-8 w-8" />
            <Link to="/dashboard" className="text-xl font-bold tracking-tight text-slate-900">
              AI CareerForge
            </Link>
          </div>
          <nav className="flex items-center gap-6">
            {token ? (
              <>
                <Link to="/dashboard" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Get Started
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Bot className="text-slate-400 h-6 w-6" />
              <span className="text-sm font-semibold text-slate-500 tracking-tight">AI CareerForge</span>
            </div>
            <p className="text-sm text-slate-500">
              &copy; {new Date().getFullYear()} AI CareerForge. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-slate-400">
              <a href="#" className="hover:text-blue-600 transition-colors"><Code size={20} /></a>
              <a href="#" className="hover:text-blue-600 transition-colors"><Briefcase size={20} /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}