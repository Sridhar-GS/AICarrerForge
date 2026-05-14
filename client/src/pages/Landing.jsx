import { Link } from 'react-router-dom';
import { Zap, FileText, Mic, GitBranch, ArrowRight, CheckCircle, Clock, Target } from 'lucide-react';

export default function Landing() {
  return (
    <div className="w-full shrink-0" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="absolute inset-0 opacity-20"
          style={{
            background: 'radial-gradient(circle at 25% 30%, rgba(59,130,246,0.4), transparent 50%), radial-gradient(circle at 75% 70%, rgba(16,185,129,0.3), transparent 50%)'
          }} />
        <div className="relative max-w-5xl mx-auto px-6 lg:px-8 py-28 sm:py-36 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-5 py-2 rounded-full text-sm font-medium mb-8 border border-white/10">
            <Zap size={14} className="text-amber-400" />
            AI-Powered Interview Assessment
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-8">
            Know Your{' '}
            <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Interview Readiness
            </span>
            <br />
            In Under 2 Minutes
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-12 leading-relaxed">
            Stop guessing. AI CareerForge evaluates your resume, technical skills,
            communication, and portfolio to give you a clear readiness score with
            actionable improvements.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-blue-500/25 text-lg">
              Get Started Free <ArrowRight size={20} />
            </Link>
            <Link to="/login"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold px-8 py-4 rounded-xl transition-all border border-white/20">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">How It Works</h2>
            <p className="text-slate-500 max-w-xl mx-auto text-lg">
              Four dimensions of evaluation, one comprehensive score — all in under 2 minutes.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: FileText, title: 'Resume Analysis', desc: 'AI parses your PDF resume for ATS compatibility, keywords, and formatting.', color: 'text-blue-500', bg: 'bg-blue-50' },
              { icon: GitBranch, title: 'Portfolio Review', desc: 'Your GitHub repos are evaluated for quality, diversity, and relevance.', color: 'text-purple-500', bg: 'bg-purple-50' },
              { icon: Target, title: 'Technical Quiz', desc: 'Role-specific questions test your core technical knowledge instantly.', color: 'text-amber-500', bg: 'bg-amber-50' },
              { icon: Mic, title: 'Communication', desc: 'Voice analysis evaluates clarity, confidence, and sentence structure.', color: 'text-emerald-500', bg: 'bg-emerald-50' },
            ].map(({ icon: Icon, title, desc, color, bg }) => (
              <div key={title} className="p-6 rounded-2xl border border-slate-100 hover:shadow-lg hover:border-slate-200 transition-all duration-300 bg-white">
                <div className={`${bg} w-12 h-12 rounded-xl flex items-center justify-center mb-5`}>
                  <Icon size={22} className={color} />
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">Why AI CareerForge?</h2>
            <p className="text-slate-500 max-w-xl mx-auto text-lg">
              Built to give you an unfair advantage before the real interview.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-10">
            {[
              { icon: Clock, title: 'Under 2 Minutes', desc: 'Complete your full assessment in less than 2 minutes — no lengthy surveys or boring forms.' },
              { icon: Zap, title: 'AI-Powered Insights', desc: 'Gemini AI provides deep, personalized analysis across all four dimensions of readiness.' },
              { icon: CheckCircle, title: 'Actionable Plans', desc: 'Get specific improvement steps — not just numbers. Know exactly what to fix and how.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center p-6">
                <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm border border-slate-100">
                  <Icon size={26} className="text-blue-600" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-3">{title}</h3>
                <p className="text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-emerald-500 text-white text-center">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-5">
            Ready to Measure Your Interview Readiness?
          </h2>
          <p className="text-blue-100 mb-10 text-lg leading-relaxed">
            Join students who discovered their gaps before the interview — not after.
          </p>
          <Link to="/register"
            className="inline-flex items-center gap-2 bg-white text-blue-600 font-bold px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors text-lg shadow-lg">
            Start Free Assessment <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
