import React, { useState } from 'react';
import {
  LayoutDashboard,
  Kanban,
  FolderKanban,
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
    projects,
    resetAllData,
  } = useTaskFlow();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleReset = () => {
    resetAllData();
    setShowResetConfirm(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#EDE7DC]/70 w-full">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-[72px]">
          <div className="flex items-center gap-8 lg:gap-10">
            <div
              className="flex items-center gap-2.5 cursor-pointer select-none"
              onClick={() => setActiveTab('dashboard')}
            >
              <img
                src="/logo.png"
                alt="TaskFlow Logo"
                className="w-8 h-8 rounded-xl object-cover shadow-2xs"
              />
              <span className="text-lg font-semibold tracking-tight text-[#1B1F1B]">
                TaskFlow
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs transition-all ${
                  activeTab === 'dashboard'
                    ? 'font-medium text-[#1B1F1B] bg-[#EFE9DF]'
                    : 'font-normal text-[#747871] hover:text-[#1B1F1B] hover:bg-[#F4EFE6]/70'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('board')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs transition-all ${
                  activeTab === 'board'
                    ? 'font-medium text-[#1B1F1B] bg-[#EFE9DF]'
                    : 'font-normal text-[#747871] hover:text-[#1B1F1B] hover:bg-[#F4EFE6]/70'
                }`}
              >
                <Kanban className="w-3.5 h-3.5" />
                <span>Task Board</span>
                <span className="text-[11px] text-[#747871] font-normal">
                  {totalTasksCount}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('projects')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs transition-all ${
                  activeTab === 'projects'
                    ? 'font-medium text-[#1B1F1B] bg-[#EFE9DF]'
                    : 'font-normal text-[#747871] hover:text-[#1B1F1B] hover:bg-[#F4EFE6]/70'
                }`}
              >
                <FolderKanban className="w-3.5 h-3.5" />
                <span>Projects</span>
                <span className="text-[11px] text-[#747871] font-normal">
                  {projects.length}
                </span>
              </button>
            </nav>
          </div>

          <div className="hidden lg:flex items-center flex-1 max-w-sm mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#747871]">
                <Search className="w-3.5 h-3.5" />
              </div>
              <input
                type="text"
                placeholder="Search tasks, projects..."
                value={filters.searchQuery}
                onChange={(e) => updateFilter('searchQuery', e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && activeTab === 'dashboard' && filters.searchQuery.trim()) {
                    setActiveTab('board');
                  }
                }}
                className="w-full pl-9 pr-8 py-2 text-xs font-normal bg-[#F4EFE6]/80 hover:bg-[#F4EFE6] border-0 rounded-full text-[#1B1F1B] placeholder-[#747871] focus:outline-none focus:ring-1 focus:ring-[#1B1F1B] focus:bg-white transition-all"
              />
              {filters.searchQuery && (
                <button
                  type="button"
                  onClick={() => updateFilter('searchQuery', '')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#747871] hover:text-[#1B1F1B] cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5">
            {overdueTasks.length > 0 && (
              <button
                type="button"
                onClick={() => setActiveTab('dashboard')}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-normal text-[#B82B59] hover:bg-[#FA709A]/10 transition-colors"
                title={`${overdueTasks.length} tasks overdue`}
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{overdueTasks.length} Overdue</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => openCreateModal()}
              className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium bg-[#1B1F1B] text-white hover:bg-[#2D322C] transition-all shadow-2xs whitespace-nowrap cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 shrink-0" />
              <span>New Task</span>
            </button>

            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="p-2 text-[#747871] hover:text-[#1B1F1B] hover:bg-[#F4EFE6] rounded-full transition-colors cursor-pointer"
              title="Reset Demo Data"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#1B1F1B] hover:bg-[#F4EFE6] rounded-full transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 top-[72px] bg-black/25 backdrop-blur-xs z-30 md:hidden animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 z-40 md:hidden border-b border-[#EDE7DC] bg-[#FAF7F2] px-4 pt-3.5 pb-4 space-y-3 shadow-soft-lg animate-slide-down">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#747871]">
                <Search className="w-3.5 h-3.5" />
              </div>
              <input
                type="text"
                placeholder="Search tasks..."
                value={filters.searchQuery}
                onChange={(e) => updateFilter('searchQuery', e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && activeTab === 'dashboard' && filters.searchQuery.trim()) {
                    setActiveTab('board');
                    setMobileMenuOpen(false);
                  }
                }}
                className="w-full pl-9 pr-8 py-2.5 text-xs font-normal bg-white border border-[#EDE7DC] rounded-full text-[#1B1F1B] placeholder-[#747871] shadow-2xs focus:outline-none focus:ring-1 focus:ring-[#1B1F1B]"
              />
              {filters.searchQuery && (
                <button
                  type="button"
                  onClick={() => updateFilter('searchQuery', '')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#747871] hover:text-[#1B1F1B] cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('dashboard');
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-full text-xs transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'dashboard'
                    ? 'bg-[#1B1F1B] text-white font-medium shadow-2xs'
                    : 'bg-white text-[#555952] hover:text-[#1B1F1B] border border-[#EDE7DC] font-normal shadow-2xs hover:bg-[#FAF7F2]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <LayoutDashboard className="w-4 h-4 shrink-0" />
                  <span>Dashboard</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('board');
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-full text-xs transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'board'
                    ? 'bg-[#1B1F1B] text-white font-medium shadow-2xs'
                    : 'bg-white text-[#555952] hover:text-[#1B1F1B] border border-[#EDE7DC] font-normal shadow-2xs hover:bg-[#FAF7F2]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Kanban className="w-4 h-4 shrink-0" />
                  <span>Task Board</span>
                </div>
                <span
                  className={`text-[11px] px-2.5 py-0.5 rounded-full ${
                    activeTab === 'board' ? 'bg-white/20 text-white font-medium' : 'bg-[#FAF7F2] text-[#747871]'
                  }`}
                >
                  {totalTasksCount}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('projects');
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-full text-xs transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'projects'
                    ? 'bg-[#1B1F1B] text-white font-medium shadow-2xs'
                    : 'bg-white text-[#555952] hover:text-[#1B1F1B] border border-[#EDE7DC] font-normal shadow-2xs hover:bg-[#FAF7F2]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FolderKanban className="w-4 h-4 shrink-0" />
                  <span>Projects</span>
                </div>
                <span
                  className={`text-[11px] px-2.5 py-0.5 rounded-full ${
                    activeTab === 'projects' ? 'bg-white/20 text-white font-medium' : 'bg-[#FAF7F2] text-[#747871]'
                  }`}
                >
                  {projects.length}
                </span>
              </button>
            </div>
          </div>
        </>
      )}

      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-soft-lg max-w-sm w-full p-6 border border-[#EDE7DC]">
            <div className="w-10 h-10 rounded-2xl bg-[#F6D75C]/25 text-[#7E6707] flex items-center justify-center mb-3">
              <RotateCcw className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-[#1B1F1B]">Reset Demo Data?</h3>
            <p className="text-xs text-[#747871] mt-1 mb-5 leading-relaxed font-normal">
              This will restore all default mock projects, team members, and tasks.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-1.5 text-xs font-normal text-[#747871] hover:bg-[#F4EFE6] rounded-full transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-1.5 text-xs font-medium bg-[#1B1F1B] text-white hover:bg-[#2D322C] rounded-full inline-flex items-center gap-1.5"
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
