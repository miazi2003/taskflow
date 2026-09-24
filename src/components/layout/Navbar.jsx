import React, { useState } from 'react';
import {
  LayoutDashboard,
  Kanban,
  Plus,
  Search,
  RotateCcw,
  AlertCircle,
  Menu,
  X,
  CheckCircle2,
} from 'lucide-react';
import { useTaskFlow } from '../../context/TaskContext';

export const Navbar = () => {
  const {
    activeTab,
    setActiveTab,
    filters,
    updateFilter,
    openCreateModal,
    overdueTasks,
    totalTasksCount,
    resetAllData,
  } = useTaskFlow();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleReset = () => {
    resetAllData();
    setShowResetConfirm(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <div
              className="flex items-center gap-2.5 cursor-pointer select-none"
              onClick={() => setActiveTab('dashboard')}
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
                <Kanban className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-slate-900 leading-tight">
                  TaskFlow
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 leading-tight">
                  Agency Workspace
                </span>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'dashboard'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </button>

              <button
                onClick={() => setActiveTab('board')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'board'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Kanban className="w-4 h-4" />
                Task Board
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-xs font-semibold bg-slate-200 text-slate-700">
                  {totalTasksCount}
                </span>
              </button>
            </nav>
          </div>

          <div className="hidden lg:flex items-center flex-1 max-w-xs mx-6">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Search tasks, assignees, projects..."
                value={filters.searchQuery}
                onChange={(e) => updateFilter('searchQuery', e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
              {filters.searchQuery && (
                <button
                  onClick={() => updateFilter('searchQuery', '')}
                  className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {overdueTasks.length > 0 && (
              <button
                onClick={() => setActiveTab('dashboard')}
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors"
                title={`${overdueTasks.length} tasks are currently overdue`}
              >
                <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                <span>{overdueTasks.length} Overdue</span>
              </button>
            )}

            <button
              onClick={() => openCreateModal()}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">New Task</span>
              <span className="sm:hidden">Task</span>
            </button>

            <button
              onClick={() => setShowResetConfirm(true)}
              className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              title="Reset Demo Data"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-4 space-y-3">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search tasks..."
              value={filters.searchQuery}
              onChange={(e) => updateFilter('searchQuery', e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setActiveTab('dashboard');
                setMobileMenuOpen(false);
              }}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium ${
                activeTab === 'dashboard'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-700 bg-slate-50 hover:bg-slate-100'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </button>

            <button
              onClick={() => {
                setActiveTab('board');
                setMobileMenuOpen(false);
              }}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium ${
                activeTab === 'board'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-700 bg-slate-50 hover:bg-slate-100'
              }`}
            >
              <Kanban className="w-4 h-4" />
              Task Board ({totalTasksCount})
            </button>
          </div>
        </div>
      )}

      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-5 border border-slate-200">
            <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">Reset Demo Data?</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              This will restore all default mock projects, team members, and sample tasks. Any custom edits will be cleared.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-1.5 text-xs font-medium bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg inline-flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Reset Data
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
