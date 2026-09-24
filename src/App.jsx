import React from 'react';
import { TaskProvider, useTaskFlow } from './context/TaskContext';
import { Navbar } from './components/layout/Navbar';
import { DashboardView } from './components/dashboard/DashboardView';
import { TaskBoardView } from './components/board/TaskBoardView';
import { TaskModal } from './components/tasks/TaskModal';

const AppContent = () => {
  const { activeTab } = useTaskFlow();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'dashboard' ? <DashboardView /> : <TaskBoardView />}
      </main>

      <TaskModal />

      <footer className="mt-auto border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">TaskFlow</span>
            <span>•</span>
            <span>Lightweight Project Management</span>
          </div>
          <div className="flex items-center gap-4">
            <span>In-Memory Synchronized State</span>
            <span>•</span>
            <span>Zero Backend Dependency</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export const App = () => {
  return (
    <TaskProvider>
      <AppContent />
    </TaskProvider>
  );
};

export default App;
