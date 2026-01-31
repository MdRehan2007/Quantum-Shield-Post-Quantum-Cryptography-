
import React from 'react';
import { SimulationResult, ResultStatus } from '../types';

interface HistorySidebarProps {
  history: SimulationResult[];
  currentUserEmail: string | null;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({ history, currentUserEmail }) => {
  return (
    <div className="w-full lg:w-96 bg-[#0a0a0f] border-l border-slate-800 h-full flex flex-col">
      <div className="p-6 border-b border-slate-800 flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <svg className="w-5 h-5 text-[#00f3ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Lab Logs
        </h2>
        <span className="text-[10px] text-slate-500 bg-slate-900 border border-slate-800 px-3 py-1 rounded-full font-bold uppercase tracking-widest">
          {history.length} Entries
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar flex flex-col gap-4">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-600 opacity-50 px-8 text-center">
            <svg className="w-12 h-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-sm font-bold uppercase tracking-widest">Awaiting Simulation Data</p>
            <p className="text-xs mt-2 italic">Run a cryptographic stress test to populate these records.</p>
          </div>
        ) : (
          history.slice().reverse().map((item) => (
            <div 
              key={item.id}
              className={`bg-[#0f0f16] border p-4 rounded-xl group transition-all cursor-default relative overflow-hidden ${
                item.userEmail === currentUserEmail && currentUserEmail !== null 
                ? 'border-slate-800 hover:border-[#00f3ff]' 
                : 'border-slate-800/50 grayscale-[0.3]'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-[9px] mono text-slate-500 uppercase tracking-widest">
                  {new Date(item.timestamp).toLocaleTimeString()}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter border ${
                  item.status === ResultStatus.SECURE ? 'bg-emerald-950 text-emerald-400 border-emerald-900' :
                  item.status === ResultStatus.IN_DANGER ? 'bg-red-950 text-red-400 border-red-900' :
                  'bg-blue-950 text-blue-400 border-blue-900'
                }`}>
                  {item.status.split(' ')[0]}
                </span>
              </div>
              
              <div className="mb-2">
                <div className="flex items-center gap-2">
                   <span className="text-[10px] bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded border border-slate-800 uppercase font-black tracking-tighter">
                    {item.inputType}
                  </span>
                  <p className="text-xs font-black text-slate-200 truncate">{item.encryption.split('(')[0]}</p>
                </div>
                <p className="text-[10px] text-slate-500 mt-1 italic">{item.attacker.split('(')[0]}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-3">
                <div className="text-center p-1.5 bg-black/40 rounded-lg border border-slate-800/50">
                  <p className="text-[8px] text-slate-500 uppercase font-bold tracking-widest">Classical</p>
                  <p className="text-xs font-black text-[#00f3ff] mono">{item.classicalProgress}%</p>
                </div>
                <div className="text-center p-1.5 bg-black/40 rounded-lg border border-slate-800/50">
                  <p className="text-[8px] text-slate-500 uppercase font-bold tracking-widest">Quantum</p>
                  <p className="text-xs font-black text-[#00f3ff] mono">{item.quantumProgress}%</p>
                </div>
              </div>

              {/* Identity tag if logged in */}
              {item.userEmail && item.userEmail === currentUserEmail && (
                <div className="absolute top-1 right-1 opacity-20 group-hover:opacity-100 transition-opacity">
                   <svg className="w-3 h-3 text-[#00f3ff]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
                </div>
              )}

              {/* Expanded Data Tooltip on Group Hover */}
              <div className="absolute inset-0 bg-[#0f0f16] p-4 translate-y-full group-hover:translate-y-0 transition-all duration-300 overflow-y-auto custom-scrollbar border border-[#00f3ff]/30 rounded-xl shadow-2xl z-20">
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Payload Sample</p>
                <p className="text-xs text-slate-300 leading-relaxed italic mb-3 border-l-2 border-[#00f3ff]/30 pl-3">"{item.inputPreview}"</p>
                <p className="text-[10px] text-[#00f3ff] uppercase font-black tracking-widest mb-1">Verdict</p>
                <p className="text-[10px] text-slate-400 leading-tight mb-2">{item.explanation.slice(0, 100)}...</p>
                <div className="flex justify-between items-center mt-auto pt-2 border-t border-slate-800">
                   <span className="text-[9px] text-slate-500 mono">TIME: {item.timeEstimate}</span>
                   <button className="text-[9px] text-[#00f3ff] uppercase font-bold hover:underline">Re-Simulate</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistorySidebar;
