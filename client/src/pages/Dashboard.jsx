import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FileText, GitBranch as Github, Mic, CheckCircle, ArrowRight, Activity, RotateCcw, Star, TrendingUp } from 'lucide-react';
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

function ScoreRing({ score, size = 140, stroke = 10 }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 75 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444';

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#f1f5f9" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={stroke}
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
        } catch {
          setFinalResult({
            overallScore: 0, readinessLevel: 'Unknown',
            summary: 'Error generating results.', improvementPlan: ['Please try again.']
          });
        }
        setIsFinalizing(false);
      })
      .catch(() => { setIsFinalizing(false); });
  };

  const getLevelColor = (level) => {
    if (level === 'Interview Ready') return 'text-emerald-600';
    if (level === 'Intermediate') return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div className="flex-1 text-slate-900 px-4 sm:px-6 py-10 sm:py-14 flex justify-center items-start"
      style={{ fontFamily: "'Inter', sans-serif" }}>

      <div className="max-w-2xl w-full bg-white shadow-lg rounded-2xl border border-slate-200 overflow-hidden">

        {/* Card Header */}
        <div className="px-8 sm:px-10 pt-8 pb-6 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              <span className="bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
                Interview Readiness
              </span>
            </h1>
            <div className="flex gap-1.5 shrink-0">
              {[0, 1, 2, 3].map(s => (
                <div key={s}
                  className={`h-2 w-8 shrink-0 rounded-full transition-colors duration-300 ${step >= s ? 'bg-gradient-to-r from-blue-500 to-emerald-500' : 'bg-slate-200'}`} />
              ))}
            </div>
          </div>
          <p className="text-sm text-slate-400 mt-2">
            {step === 0 && 'Step 1 of 4 — Profile Setup'}
            {step === 1 && 'Step 2 of 4 — Technical Quiz'}
            {step === 2 && 'Step 3 of 4 — Communication'}
            {step === 3 && 'Step 4 of 4 — Results'}
          </p>
        </div>

        {/* Card Body */}
        <div className="px-8 sm:px-10 py-8">

          {/* Step 0: Profile */}
          {step === 0 && (
            <div className="space-y-7" style={{ animation: 'fadeIn 0.4s ease' }}>
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-1">Profile Configuration</h2>
                <p className="text-slate-500 text-sm">The entire assessment takes under 2 minutes.</p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Target Role</label>
                  <select value={role} onChange={e => setRole(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-auto">
                    <option>Software Engineer</option>
                    <option>Frontend Developer</option>
                    <option>Backend Developer</option>
                    <option>AI Engineer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                    <FileText size={15} className="text-blue-500" /> Resume (PDF)
                  </label>
                  <input type="file" accept=".pdf" onChange={e => setFile(e.target.files[0])}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-600 px-3 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:font-medium file:cursor-pointer file:text-sm" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                    <Github size={15} className="text-purple-500" /> GitHub Username
                  </label>
                  <input type="text" placeholder="e.g. torvalds" value={github}
                    onChange={e => setGithub(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                </div>
              </div>

              <button onClick={startAnalysis}
                className="w-full bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-md mt-2">
                Initiate Assessment <ArrowRight size={18} />
              </button>
            </div>
          )}

          {/* Step 1: Quiz */}
          {step === 1 && (
            <div className="space-y-6" style={{ animation: 'fadeIn 0.4s ease' }}>
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-1">Technical Skill Check</h2>
                <p className="text-sm text-slate-500">Role: {role}</p>
              </div>

              <div className="bg-blue-50 px-4 py-3.5 rounded-xl border border-blue-100 flex items-center gap-3">
                <Activity className="text-blue-500 animate-pulse shrink-0" size={18} />
                <p className="text-sm text-blue-700 font-medium">
                  {loadingResume || loadingGithub
                    ? 'AI agents analyzing your Resume & GitHub...'
                    : '✓ Background analysis complete!'}
                </p>
              </div>

              <div className="space-y-5">
                {questions.map((q, qi) => (
                  <div key={qi} className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                    <p className="font-semibold text-slate-800 mb-4 text-sm leading-relaxed">
                      {qi + 1}. {q.q}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {q.options.map((opt, oi) => (
                        <button key={oi} onClick={() => handleQuizAnswer(qi, oi)}
                          className={`text-left px-4 py-3 rounded-lg border text-sm font-medium transition-all ${quizAnswers[qi] === oi
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-blue-400'
                            }`}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={submitQuiz}
                disabled={Object.keys(quizAnswers).length < questions.length}
                className="w-full bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600 text-white font-bold py-3.5 rounded-xl shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed mt-2">
                Submit Answers
              </button>
            </div>
          )}

          {/* Step 2: Communication */}
          {step === 2 && (
            <div className="space-y-6" style={{ animation: 'fadeIn 0.4s ease' }}>
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-1">Communication Evaluation</h2>
                <p className="text-sm text-slate-500">Answer the prompt by speaking for up to 30 seconds.</p>
              </div>

              <div className="flex flex-col items-center justify-center py-10 px-6 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                <div className={`h-20 w-20 rounded-full flex justify-center items-center mb-6 transition-all duration-300 ${isRecording
                  ? 'bg-red-100 text-red-500 scale-110 shadow-[0_0_30px_rgba(239,68,68,0.2)]'
                  : 'bg-white shadow-md text-slate-400 border border-slate-100'
                  }`}>
                  <Mic size={40} className={isRecording ? 'animate-pulse' : ''} />
                </div>

                <p className="font-semibold text-center text-base text-slate-800 mb-1 max-w-sm leading-relaxed">
                  "Describe a recent technical challenge you resolved."
                </p>
                <p className="text-xs text-slate-400 mb-6">Speak naturally — up to 30 seconds</p>

                {isRecording ? (
                  <div className="flex flex-col items-center gap-4">
                    <span className="text-red-500 font-mono text-2xl font-bold">
                      00:{timeLeft.toString().padStart(2, '0')}
                    </span>
                    <p className="text-sm text-slate-500 italic text-center max-w-xs h-10 overflow-hidden">
                      "{transcript}"
                    </p>
                    <button onClick={stopRecording}
                      className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-bold transition-colors">
                      Stop Recording
                    </button>
                  </div>
                ) : (
                  <button onClick={startRecording}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-bold shadow-md transition-colors">
                    Start Recording
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Results */}
          {step === 3 && (
            <div style={{ animation: 'fadeIn 0.5s ease' }}>
              {(isFinalizing || !finalResult) ? (
                <div className="text-center py-16 flex flex-col items-center">
                  <Bars height="50" width="50" color="#3b82f6" ariaLabel="bars-loading" visible={true} />
                  <h2 className="text-xl font-bold mt-6 text-slate-800">Synthesizing Results...</h2>
                  <p className="text-slate-500 mt-2 text-sm">AI is generating your personalized plan.</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Score Ring */}
                  <div className="text-center">
                    <div className="relative inline-flex items-center justify-center mb-4">
                      <ScoreRing score={finalResult.overallScore || 0} />
                      <span className="absolute text-4xl font-black text-slate-900">
                        {finalResult.overallScore || 0}
                      </span>
                    </div>
                    <h2 className={`text-2xl font-extrabold mb-2 ${getLevelColor(finalResult.readinessLevel)}`}>
                      {finalResult.readinessLevel}
                    </h2>
                    <p className="text-slate-500 max-w-md mx-auto leading-relaxed text-sm">
                      {finalResult.summary}
                    </p>
                  </div>

                  {/* Category Scores */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { label: 'Resume', score: resumeResult?.atsScore || 50, icon: FileText },
                      { label: 'Quiz', score: quizScore, icon: Star },
                      { label: 'Communication', score: commResult?.communicationScore || 50, icon: Mic },
                      { label: 'Portfolio', score: githubResult?.portfolioScore || 40, icon: Github },
                    ].map(({ label, score, icon: Icon }) => (
                      <div key={label} className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center flex flex-col items-center justify-center overflow-hidden">
                        <Icon size={16} className="mb-2 text-slate-400 shrink-0" />
                        <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 w-full truncate" title={label}>{label}</div>
                        <div className={`text-xl font-bold ${score >= 75 ? 'text-emerald-600' : score >= 50 ? 'text-amber-600' : 'text-red-500'}`}>
                          {score}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Improvement Plan */}
                  <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                    <h3 className="text-base font-bold mb-4 text-slate-900 flex items-center gap-2">
                      <TrendingUp size={18} className="text-blue-500" />
                      Actionable Improvement Plan
                    </h3>
                    <ul className="space-y-3">
                      {finalResult.improvementPlan?.map((plan, i) => (
                        <li key={i} className="flex gap-3 items-start bg-white p-4 rounded-lg border border-slate-100">
                          <CheckCircle className="text-emerald-500 shrink-0 mt-0.5" size={16} />
                          <span className="text-slate-600 text-sm leading-relaxed">{plan}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button onClick={() => window.location.reload()}
                    className="w-full border-2 border-slate-200 text-slate-600 font-bold hover:bg-slate-50 hover:text-slate-800 py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2">
                    <RotateCcw size={16} /> Start New Evaluation
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}