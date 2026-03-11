import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Equation {
  id: string;
  name: string;
  expression: string;
}

interface AppState {
  equations: Equation[];
  activeEquationId: string | null;
  inputValue: string;
  isDarkMode: boolean;
  calculatorMode: 'equation' | 'simple';
  simpleExpression: string;

  addEquation: (equation: Omit<Equation, 'id'>) => void;
  updateEquation: (id: string, equation: Omit<Equation, 'id'>) => void;
  deleteEquation: (id: string) => void;
  setActiveEquation: (id: string) => void;

  setInputValue: (val: string) => void;
  appendInput: (char: string) => void;
  deleteInput: () => void;
  clearInput: () => void;
  toggleSign: () => void;

  toggleDarkMode: () => void;
  setCalculatorMode: (mode: 'equation' | 'simple') => void;
  setSimpleExpression: (expr: string | ((prev: string) => string)) => void;
}

const defaultEquations: Equation[] = [
  { id: '1', name: 'Yen to Kyat', expression: 'x * 25.5' },
  { id: '2', name: 'Yen to Baht', expression: 'x * 0.2' },
  { id: '3', name: 'Baht to Yen', expression: 'x * 5' },
];

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      equations: defaultEquations,
      activeEquationId: '1',
      inputValue: '',
      isDarkMode: false,
      calculatorMode: 'equation',
      simpleExpression: '',

      addEquation: (eq) => set((state) => {
        const newEq = { ...eq, id: Math.random().toString(36).substring(2, 9) };
        return {
          equations: [...state.equations, newEq],
          activeEquationId: state.activeEquationId || newEq.id,
        };
      }),

      updateEquation: (id, eq) => set((state) => ({
        equations: state.equations.map((e) => (e.id === id ? { ...e, ...eq } : e)),
      })),

      deleteEquation: (id) => set((state) => {
        const newEquations = state.equations.filter((e) => e.id !== id);
        return {
          equations: newEquations,
          activeEquationId: state.activeEquationId === id
            ? (newEquations[0]?.id || null)
            : state.activeEquationId,
        };
      }),

      setActiveEquation: (id) => set({ activeEquationId: id }),

      setInputValue: (val) => set({ inputValue: val }),

      appendInput: (char) => set((state) => {
        if (char === '.' && state.inputValue.includes('.')) return state;
        if (state.inputValue === '0' && char !== '.') return { inputValue: char };
        if (state.inputValue === '-0' && char !== '.') return { inputValue: '-' + char };
        return { inputValue: state.inputValue + char };
      }),

      deleteInput: () => set((state) => ({
        inputValue: state.inputValue.length > 1
          ? state.inputValue.slice(0, -1)
          : (state.inputValue.startsWith('-') && state.inputValue.length === 2 ? '' : ''),
      })),

      clearInput: () => set({ inputValue: '' }),

      toggleSign: () => set((state) => {
        if (!state.inputValue || state.inputValue === '0') return state;
        return {
          inputValue: state.inputValue.startsWith('-')
            ? state.inputValue.slice(1)
            : '-' + state.inputValue,
        };
      }),

      toggleDarkMode: () => set((state) => {
        const newMode = !state.isDarkMode;
        if (newMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        return { isDarkMode: newMode };
      }),

      setCalculatorMode: (mode) => set({ calculatorMode: mode }),

      setSimpleExpression: (expr) => set((state) => ({
        simpleExpression: typeof expr === 'function' ? expr(state.simpleExpression) : expr
      })),
    }),
    {
      name: 'equation-calculator-storage',
      onRehydrateStorage: () => (state) => {
        if (state?.isDarkMode) {
          document.documentElement.classList.add('dark');
        }
      },
    }
  )
);
