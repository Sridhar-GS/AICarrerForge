import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Bot } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
      window.location.reload();
    } catch (err) {
      alert("Error: " + err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center p-4">
      <div className="bg-white p-8 rounded-2xl w-full max-w-md border border-slate-200 shadow-xl">
        <h2 className="text-2xl font-bold mb-2 text-slate-900">Welcome Back</h2>
        <p className="text-slate-500 mb-6 text-sm">Sign in to continue to AI CareerForge.</p>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
            <input type="email" required onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" placeholder="you@company.com" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
            <input type="password" required onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" placeholder="••••••••" />
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-md active:scale-[0.98] mt-2">Login</button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">Don't have an account? <Link to="/register" className="text-blue-600 font-semibold hover:underline">Sign up</Link></p>
      </div>
    </div>
  );
}