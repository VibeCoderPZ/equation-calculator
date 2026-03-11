import React, { useState, useEffect } from 'react';
import { Copy, ClipboardPaste, CheckCircle2 } from 'lucide-react';
import { evaluate } from 'mathjs';
import { useAppStore } from '../store';

export default function SimpleCalculator() {
  const { simpleExpression, setSimpleExpression } = useAppStore();
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!simpleExpression) {
      setResult(null);
      return;
    }
    try {
      const res = evaluate(simpleExpression);
      const formattedRes = typeof res === 'number' ? Number(res.toFixed(6)).toString() : res.toString();
      setResult(formattedRes);
    } catch (err) {
      setResult(null);
    }
  }, [simpleExpression]);

  const handleCopy = async () => {
    const textToCopy = result !== null ? result : simpleExpression;
    if (textToCopy) {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      // basic validation to only allow math chars
      const sanitized = text.replace(/[^0-9+\-*/().^ ]/g, '');
      if (sanitized) {
        setSimpleExpression(prev => prev + sanitized);
      }
    } catch (err) {
      console.error('Failed to paste', err);
    }
  };

  const handleButtonClick = (btn: string) => {
    if (btn === 'C') {
      setSimpleExpression('');
    } else if (btn === 'DEL') {
      setSimpleExpression(prev => prev.slice(0, -1));
    } else if (btn === '=') {
      if (result !== null) {
        setSimpleExpression(result);
      }
    } else {
      setSimpleExpression(prev => prev + btn);
    }
  };

  const padButtons = [
    ['C', '(', ')', 'DEL'],
    ['7', '8', '9', '/'],
    ['4', '5', '6', '*'],
    ['1', '2', '3', '-'],
    ['0', '.', '=', '+'],
  ];

  return (
    <div className="flex flex-col h-full bg-gray-100 dark:bg-gray-900 transition-colors duration-200 min-h-0">
      <div className="flex-1 flex flex-col p-3 sm:p-4 space-y-3 sm:space-y-4 min-h-0">
        <div className="flex-1 flex flex-col justify-end items-end bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 relative min-h-0">
           {/* Paste Button */}
           <button 
             onClick={handlePaste} 
             className="absolute top-3 left-3 sm:top-4 sm:left-4 p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
             title="Paste expression"
           >
             <ClipboardPaste className="w-4 h-4 sm:w-5 sm:h-5"/>
           </button>
           
           {/* Copy Button */}
           <button 
             onClick={handleCopy} 
             disabled={!simpleExpression && !result}
             className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
             title="Copy result or expression"
           >
             {copied ? <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500"/> : <Copy className="w-4 h-4 sm:w-5 sm:h-5"/>}
           </button>

           <div className="w-full text-right text-2xl sm:text-3xl text-gray-500 dark:text-gray-400 font-mono break-all min-h-[2rem] sm:min-h-[2.5rem] mt-8 overflow-y-auto">
             {simpleExpression || '0'}
           </div>
           <div className="w-full h-px bg-gray-100 dark:bg-gray-700 my-3 sm:my-4 shrink-0"></div>
           <div className="w-full text-right text-4xl sm:text-5xl font-bold font-mono tracking-tighter text-indigo-600 dark:text-indigo-400 min-h-[2.5rem] sm:min-h-[3.5rem] break-all overflow-y-auto">
             {result !== null ? result : ''}
           </div>
        </div>
      </div>

      {/* Numpad */}
      <div className="p-3 sm:p-4 pb-[max(env(safe-area-inset-bottom),1rem)] sm:pb-8 bg-gray-50 dark:bg-gray-800/50 rounded-t-3xl border-t border-gray-200 dark:border-gray-700 shrink-0">
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {padButtons.map((row, rowIndex) => (
            <React.Fragment key={rowIndex}>
              {row.map((btn) => {
                const isAction = ['C', 'DEL', '(', ')'].includes(btn);
                const isOperator = ['/', '*', '-', '+', '='].includes(btn);
                
                let bgClass = 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700';
                
                if (isAction) {
                  bgClass = 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600';
                } else if (isOperator) {
                  bgClass = btn === '=' 
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md' 
                    : 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50';
                }

                return (
                  <button
                    key={btn}
                    onClick={() => handleButtonClick(btn)}
                    className={`h-12 sm:h-16 rounded-xl sm:rounded-2xl text-xl sm:text-2xl font-medium flex items-center justify-center transition-all active:scale-95 ${bgClass}`}
                  >
                    {btn}
                  </button>
                )
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
