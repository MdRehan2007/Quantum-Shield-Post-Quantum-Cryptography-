
import React, { useEffect, useState, useRef } from 'react';
import { SimulationResult, ResultStatus } from '../types';

interface SimulationDisplayProps {
  simulation: SimulationResult | null;
  isSimulating: boolean;
  targetC: number;
  targetQ: number;
}

const ProgressBar: React.FC<{ label: string; current: number; isSimulating: boolean }> = ({ label, current, isSimulating }) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-end">
        <div className="flex flex-col">
          <span className="text-[10px] mono text-slate-500 uppercase tracking-widest leading-none mb-1">{label}</span>
          <span className={`text-xs font-bold ${isSimulating ? 'text-[#00f3ff] animate-pulse' : 'text-slate-300'}`}>
            {isSimulating ? 'ANALYZING BIT-ENTROPY...' : 'STATIC ANALYSIS'}
          </span>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black mono neon-blue-text">{Math.floor(current)}%</span>
        </div>
      </div>
      <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-[2px]">
        <div 
          className="h-full neon-blue-bg rounded-full transition-all duration-75 ease-out relative"
          style={{ width: `${current}%`, boxShadow: '0 0 15px rgba(0, 243, 255, 0.6)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite]" />
        </div>
      </div>
    </div>
  );
};

const SimulationDisplay: React.FC<SimulationDisplayProps> = ({ simulation, isSimulating, targetC, targetQ }) => {
  const [currentC, setCurrentC] = useState(0);
  const [currentQ, setCurrentQ] = useState(0);
  const animationRef = useRef<number>(null);

  useEffect(() => {
    if (isSimulating) {
      const startTime = Date.now();
      const duration = 2800;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        
        setCurrentC(easeOutQuart * targetC);
        setCurrentQ(easeOutQuart * targetQ);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        }
      };
      animationRef.current = requestAnimationFrame(animate);
    } else if (!simulation) {
      setCurrentC(0);
      setCurrentQ(0);
    } else {
      setCurrentC(targetC);
      setCurrentQ(targetQ);
    }
    return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); };
  }, [isSimulating, targetC, targetQ, simulation]);

  if (!simulation && !isSimulating) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-12 text-center bg-[#0a0a0f] rounded-3xl border border-slate-800 shadow-inner group">
        <div className="w-20 h-20 mb-8 rounded-full bg-slate-900/50 flex items-center justify-center border border-slate-800 group-hover:border-[#00f3ff]/30 transition-all duration-500">
          <span className="text-4xl group-hover:scale-110 transition-transform">⚡</span>
        </div>
        <h3 className="text-2xl font-bold mb-3 text-slate-300">Awaiting Lab Parameters</h3>
        <p className="text-slate-500 max-w-sm leading-relaxed">
          Configure encryption and attacker profile to initialize theoretical security stress test.
        </p>
      </div>
    );
  }

  const showResults = !isSimulating && simulation;

  return (
    <div className="h-full flex flex-col bg-[#0a0a0f] rounded-3xl border border-slate-800 p-8 lg:p-10 shadow-2xl relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#00f3ff 1px, transparent 0)', backgroundSize: '30px 30px' }} />

      <div className="mb-10 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <div className={`w-3 h-3 rounded-full ${isSimulating ? 'bg-[#00f3ff] animate-ping' : 'bg-[#00f3ff]/20'}`} />
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-white uppercase italic">Security Matrix Output</h3>
            <p className="text-slate-500 text-xs mono tracking-wider uppercase">Status: {isSimulating ? 'SIMULATING ATTACK' : 'VERDICT RENDERED'}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] mono text-slate-500 uppercase tracking-widest mb-1">Estimated Time to Break</p>
          <p className="text-xl font-black text-[#00f3ff] mono tracking-tighter">
            {isSimulating ? "---" : simulation?.timeEstimate}
          </p>
        </div>
      </div>

      <div className="space-y-12 flex-1 relative z-10">
        <ProgressBar label="Classical Compute Stress" current={currentC} isSimulating={isSimulating} />
        <ProgressBar label="Quantum Algorithm Efficiency" current={currentQ} isSimulating={isSimulating} />
      </div>

      <div className={`mt-10 relative z-10 transition-all duration-1000 transform ${showResults ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        {showResults && (
          <div className={`p-[1px] rounded-2xl bg-gradient-to-br ${simulation.status === ResultStatus.SECURE ? 'from-emerald-500/50 to-transparent' : 'from-red-500/50 to-transparent'}`}>
            <div className="bg-[#0f0f18]/95 backdrop-blur-xl p-8 rounded-[15px]">
              <div className="flex items-center gap-4 mb-6">
                <div className={`p-4 rounded-xl ${simulation.status === ResultStatus.SECURE ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                  {simulation.status === ResultStatus.SECURE ? '🛡️' : '⚠️'}
                </div>
                <div>
                  <h4 className={`text-2xl font-black uppercase tracking-tight ${simulation.status === ResultStatus.SECURE ? 'text-emerald-400' : 'text-red-400'}`}>
                    {simulation.status.split(' (')[0]}
                  </h4>
                  <p className="text-[10px] mono text-slate-500 uppercase tracking-[0.2em]">Validated Diagnostic Result</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <p className="text-slate-300 text-sm leading-relaxed border-l border-slate-800 pl-4">{simulation.explanation}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-800/50">
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Attacker Assumptions</p>
                    <p className="text-xs text-slate-400 italic">"{simulation.assumptions}"</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Protocol Impact</p>
                    <p className="text-xs text-slate-200 font-bold">{simulation.impact}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimulationDisplay;
