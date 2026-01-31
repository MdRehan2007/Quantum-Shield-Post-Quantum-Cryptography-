import React, { useState, useEffect } from 'react';
import { EncryptionType, AttackerType, SimulationResult, ResultStatus, User, InputDataType } from './types';
import { ENCRYPTION_OPTIONS, ATTACKER_OPTIONS, GET_RESULT_LOGIC } from './constants';
import Dropdown from './components/Dropdown';
import SimulationDisplay from './components/SimulationDisplay';

const App: React.FC = () => {
  const [view, setView] = useState<'simulator' | 'history'>('simulator');
  const [activeInputType, setActiveInputType] = useState<InputDataType>('Text');
  const [inputText, setInputText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [encryption, setEncryption] = useState<EncryptionType>(EncryptionType.RSA);
  const [attacker, setAttacker] = useState<AttackerType>(AttackerType.CLASSICAL);
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentSimulation, setCurrentSimulation] = useState<SimulationResult | null>(null);
  const [targets, setTargets] = useState({ c: 0, q: 0 });
  const [history, setHistory] = useState<SimulationResult[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('simulation_history');
    if (saved) setHistory(JSON.parse(saved));
    const savedUser = localStorage.getItem('user_profile');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  useEffect(() => {
    localStorage.setItem('simulation_history', JSON.stringify(history));
  }, [history]);

  const handleSimulate = () => {
    if (activeInputType === 'Text' && !inputText) return alert("Please enter sensitive text data.");
    if (activeInputType !== 'Text' && !selectedFile) return alert(`Please select a ${activeInputType} file.`);

    setIsSimulating(true);
    setCurrentSimulation(null);
    const resultData = GET_RESULT_LOGIC(encryption, attacker);
    setTargets({ c: resultData.classicalProgress, q: resultData.quantumProgress });

    setTimeout(() => {
      const newSim: SimulationResult = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        userEmail: user ? user.email : null,
        inputType: activeInputType,
        inputPreview: activeInputType === 'Text' 
          ? inputText.slice(0, 50) + (inputText.length > 50 ? '...' : '') 
          : selectedFile?.name || `${activeInputType} Payload`,
        encryption,
        attacker,
        classicalProgress: resultData.classicalProgress,
        quantumProgress: resultData.quantumProgress,
        timeEstimate: resultData.timeToBreak,
        status: resultData.status,
        explanation: resultData.explanation,
        assumptions: resultData.assumptions,
        impact: resultData.impact
      };
      
      setCurrentSimulation(newSim);
      setHistory(prev => [...prev, newSim]);
      setIsSimulating(false);
      const visElement = document.getElementById('attack-visualization');
      if (visElement) visElement.scrollIntoView({ behavior: 'smooth' });
    }, 3000);
  };

  const handleMockLogin = (provider: 'google' | 'apple') => {
    const mockUser: User = {
      name: provider === 'google' ? 'Alex Rivera' : 'Sarah Connor',
      email: provider === 'google' ? 'alex.riv@gmail.com' : 'sarah.c@icloud.com',
      provider,
      lastLogin: Date.now()
    };
    setUser(mockUser);
    localStorage.setItem('user_profile', JSON.stringify(mockUser));
    setIsLoginModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user_profile');
  };

  const displayHistory = user 
    ? history.filter(h => h.userEmail === user.email)
    : history.filter(h => h.userEmail === null);

  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 flex flex-col selection:bg-[#00f3ff]/30 selection:text-[#00f3ff]">
      {/* Top Header */}
      <nav className="bg-[#050507] border-b border-slate-900 px-6 py-4 flex items-center justify-between z-[60]">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-[#00f3ff] to-blue-600 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(0,243,255,0.3)]">
            <svg className="w-6 h-6 text-[#050507]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#00f3ff] leading-none uppercase">Quantum Security Simulator</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Explore Cryptographic Vulnerabilities</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-[10px] text-slate-400 uppercase font-bold">Authenticated</p>
                <p className="text-[11px] mono text-slate-500">{user.email.split('@')[0]}...</p>
              </div>
              <button 
                onClick={logout} 
                className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-900 hover:border-red-500/50 transition-all"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setIsLoginModalOpen(true)} 
              className="bg-[#00f3ff] text-[#050507] px-5 py-2 rounded-lg text-sm font-bold hover:bg-cyan-400 transition-all shadow-lg shadow-[#00f3ff]/20"
            >
              Access Simulator
            </button>
          )}
        </div>
      </nav>

      {/* Main Viewport */}
      <main className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
        {/* Hero Section */}
        <section className="hero-gradient min-h-[450px] flex flex-col items-center justify-center text-center px-6 py-20">
          <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-700/50 mb-8 backdrop-blur-sm">
             <div className="w-12 h-12 bg-emerald-500/20 rounded border border-emerald-500/30 flex items-center justify-center">
               <span className="text-2xl">🛡️</span>
             </div>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
            Quantum Security Risk Simulator
          </h2>
          <p className="max-w-2xl text-slate-400 text-lg md:text-xl leading-relaxed">
            Explore how quantum computing impacts cryptographic security through interactive simulations. 
            Understand the difference between classical and quantum attacks on various encryption methods.
          </p>

          {/* Central Toggle Pill */}
          <div className="mt-12 flex bg-black/40 backdrop-blur-md border border-slate-800 p-1 rounded-xl shadow-2xl">
            <button 
              onClick={() => setView('simulator')}
              className={`flex items-center gap-3 px-8 py-3 rounded-lg text-sm font-bold transition-all ${view === 'simulator' ? 'nav-pill-active text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <span>🔬</span> Simulator
            </button>
            <button 
              onClick={() => setView('history')}
              className={`flex items-center gap-3 px-8 py-3 rounded-lg text-sm font-bold transition-all ${view === 'history' ? 'nav-pill-active text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <span>📜</span> History
            </button>
          </div>
        </section>

        {/* Content Area */}
        <div className="max-w-6xl w-full mx-auto px-6 py-12">
          {view === 'simulator' ? (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="bg-[#0a0a14] border border-slate-800/60 rounded-[2rem] p-8 lg:p-12 space-y-10 shadow-2xl">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-[#00f3ff] text-2xl">🛡️</span>
                    <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-white uppercase">Configure Simulation</h2>
                  </div>
                  <p className="text-slate-400 text-sm lg:text-base max-w-2xl">
                    Select your data type, encryption method, and attacker capability to simulate cryptographic attacks
                  </p>
                </div>

                <div className="space-y-8">
                  {/* Step 1: Select Input Type */}
                  <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 bg-[#1a1a2e] text-[#00f3ff] rounded-full flex items-center justify-center text-sm font-bold border border-slate-700">1</span>
                      <h3 className="text-xl font-bold text-slate-200">Select Input Type</h3>
                    </div>

                    <div className="bg-[#0a0a0f] p-1.5 rounded-2xl flex gap-1 border border-slate-800 w-fit">
                      {(['Text', 'Image', 'File', 'Video', 'Audio'] as InputDataType[]).map((type) => {
                        const icons: Record<string, string> = {
                          'Text': '📄', 'Image': '🖼️', 'File': '📁', 'Video': '🎥', 'Audio': '🎵'
                        };
                        return (
                          <button 
                            key={type}
                            onClick={() => { setActiveInputType(type); setSelectedFile(null); }}
                            className={`flex items-center gap-3 px-6 py-3 rounded-xl font-bold transition-all border ${
                              activeInputType === type 
                              ? 'bg-[#0f172a] border-[#00f3ff]/40 text-white shadow-xl' 
                              : 'bg-transparent border-transparent text-slate-500 hover:text-slate-300'
                            }`}
                          >
                            <span className="text-base">{icons[type]}</span>
                            <span className="text-sm">{type}</span>
                          </button>
                        )
                      })}
                    </div>

                    <div className="relative">
                      {activeInputType === 'Text' ? (
                        <textarea
                          value={inputText}
                          onChange={(e) => setInputText(e.target.value)}
                          placeholder="Enter sensitive data (e.g., Transfer ₹50,000 to Account 1234, API Key: sk_live_abc123...)"
                          className="w-full h-44 bg-black/30 border border-slate-800 rounded-2xl p-6 text-slate-300 placeholder-slate-600 focus:border-[#00f3ff] outline-none transition-all resize-none mono text-sm shadow-inner"
                        />
                      ) : (
                        <div className="w-full h-56 border-2 border-dashed border-slate-800/50 rounded-2xl flex flex-col items-center justify-center bg-black/40 group relative overflow-hidden p-8 transition-all hover:border-[#00f3ff]/40 hover:bg-black/60 shadow-inner">
                          <input type="file" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                          
                          <div className="flex flex-col items-center gap-4 transition-transform group-hover:scale-105 duration-300">
                            <div className="w-16 h-16 rounded-full bg-[#00f3ff]/10 flex items-center justify-center border border-[#00f3ff]/20 shadow-[0_0_20px_rgba(0,243,255,0.1)] group-hover:shadow-[0_0_30px_rgba(0,243,255,0.2)]">
                              <svg className="w-8 h-8 text-[#00f3ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                              </svg>
                            </div>
                            
                            <div className="text-center">
                              <p className="text-slate-200 font-bold uppercase tracking-widest text-xs">
                                {selectedFile ? "File Selected" : `Upload ${activeInputType} Payload`}
                              </p>
                              <p className="text-[#00f3ff]/60 text-[10px] mt-1 mono truncate max-w-[280px]">
                                {selectedFile ? selectedFile.name : "Drag & drop or click to browse"}
                              </p>
                            </div>

                            {!selectedFile && (
                              <div className="mt-2 bg-[#00f3ff] text-[#050507] px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#00f3ff]/20 transition-all hover:bg-cyan-400">
                                Select File
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Step 2 & 3: Dropdowns (Stacked vertically as requested) */}
                  <div className="flex flex-col gap-8">
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 bg-[#1a1a2e] text-[#00f3ff] rounded-full flex items-center justify-center text-sm font-bold border border-slate-700 shadow-md">2</span>
                        <h3 className="text-xl font-bold text-slate-200 uppercase tracking-tight">Encryption Method</h3>
                      </div>
                      <Dropdown label="" options={ENCRYPTION_OPTIONS} value={encryption} onChange={setEncryption} stepNumber={0} hideStep />
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 bg-[#1a1a2e] text-[#00f3ff] rounded-full flex items-center justify-center text-sm font-bold border border-slate-700 shadow-md">3</span>
                        <h3 className="text-xl font-bold text-slate-200 uppercase tracking-tight">Attacker Capabilities</h3>
                      </div>
                      <Dropdown label="" options={ATTACKER_OPTIONS} value={attacker} onChange={setAttacker} stepNumber={0} hideStep />
                    </div>
                  </div>
                </div>

                <button
                  disabled={isSimulating}
                  onClick={handleSimulate}
                  className={`w-full py-6 rounded-2xl font-black text-xl uppercase tracking-widest transition-all ${
                    isSimulating ? 'bg-slate-900 text-slate-700' : 'bg-[#00f3ff] text-[#050507] hover:scale-[1.01] active:scale-[0.98] shadow-xl shadow-[#00f3ff]/20'
                  }`}
                >
                  {isSimulating ? "Processing Simulation..." : "Encrypt & Simulate Attack"}
                </button>
              </div>

              <section id="attack-visualization" className="min-h-[600px] scroll-mt-24">
                <SimulationDisplay simulation={currentSimulation} isSimulating={isSimulating} targetC={targets.c} targetQ={targets.q} />
              </section>
            </div>
          ) : (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-black italic uppercase text-white tracking-tighter">Cryptographic Archive</h2>
                  <p className="text-slate-500 text-sm mt-1">Audit log of theoretical threat assessments.</p>
                </div>
                {user && (
                   <div className="bg-[#00f3ff]/10 border border-[#00f3ff]/20 px-4 py-2 rounded-xl">
                      <p className="text-[10px] text-[#00f3ff] uppercase font-black tracking-widest">Active User</p>
                      <p className="text-sm font-bold text-slate-200">{user.email}</p>
                   </div>
                )}
              </div>
              
              <div className="grid gap-6">
                {displayHistory.length === 0 ? (
                  <div className="bg-[#0a0a0f]/50 border border-slate-800 rounded-[2rem] p-24 flex flex-col items-center justify-center text-center">
                    <span className="text-6xl mb-6 opacity-10">📭</span>
                    <h3 className="text-2xl font-bold text-slate-500">Archive Empty</h3>
                    <p className="text-slate-600 max-w-xs mt-3 leading-relaxed">
                      Initialize simulations in the laboratory to generate persistent threat intelligence data.
                    </p>
                  </div>
                ) : (
                  displayHistory.slice().reverse().map((item) => (
                    <div key={item.id} className="bg-[#0a0a0f]/80 backdrop-blur-sm border border-slate-800/60 rounded-[2rem] p-8 flex flex-col md:flex-row gap-8 hover:border-[#00f3ff]/30 transition-all group">
                      <div className="flex-1 space-y-6">
                        <div className="flex items-center gap-4">
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-lg ${
                            item.status === ResultStatus.SECURE ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30' : 'bg-red-950/40 text-red-400 border-red-500/30'
                          }`}>
                            {item.status.split(' (')[0]}
                          </span>
                          <span className="text-[11px] text-slate-500 mono bg-black/40 px-3 py-1 rounded-lg border border-slate-800">{new Date(item.timestamp).toLocaleString()}</span>
                        </div>
                        <div>
                          <h4 className="text-2xl font-bold text-white group-hover:text-[#00f3ff] transition-colors">{item.encryption}</h4>
                          <p className="text-xs text-[#00f3ff]/60 mono uppercase tracking-widest mt-2">Threat Profile: {item.attacker}</p>
                        </div>
                        <div className="p-5 bg-black/30 rounded-2xl border border-slate-800/50">
                          <p className="text-[10px] text-slate-500 uppercase font-black mb-2 tracking-widest">Payload Data ({item.inputType})</p>
                          <p className="text-sm text-slate-300 italic font-medium leading-relaxed">"{item.inputPreview}"</p>
                        </div>
                      </div>
                      <div className="w-full md:w-72 space-y-6 md:border-l border-slate-800/60 md:pl-8 flex flex-col justify-center">
                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-1">
                            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Classical</p>
                            <p className="text-2xl font-black text-[#00f3ff] mono">{item.classicalProgress}%</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Quantum</p>
                            <p className="text-2xl font-black text-[#00f3ff] mono">{item.quantumProgress}%</p>
                          </div>
                        </div>
                        <div className="space-y-1">
                           <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Time Estimate</p>
                           <p className="text-sm font-bold text-slate-200 mono">{item.timeEstimate}</p>
                        </div>
                        <button 
                          onClick={() => { setCurrentSimulation(item); setTargets({ c: item.classicalProgress, q: item.quantumProgress }); setView('simulator'); }}
                          className="w-full py-4 bg-[#00f3ff]/10 border border-[#00f3ff]/30 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#00f3ff] hover:bg-[#00f3ff]/20 transition-all shadow-lg"
                        >
                          Review Verdict
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-[100] bg-[#050507]/95 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-[#0a0a14] border border-slate-800 rounded-[3rem] p-12 max-w-md w-full shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#00f3ff] to-transparent opacity-50" />
            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-[#00f3ff] rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-2xl shadow-[#00f3ff]/20">
                 <span className="text-4xl">🔐</span>
              </div>
              <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Laboratory Access</h2>
              <p className="text-slate-500 mt-2 text-sm leading-relaxed">Sign in to sync your cryptographic threat models and simulation history.</p>
            </div>
            <div className="space-y-4">
              <button onClick={() => handleMockLogin('google')} className="w-full py-5 bg-white text-slate-950 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-4 hover:bg-slate-200 transition-all transform hover:scale-[1.02] active:scale-95">
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="" className="w-5 h-5" />
                Auth via Google Cloud
              </button>
              <button onClick={() => handleMockLogin('apple')} className="w-full py-5 bg-black border border-slate-800 text-white rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-4 hover:border-slate-700 transition-all transform hover:scale-[1.02] active:scale-95">
                <span className="text-2xl leading-none"></span> Auth via Apple Secure
              </button>
            </div>
            <div className="mt-12 text-center">
              <button onClick={() => setIsLoginModalOpen(false)} className="text-[10px] uppercase font-black tracking-[0.3em] text-slate-600 hover:text-[#00f3ff] transition-colors">Discard Access Attempt</button>
            </div>
          </div>
        </div>
      )}

      {/* Footer / Status Bar */}
      <footer className="border-t border-slate-900 bg-[#050507] px-6 py-3 flex items-center justify-between z-50">
        <div className="flex items-center gap-8">
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Protocol Node: Online</span>
           </div>
           <span className="hidden md:block text-[9px] text-slate-800 mono tracking-widest uppercase">QS-RES-LABS // SEC-LEVEL-4</span>
        </div>
        <div className="text-[9px] text-slate-700 mono font-bold italic">© 2024 QUANTUMSHIELD RESEARCH UNIT</div>
      </footer>
    </div>
  );
};

export default App;