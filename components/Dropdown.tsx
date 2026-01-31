import React, { useState, useRef, useEffect } from 'react';

interface Option {
  value: string;
  icon: string;
}

interface DropdownProps {
  label: string;
  options: Option[];
  value: string;
  onChange: (val: any) => void;
  stepNumber: number;
  hideStep?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({ label, options, value, onChange, stepNumber, hideStep }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="flex flex-col gap-3 relative" ref={dropdownRef}>
      {!hideStep && (
        <div className="flex items-center gap-2">
          <span className="bg-[#1a1a2e] w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border border-slate-700">
            {stepNumber}
          </span>
          <h3 className="text-xl font-semibold">{label}</h3>
        </div>
      )}
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-[#0a0a0f] border border-slate-800 p-3 rounded-xl flex items-center justify-between hover:border-[#00f3ff] transition-all group"
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">{selectedOption?.icon}</span>
          <span className="text-sm font-bold text-slate-200">{value}</span>
        </div>
        <svg 
          className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} text-slate-500 group-hover:text-[#00f3ff]`} 
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#0a0a0f] border border-slate-800 rounded-xl overflow-hidden z-50 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={`w-full p-3 flex items-center justify-between hover:bg-[#1a1a2e] transition-colors ${opt.value === value ? 'bg-[#1a1a2e]' : ''}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{opt.icon}</span>
                <span className="text-xs font-bold text-slate-300">{opt.value}</span>
              </div>
              {opt.value === value && (
                <svg className="w-4 h-4 text-[#00f3ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;