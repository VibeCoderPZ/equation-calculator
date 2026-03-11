import React, { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import { useAppStore, Equation } from '../store';

interface ManageEquationsProps {
  onBack: () => void;
}

export default function ManageEquations({ onBack }: ManageEquationsProps) {
  const { equations, addEquation, updateEquation, deleteEquation, activeEquationId } = useAppStore();
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editExpression, setEditExpression] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleEdit = (eq: Equation) => {
    setEditingId(eq.id);
    setEditName(eq.name);
    setEditExpression(eq.expression);
    setIsAdding(false);
  };

  const handleSave = () => {
    if (!editName.trim() || !editExpression.trim()) return;

    if (isAdding) {
      addEquation({ name: editName, expression: editExpression });
      setIsAdding(false);
    } else if (editingId) {
      updateEquation(editingId, { name: editName, expression: editExpression });
      setEditingId(null);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAdding(false);
  };

  const handleAddClick = () => {
    setIsAdding(true);
    setEditingId(null);
    setEditName('');
    setEditExpression('');
  };

  return (
    <div className="flex flex-col h-full bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="flex items-center p-4 bg-white dark:bg-gray-800 shadow-sm z-10">
        <button
          onClick={onBack}
          className="p-2 -ml-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white ml-2">Manage Equations</h1>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Add New Button */}
        {!isAdding && !editingId && (
          <button
            onClick={handleAddClick}
            className="w-full flex items-center justify-center space-x-2 p-4 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl border border-indigo-100 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            <span>Create New Equation</span>
          </button>
        )}

        {/* Edit / Add Form */}
        {(isAdding || editingId) && (
          <div className="bg-white dark:bg-gray-800 p-5 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {isAdding ? 'New Equation' : 'Edit Equation'}
            </h2>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="e.g., Tax Calculator"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Expression (use 'x' as variable)
                </label>
                <input
                  type="text"
                  value={editExpression}
                  onChange={(e) => setEditExpression(e.target.value)}
                  placeholder="e.g., x * 1.2"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white font-mono focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Supports standard math operations: +, -, *, /, ^, sin(x), cos(x), etc.
                </p>
              </div>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                onClick={handleCancel}
                className="flex-1 py-3 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!editName.trim() || !editExpression.trim()}
                className="flex-1 py-3 px-4 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </button>
            </div>
          </div>
        )}

        {/* Equation List */}
        <div className="space-y-3">
          {equations.map((eq) => (
            <div
              key={eq.id}
              className={`bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border transition-colors ${
                activeEquationId === eq.id 
                  ? 'border-indigo-500 dark:border-indigo-500' 
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-900 dark:text-white text-lg">{eq.name}</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-mono mt-1 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded-md inline-block w-fit text-sm">
                    f(x) = {eq.expression}
                  </span>
                </div>
                
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleEdit(eq)}
                    className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                    aria-label="Edit equation"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => deleteEquation(eq.id)}
                    className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                    aria-label="Delete equation"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {equations.length === 0 && !isAdding && (
            <div className="text-center py-10 text-gray-500 dark:text-gray-400">
              No equations found. Create one to get started!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
