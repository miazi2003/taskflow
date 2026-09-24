import React from 'react';
import { TaskProvider, useTaskFlow } from './context/TaskContext';
import { Navbar } from './components/layout/Navbar';
import { DashboardView } from './components/dashboard/DashboardView';
import { TaskBoardView } from './components/board/TaskBoardView';
import { ProjectsView } from './components/projects/ProjectsView';
import { TaskModal } from './components/tasks/TaskModal';

const AppContent = () => {
  const { activeTab } = useTaskFlow();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'board':
        return <TaskBoardView />;
      case 'projects':
        return <ProjectsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] w-full">
      <Navbar />

      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-8">
        {renderActiveView()}
      </main>

      <TaskModal />
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
