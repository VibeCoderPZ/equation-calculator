import React, { useState, useEffect } from 'react';
import { ChevronDown, Check, Copy, ClipboardPaste, CheckCircle2 } from 'lucide-react';
import { evaluate } from 'mathjs';
import { useAppStore } from '../store';

export default function EquationCalculator() {
  const {
    equations,
    activeEquationId,
    inputValue,
    setActiveEquation,
    setInputValue,
    appendInput,
    deleteInput,
    clearInput,
    toggleSign,
  } = useAppStore();

  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(false);

  const activeEquation = equations.find((eq) => eq.id === activeEquationId);

  useEffect(() => {
    if (!activeEquation || inputValue === '') {
      setResult(null);
      setError(null);
      return;
    }

    try {
      const numValue = parseFloat(inputValue);
      if (isNaN(numValue)) {
        setResult(null);
        setError(null);
        return;
      }

      const res = evaluate(activeEquation.expression, { x: numValue });
      const formattedRes = typeof res === 'number' ? Number(res.toFixed(6)).toString() : res.toString();
      setResult(formattedRes);
      setError(null);
    } catch (err) {
      setResult(null);
      setError('Invalid Equation');
    }
  }, [inputValue, activeEquation]);

  const handleNumberClick = (num: string) => {
    appendInput(num);
  };

  const handleActionClick = (action: string) => {
    switch (action) {
      case 'C':
        clearInput();
        break;
      case 'DEL':
        deleteInput();
        break;
      case '+/-':
        toggleSign();
        break;
      default:
        break;
    }
  };

  const handleCopy = async () => {
    if (result !== null) {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const num = parseFloat(text);
      if (!isNaN(num)) {
        setInputValue(num.toString());
      }
    } catch (err) {
      console.error('Failed to paste', err);
    }
  };

  const padButtons = [
    ['C', '+/-', 'DEL'],
    ['7', '8', '9'],
    ['4', '5', '6'],
    ['1', '2', '3'],
    ['0', '.', ''],
  ];

  return (
    <div className="flex flex-col h-full bg-gray-100 dark:bg-gray-900 transition-colors duration-200 min-h-0">
      {/* Display Area */}
      <div className="flex-1 flex flex-col p-3 sm:p-4 space-y-3 sm:space-y-4 min-h-0">
        {/* Equation Selector */}
        <div className="relative shrink-0">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-full flex items-center justify-between p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
          >
            <div className="flex flex-col items-start">
              <span className="text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                Active Equation
              </span>
              <span className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate max-w-[200px] sm:max-w-[250px]">
                {activeEquation ? activeEquation.name : 'Select an equation'}
              </span>
              <span className="text-xs sm:text-sm text-indigo-600 dark:text-indigo-400 font-mono mt-1">
                f(x) = {activeEquation ? activeEquation.expression : '...'}
              </span>
            </div>
            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown */}
          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-20 max-h-60 overflow-y-auto">
              {equations.length === 0 ? (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">No equations found.</div>
              ) : (
                equations.map((eq) => (
                  <button
                    key={eq.id}
                    onClick={() => {
                      setActiveEquation(eq.id);
                      setShowDropdown(false);
                    }}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-0 transition-colors"
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-medium text-gray-900 dark:text-white">{eq.name}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-1">{eq.expression}</span>
                    </div>
                    {activeEquationId === eq.id && <Check className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Input & Result Display */}
        <div className="flex-1 flex flex-col justify-end items-end p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700 relative min-h-0">
          
          {/* Paste Button */}
          <button 
            onClick={handlePaste}
            className="absolute top-3 left-3 sm:top-4 sm:left-4 p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            title="Paste input"
          >
            <ClipboardPaste className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Copy Button */}
          <button 
            onClick={handleCopy}
            disabled={result === null}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Copy result"
          >
            {copied ? <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" /> : <Copy className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>

          <div className="w-full flex justify-between items-end mb-2 sm:mb-4 mt-8">
            <span className="text-xl sm:text-2xl font-mono text-gray-400 dark:text-gray-500">x =</span>
            <span className={`text-3xl sm:text-4xl font-mono tracking-tight truncate ml-4 ${inputValue ? 'text-gray-900 dark:text-white' : 'text-gray-300 dark:text-gray-600'}`}>
              {inputValue || '0'}
            </span>
          </div>
          
          <div className="w-full h-px bg-gray-100 dark:bg-gray-700 my-2 shrink-0"></div>
          
          <div className="w-full flex justify-between items-end mt-2 sm:mt-4">
            <span className="text-xl sm:text-2xl font-mono text-indigo-500 dark:text-indigo-400">f(x) =</span>
            <div className="flex flex-col items-end overflow-hidden ml-4">
              {error ? (
                <span className="text-lg sm:text-xl text-red-500 font-medium truncate">{error}</span>
              ) : (
                <span className={`text-4xl sm:text-5xl font-bold font-mono tracking-tighter truncate ${result ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-300 dark:text-gray-600'}`}>
                  {result !== null ? result : '0'}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Number Pad */}
      <div className="p-3 sm:p-4 pb-[max(env(safe-area-inset-bottom),1rem)] sm:pb-8 bg-gray-50 dark:bg-gray-800/50 rounded-t-3xl border-t border-gray-200 dark:border-gray-700 shrink-0">
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {padButtons.map((row, rowIndex) => (
            <React.Fragment key={rowIndex}>
              {row.map((btn, colIndex) => {
                if (btn === '') return <div key={`empty-${rowIndex}-${colIndex}`} />;
                
                const isAction = ['C', '+/-', 'DEL'].includes(btn);
                
                return (
                  <button
                    key={btn}
                    onClick={() => isAction ? handleActionClick(btn) : handleNumberClick(btn)}
                    className={`
                      h-12 sm:h-16 rounded-xl sm:rounded-2xl text-xl sm:text-2xl font-medium flex items-center justify-center transition-all active:scale-95
                      ${isAction 
                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600' 
                        : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}
                    `}
                  >
                    {btn}
                  </button>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
