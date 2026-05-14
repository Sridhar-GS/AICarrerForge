import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Bot, FileText, GitBranch as Github, Mic, CheckCircle, ArrowRight, Activity, RotateCcw, Star, TrendingUp, AlertCircle } from 'lucide-react';
import { Bars } from 'react-loader-spinner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const quizBank = {
  'Software Engineer': [
    { q: 'What is the time complexity of binary search?', options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'], answer: 1 },
    { q: 'Which data structure uses FIFO ordering?', options: ['Stack', 'Queue', 'Tree', 'Graph'], answer: 1 },
    { q: 'What does REST stand for?', options: ['Remote Execution Service Transfer', 'Representational State Transfer', 'Reliable Server Technology', 'Resource Sharing Technique'], answer: 1 },
  ],
  'Frontend Developer': [
    { q: 'What is the Virtual DOM primarily used for?', options: ['Server rendering', 'Efficient UI updates', 'Database queries', 'Network requests'], answer: 1 },
    { q: 'Which CSS property creates a flex container?', options: ['display: block', 'display: flex', 'display: grid', 'display: inline'], answer: 1 },
    { q: 'What hook manages side effects in React?', options: ['useState', 'useRef', 'useEffect', 'useMemo'], answer: 2 },
  ],
  'Backend Developer': [
    { q: 'What does ACID stand for in databases?', options: ['Atomicity, Consistency, Isolation, Durability', 'Application, Control, Integration, Data', 'Async, Cache, Index, Deploy', 'Access, Create, Insert, Delete'], answer: 0 },
    { q: 'Which HTTP method is idempotent?', options: ['POST', 'PUT', 'PATCH', 'None'], answer: 1 },
    { q: 'What is an ORM used for?', options: ['UI rendering', 'Mapping objects to database tables', 'Network routing', 'Authentication'], answer: 1 },
  ],
  'AI Engineer': [
    { q: 'What activation function outputs values between 0 and 1?', options: ['ReLU', 'Sigmoid', 'Tanh', 'Linear'], answer: 1 },
    { q: 'What is overfitting?', options: ['Model performs well on all data', 'Model memorizes training data', 'Model is too simple', 'Model trains too fast'], answer: 1 },
    { q: 'Which technique reduces dimensionality?', options: ['PCA', 'Gradient Descent', 'Backpropagation', 'Dropout'], answer: 0 },
  ],
};

function ScoreRing({ score, size = 120, stroke = 8 }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 75 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444';

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#e2e8f0" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1.5s ease-in-out' }} />
    </svg>
  );
}

export default function Dashboard() {
  const [step, setStep] = useState(0);
  const [role, setRole] = useState('Software Engineer');
  const [file, setFile] = useState(null);
  const [github, setGithub] = useState('');

  const [resumeResult, setResumeResult] = useState(null);
  const [githubResult, setGithubResult] = useState(null);
  const [commResult, setCommResult] = useState(null);

  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizScore, setQuizScore] = useState(0);

  const [finalResult, setFinalResult] = useState(null);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [loadingResume, setLoadingResume] = useState(false);
  const [loadingGithub, setLoadingGithub] = useState(false);

  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const recognitionRef = useRef(null);

  const questions = quizBank[role] || quizBank['Software Engineer'];

  const startAnalysis = async () => {
    if (!file || !github) {
      alert('Please provide both Resume and GitHub username.');
      return;
    }
    setStep(1);
    setLoadingResume(true);
    setLoadingGithub(true);

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('targetRole', role);
    axios.post(`${API_URL}/api/eval/resume`, formData)
      .then(res => { setResumeResult(res.data.data); setLoadingResume(false); })
      .catch(() => { setResumeResult({ atsScore: 50 }); setLoadingResume(false); });

    axios.post(`${API_URL}/api/eval/github`, { githubUsername: github, targetRole: role })
      .then(res => { setGithubResult(res.data.data); setLoadingGithub(false); })
      .catch(() => { setGithubResult({ portfolioScore: 40 }); setLoadingGithub(false); });
  };

  const handleQuizAnswer = (qIndex, optIndex) => {
    setQuizAnswers(prev => ({ ...prev, [qIndex]: optIndex }));
  };

  const submitQuiz = () => {
    let correct = 0;
    questions.forEach((q, i) => { if (quizAnswers[i] === q.answer) correct++; });
    const score = Math.round((correct / questions.length) * 100);
    setQuizScore(score);
    setStep(2);
  };

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SR();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.onresult = (event) => {
        let t = '';
        for (let i = 0; i < event.results.length; i++) t += event.results[i][0].transcript;
        setTranscript(t);
      };
    }
  }, []);

  useEffect(() => {
    let timer;
    if (isRecording && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (isRecording && timeLeft === 0) {
      stopRecording();
    }
    return () => clearTimeout(timer);
  }, [isRecording, timeLeft]);

  const startRecording = () => {
    if (recognitionRef.current) {
      setTranscript('');
      setTimeLeft(30);
      setIsRecording(true);
      recognitionRef.current.start();
    } else {
      alert('Speech recognition not supported. Please use Chrome.');
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      submitAudio(transcript);
    }
  };

  const submitAudio = async (recordedText) => {
    setStep(3);
    const finalTranscript = recordedText || 'No transcript recorded.';
    axios.post(`${API_URL}/api/eval/communication`, { transcript: finalTranscript, metrics: { pauses: 1 } })
      .then(async res => {
        const commData = res.data.data;
        setCommResult(commData);
        setIsFinalizing(true);
        try {
          const finalRes = await axios.post(`${API_URL}/api/eval/finalize`, {
            scores: {
              resumeScore: resumeResult?.atsScore || 50,
              quizScore,
              communicationScore: commData?.communicationScore || 50,
              portfolioScore: githubResult?.portfolioScore || 40,
            },
            targetRole: role,
          });
          setFinalResult(finalRes.data.data);
        } catch { setFinalResult({ overallScore: 0, readinessLevel: 'Unknown', summary: 'Error generating results.', improvementPlan: ['Please try again.'] }); }
        setIsFinalizing(false);
      })
      .catch(() => { setIsFinalizing(false); });
  };

  const getLevelColor = (level) => {
    if (level === 'Interview Ready') return 'text-emerald-500';
    if (level === 'Intermediate') return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <div className="flex-1 text-slate-900 p-4 sm:p-8 flex justify-center items-start font-[Inter,sans-serif]">
      <div className="max-w-3xl w-full bg-white shadow-xl rounded-3xl p-6 sm:p-10 border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 border-b border-slate-200 pb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-3 tracking-tight">
            <span className="bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">Interview Readiness</span>
          </h1>
          <div className="flex gap-2">
            {[0,1,2,3].map(s => (
              <div key={s} className={`h-2 w-8 rounded-full transition-colors duration-300 ${step >= s ? 'bg-gradient-to-r from-blue-500 to-emerald-500' : 'bg-slate-200'}`} />
            ))}
          </div>
        </div>

        {/* Step 0: Profile */}
        {step === 0 && (
          <div className="space-y-8" style={{ animation: 'fadeIn 0.4s ease' }}>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Profile Configuration</h2>
              <p className="text-slate-500 mt-2 text-sm">Provide your details — the entire assessment takes under 2 minutes.</p>
            </div>
            <div className="grid gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-600">Target Role</label>
                <select value={role} onChange={e => setRole(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                  <option>Software Engineer</option>
                  <option>Frontend Developer</option>
                  <option>Backend Developer</option>
                  <option>AI Engineer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-600 flex items-center gap-2"><FileText size={16} className="text-blue-500" /> Resume (PDF)</label>
                <input type="file" accept=".pdf" onChange={e => setFile(e.target.files[0])} className="w-full bg-slate-50 border border-slate-200 text-slate-600 p-2 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:font-medium file:cursor-pointer" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-600 flex items-center gap-2"><Github size={16} className="text-purple-500" /> GitHub Username</label>
                <input type="text" placeholder="e.g. torvalds" value={github} onChange={e => setGithub(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
              </div>
            </div>
            <button onClick={startAnalysis} className="w-full bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg">
              Initiate Assessment <ArrowRight size={20} />
            </button>
          </div>
        )}

        {/* Step 1: Quiz */}
        {step === 1 && (
          <div className="space-y-6" style={{ animation: 'fadeIn 0.4s ease' }}>
            <h2 className="text-2xl font-bold text-slate-900">Technical Skill Check</h2>
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
              <Activity className="text-blue-500 animate-pulse mt-0.5 shrink-0" size={20} />
              <p className="text-sm text-blue-700 font-medium">
                {loadingResume || loadingGithub ? 'AI agents are analyzing your Resume & GitHub in the background...' : '✓ Background analysis complete!'}
              </p>
            </div>
            <p className="text-sm text-slate-500 font-medium">Quick Quiz — {role}</p>
            <div className="space-y-4">
              {questions.map((q, qi) => (
                <div key={qi} className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                  <p className="font-semibold text-slate-800 mb-3 text-sm">{qi + 1}. {q.q}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt, oi) => (
                      <button key={oi} onClick={() => handleQuizAnswer(qi, oi)}
                        className={`text-left p-3 rounded-lg border text-sm font-medium transition-all ${quizAnswers[qi] === oi ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-200 hover:border-blue-400'}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button onClick={submitQuiz} disabled={Object.keys(quizAnswers).length < questions.length}
              className="w-full bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed">
              Submit Answers
            </button>
          </div>
        )}

        {/* Step 2: Communication */}
        {step === 2 && (
          <div className="space-y-6" style={{ animation: 'fadeIn 0.4s ease' }}>
            <h2 className="text-2xl font-bold text-slate-900">Communication Evaluation</h2>
            <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50/50">
              <div className={`h-24 w-24 rounded-full flex justify-center items-center mb-6 transition-all duration-300 ${isRecording ? 'bg-red-100 text-red-500 scale-110 shadow-[0_0_30px_rgba(239,68,68,0.25)]' : 'bg-white shadow-md text-slate-400'}`}>
                <Mic size={48} className={isRecording ? 'animate-pulse' : ''} />
              </div>
              <p className="font-semibold text-center text-lg text-slate-800">"Describe a recent technical challenge you resolved."</p>
              <p className="text-xs text-slate-400 mt-2">Speak for up to 30 seconds</p>

              {isRecording ? (
                <div className="mt-6 flex flex-col items-center">
                  <span className="text-red-500 font-mono text-2xl font-bold">00:{timeLeft.toString().padStart(2, '0')}</span>
                  <p className="text-sm text-slate-500 mt-4 italic text-center max-w-sm h-12 overflow-hidden">"{transcript}"</p>
                  <button onClick={stopRecording} className="mt-6 bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-bold transition-colors">Stop Recording</button>
                </div>
              ) : (
                <button onClick={startRecording} className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-bold shadow-lg transition-colors">Start Recording</button>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Results */}
        {step === 3 && (
          <div className="space-y-6" style={{ animation: 'fadeIn 0.5s ease' }}>
            {(isFinalizing || !finalResult) ? (
              <div className="text-center py-20 flex flex-col items-center">
                <Bars height="50" width="50" color="#3b82f6" ariaLabel="bars-loading" visible={true} />
                <h2 className="text-2xl font-bold mt-8 text-slate-800">Synthesizing Results...</h2>
                <p className="text-slate-500 mt-3">AI is aggregating all findings into your personalized plan.</p>
              </div>
            ) : (
              <div>
                {/* Score Ring */}
                <div className="text-center mb-8">
                  <div className="relative inline-flex items-center justify-center mb-4">
                    <ScoreRing score={finalResult.overallScore || 0} size={160} stroke={10} />
                    <span className="absolute text-4xl font-black text-slate-900">{finalResult.overallScore || 0}</span>
                  </div>
                  <h2 className={`text-2xl font-extrabold ${getLevelColor(finalResult.readinessLevel)}`}>{finalResult.readinessLevel}</h2>
                  <p className="text-slate-600 mt-3 max-w-lg mx-auto leading-relaxed text-sm">{finalResult.summary}</p>
                </div>

                {/* Category Scores */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                  {[
                    { label: 'Resume', score: resumeResult?.atsScore || 50, icon: FileText },
                    { label: 'Quiz', score: quizScore, icon: Star },
                    { label: 'Communication', score: commResult?.communicationScore || 50, icon: Mic },
                    { label: 'Portfolio', score: githubResult?.portfolioScore || 40, icon: Github },
                  ].map(({ label, score, icon: Icon }) => (
                    <div key={label} className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                      <Icon size={18} className="mx-auto mb-2 text-slate-400" />
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">{label}</div>
                      <div className={`text-2xl font-bold ${score >= 75 ? 'text-emerald-500' : score >= 50 ? 'text-amber-500' : 'text-red-500'}`}>{score}</div>
                    </div>
                  ))}
                </div>

                {/* Improvement Plan */}
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 mb-6">
                  <h3 className="text-lg font-bold mb-4 text-slate-900 flex items-center gap-2"><TrendingUp size={20} className="text-blue-500" /> Actionable Improvement Plan</h3>
                  <ul className="space-y-3">
                    {finalResult.improvementPlan?.map((plan, i) => (
                      <li key={i} className="flex gap-3 items-start bg-white p-4 rounded-xl border border-slate-100">
                        <CheckCircle className="text-emerald-500 shrink-0 mt-0.5" size={18} />
                        <span className="text-slate-700 text-sm font-medium">{plan}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button onClick={() => window.location.reload()} className="w-full border-2 border-slate-200 text-slate-700 font-bold hover:bg-slate-50 py-4 rounded-xl transition-colors flex items-center justify-center gap-2">
                  <RotateCcw size={18} /> Start New Evaluation
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}