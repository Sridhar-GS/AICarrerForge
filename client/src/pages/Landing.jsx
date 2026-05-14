import { Link } from 'react-router-dom';
import { Bot, Zap, FileText, Mic, GitBranch, ArrowRight, CheckCircle, Clock, Target } from 'lucide-react';

export default function Landing() {
  return (
    <div className="font-[Inter,sans-serif]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(circle at 30% 20%, rgba(59,130,246,0.3), transparent 50%), radial-gradient(circle at 70% 80%, rgba(16,185,129,0.2), transparent 50%)' }} />
        <div className="relative max-w-5xl mx-auto px-4 py-24 sm:py-32 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-8 border border-white/10">
            <Zap size={14} className="text-amber-400" /> AI-Powered Interview Assessment
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight mb-6">
            Know Your <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">Interview Readiness</span>
            <br />In Under 2 Minutes
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Stop guessing. AI CareerForge evaluates your resume, technical skills, communication, and portfolio to give you a clear readiness score with actionable improvements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg text-lg">
              Get Started Free <ArrowRight size={20} />
            </Link>
            <Link to="/login" className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold px-8 py-4 rounded-xl transition-all border border-white/10">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">How It Works</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Four dimensions of evaluation, one comprehensive score — all in under 2 minutes.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: FileText, title: 'Resume Analysis', desc: 'AI parses your PDF resume for ATS compatibility, keywords, and formatting.', color: 'text-blue-500', bg: 'bg-blue-50' },
              { icon: GitBranch, title: 'Portfolio Review', desc: 'Your GitHub repos are evaluated for quality, diversity, and relevance.', color: 'text-purple-500', bg: 'bg-purple-50' },
              { icon: Target, title: 'Technical Quiz', desc: 'Role-specific questions test your core technical knowledge.', color: 'text-amber-500', bg: 'bg-amber-50' },
              { icon: Mic, title: 'Communication Check', desc: 'Voice analysis evaluates clarity, confidence, and structure.', color: 'text-emerald-500', bg: 'bg-emerald-50' },
            ].map(({ icon: Icon, title, desc, color, bg }) => (
              <div key={title} className="p-6 rounded-2xl border border-slate-100 hover:shadow-lg transition-shadow">
                <div className={`${bg} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                  <Icon size={22} className={color} />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Why AI CareerForge?</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { icon: Clock, title: 'Under 2 Minutes', desc: 'Complete your full assessment in less than 2 minutes — no lengthy surveys.' },
              { icon: Zap, title: 'AI-Powered Insights', desc: 'Gemini AI provides deep, personalized analysis across all dimensions.' },
              { icon: CheckCircle, title: 'Actionable Plans', desc: 'Get specific improvement steps, not just scores — know exactly what to fix.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center">
                <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100">
                  <Icon size={24} className="text-blue-600" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-emerald-500 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-extrabold mb-4">Ready to Measure Your Interview Readiness?</h2>
          <p className="text-blue-100 mb-8 text-lg">Join students who discovered their gaps before the interview — not after.</p>
          <Link to="/register" className="inline-flex items-center gap-2 bg-white text-blue-600 font-bold px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors text-lg shadow-lg">
            Start Free Assessment <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
