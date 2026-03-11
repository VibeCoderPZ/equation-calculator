import React, { useState } from 'react';
import EquationCalculator from './components/EquationCalculator';
import SimpleCalculator from './components/SimpleCalculator';
import ManageEquations from './components/ManageEquations';
import { Settings, Moon, Sun, Calculator as CalcIcon } from 'lucide-react';
import { useAppStore } from './store';

export default function App() {
  const { calculatorMode, setCalculatorMode, isDarkMode, toggleDarkMode } = useAppStore();
  // Toggle between the main calculator view and the equation management view
  const [currentView, setCurrentView] = useState<'calculator' | 'manage'>('calculator');

  return (
    // Main App Container
    // To change the max width on desktop, adjust `max-w-md`
    // To change the background color, adjust `bg-gray-100 dark:bg-gray-900`
    <div className="h-[100dvh] w-full max-w-md mx-auto bg-gray-100 dark:bg-gray-900 overflow-hidden relative shadow-2xl sm:rounded-[2.5rem] sm:h-[850px] sm:max-h-[90vh] sm:my-8 sm:border-8 sm:border-gray-800 dark:sm:border-gray-950 flex flex-col">
      
      {/* Global Header for Calculator Views */}
      {currentView === 'calculator' && (
        <header className="flex items-center justify-between p-3 sm:p-4 bg-white dark:bg-gray-800 shadow-sm z-10 shrink-0">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <CalcIcon className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 dark:text-indigo-400 hidden sm:block" />
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">EqCalc</h1>
          </div>
          
          {/* Mode Toggle Switch */}
          <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
            <button 
              onClick={() => setCalculatorMode('simple')} 
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all ${calculatorMode === 'simple' ? 'bg-white dark:bg-gray-600 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
            >
              Simple
            </button>
            <button 
              onClick={() => setCalculatorMode('equation')} 
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all ${calculatorMode === 'equation' ? 'bg-white dark:bg-gray-600 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
            >
              Equation
            </button>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-2">
            {calculatorMode === 'equation' && (
              <button
                onClick={() => setCurrentView('manage')}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                aria-label="Manage Equations"
              >
                <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
          </div>
        </header>
      )}

      {/* View Container */}
      <div className="flex-1 relative overflow-hidden flex flex-col min-h-0">
        {currentView === 'calculator' ? (
          calculatorMode === 'equation' ? <EquationCalculator /> : <SimpleCalculator />
        ) : (
          <ManageEquations onBack={() => setCurrentView('calculator')} />
        )}
      </div>
    </div>
  );
}
