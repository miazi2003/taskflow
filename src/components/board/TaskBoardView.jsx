import React, { useState } from 'react';
import {
  Plus,
  Search,
  X,
  ChevronDown,
  MoreHorizontal,
  CircleDot,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { useTaskFlow } from '../../context/TaskContext';
import { TaskCard } from './TaskCard';
import { EmptyState } from '../ui/EmptyState';
import { CustomSelect } from '../ui/CustomSelect';

const COLUMNS = [
  {
    id: 'todo',
    title: 'To Do',
    icon: <CircleDot className="w-4 h-4 text-[#747871]" />,
    color: '#E8E2D5',
    badgeBg: 'bg-[#EFE9DF] text-[#1B1F1B]',
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    icon: <Clock className="w-4 h-4 text-[#8FA866]" />,
    color: '#8FA866',
    badgeBg: 'bg-[#8FA866]/20 text-[#4E662F]',
  },
  {
    id: 'done',
    title: 'Done',
    icon: <CheckCircle2 className="w-4 h-4 text-[#4466B3]" />,
    color: '#9BB4E8',
    badgeBg: 'bg-[#9BB4E8]/20 text-[#3054A3]',
  },
];

export const TaskBoardView = () => {
  const {
    tasks,
    filteredTasks,
    projects,
    teamMembers,
    filters,
    updateFilter,
    resetFilters,
    openCreateModal,
    moveTaskStatus,
  } = useTaskFlow();

  const [dragOverColumn, setDragOverColumn] = useState(null);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const hasActiveFilters =
    filters.searchQuery !== '' ||
    filters.projectId !== 'all' ||
    filters.assigneeId !== 'all' ||
    filters.priority !== 'all' ||
    filters.status !== 'all';

  const todoCount = tasks.filter((t) => t.status === 'todo').length;
  const inProgressCount = tasks.filter((t) => t.status === 'in-progress').length;
  const doneCount = tasks.filter((t) => t.status === 'done').length;

  const statusTabs = [
    { id: 'all', label: 'All', count: tasks.length },
    { id: 'todo', label: 'To Do', count: todoCount },
    { id: 'in-progress', label: 'In Progress', count: inProgressCount },
    { id: 'done', label: 'Done', count: doneCount },
  ];

  const currentTab = filters.status || 'all';

  const baseSections =
    currentTab === 'all'
      ? COLUMNS
      : COLUMNS.filter((col) => col.id === currentTab);

  const sectionsToDisplay =
    hasActiveFilters && currentTab === 'all'
      ? baseSections.filter((col) => filteredTasks.some((t) => t.status === col.id))
      : baseSections;

  const handleDragOver = (e, status) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColumn !== status) {
      setDragOverColumn(status);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOverColumn(null);
  };

  const handleDrop = (e, status) => {
    e.preventDefault();
    setDragOverColumn(null);
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      moveTaskStatus(taskId, status);
    }
  };

  return (
    <div className="space-y-8 w-full">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#EDE7DC]/80 pb-3">
        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex items-center gap-6">
            {statusTabs.map((tab) => {
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => updateFilter('status', tab.id)}
                  className={`flex items-center gap-2 pb-1 text-sm transition-all relative ${
                    isActive
                      ? 'text-[#1B1F1B] font-semibold border-b-2 border-[#1B1F1B]'
                      : 'text-[#747871] hover:text-[#1B1F1B] font-normal border-b-2 border-transparent'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${
                      isActive
                        ? 'bg-[#EFE9DF] text-[#1B1F1B] font-medium'
                        : 'bg-[#FAF7F2] text-[#747871] font-normal'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() =>
              openCreateModal(
                filters.projectId !== 'all' ? filters.projectId : undefined,
                currentTab !== 'all' ? currentTab : undefined
              )
            }
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium bg-[#1B1F1B] hover:bg-[#2D322C] text-white rounded-full transition-all shadow-2xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Task</span>
          </button>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap justify-start lg:justify-end">
          <div className="relative min-w-[170px] sm:min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-[#747871] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search"
              value={filters.searchQuery}
              onChange={(e) => updateFilter('searchQuery', e.target.value)}
              className="w-full bg-white border border-[#EDE7DC] hover:border-[#D5CDBD] rounded-full pl-8 pr-7 py-1.5 text-xs font-normal text-[#2D322C] placeholder-[#747871] focus:outline-none focus:ring-1 focus:ring-[#1B1F1B] shadow-2xs transition-all"
            />
            {filters.searchQuery && (
              <button
                type="button"
                onClick={() => updateFilter('searchQuery', '')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#747871] hover:text-[#1B1F1B]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <CustomSelect
            value={filters.projectId}
            onChange={(val) => updateFilter('projectId', val)}
            className="w-auto min-w-[130px]"
            triggerClassName="py-1.5 px-3 text-xs"
            menuWidth="w-48"
            placeholder="Project"
            options={[
              { value: 'all', label: 'All Projects' },
              ...projects.map((p) => ({ value: p.id, label: p.name })),
            ]}
          />

          <CustomSelect
            value={filters.assigneeId}
            onChange={(val) => updateFilter('assigneeId', val)}
            className="w-auto min-w-[130px]"
            triggerClassName="py-1.5 px-3 text-xs"
            menuWidth="w-52"
            placeholder="Assignee"
            options={[
              { value: 'all', label: 'All Assignees' },
              ...teamMembers.map((m) => ({
                value: m.id,
                label: m.name,
                avatar: m.avatar,
              })),
            ]}
          />

          <CustomSelect
            value={filters.priority || 'all'}
            onChange={(val) => updateFilter('priority', val)}
            className="w-auto min-w-[120px]"
            triggerClassName="py-1.5 px-3 text-xs"
            menuWidth="w-44"
            placeholder="Priority"
            options={[
              { value: 'all', label: 'All Priorities' },
              { value: 'urgent', label: 'Urgent', color: '#FA709A' },
              { value: 'high', label: 'High Priority', color: '#E5A800' },
              { value: 'medium', label: 'Medium Priority', color: '#4466B3' },
              { value: 'low', label: 'Low Priority', color: '#747871' },
            ]}
          />

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className="bg-white border border-[#EDE7DC] hover:border-[#D5CDBD] text-[#747871] hover:text-[#1B1F1B] rounded-full p-1.5 flex items-center justify-center shadow-2xs transition-colors cursor-pointer"
              title="More options"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {showMoreMenu && (
              <div
                className="absolute right-0 top-9 z-20 w-36 bg-white rounded-2xl shadow-soft border border-[#EDE7DC] p-1 text-xs"
                onMouseLeave={() => setShowMoreMenu(false)}
              >
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={() => {
                      resetFilters();
                      setShowMoreMenu(false);
                    }}
                    className="w-full text-left px-3.5 py-1.5 text-[#B82B59] hover:bg-[#FA709A]/10 font-normal rounded-xl cursor-pointer"
                  >
                    Clear Filters
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    openCreateModal();
                    setShowMoreMenu(false);
                  }}
                  className="w-full text-left px-3.5 py-1.5 text-[#2D322C] hover:bg-[#FAF7F2] font-normal rounded-xl cursor-pointer"
                >
                  Create Task
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-10 w-full">
        {hasActiveFilters && filteredTasks.length === 0 ? (
          <div className="bg-white rounded-[20px] p-12 text-center border border-[#EDE7DC]">
            <EmptyState
              title="No tasks found"
              description={
                filters.searchQuery.trim()
                  ? `No tasks match "${filters.searchQuery}". Try another search term.`
                  : 'No tasks match current filter criteria.'
              }
              actionLabel="Clear Filters"
              onAction={resetFilters}
            />
          </div>
        ) : (
          sectionsToDisplay.map((column) => {
            const columnTasks = filteredTasks.filter((t) => t.status === column.id);
            const isOver = dragOverColumn === column.id;

          return (
            <div key={column.id} className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#EDE7DC]/80">
                <div className="flex items-center gap-2.5">
                  {column.icon}
                  <h2 className="text-base sm:text-lg font-semibold text-[#1B1F1B] tracking-tight">
                    {column.title}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#EFE9DF] text-[#1B1F1B]">
                    {columnTasks.length}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    openCreateModal(
                      filters.projectId !== 'all' ? filters.projectId : undefined,
                      column.id
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-normal text-[#747871] hover:text-[#1B1F1B] hover:bg-[#EFE9DF]/60 rounded-full transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Task</span>
                </button>
              </div>

              <div
                onDragOver={(e) => handleDragOver(e, column.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, column.id)}
                className={`w-full rounded-2xl transition-all ${
                  isOver ? 'ring-2 ring-[#1B1F1B]/20 bg-[#EFE9DE]/40 p-3 -m-3' : ''
                }`}
              >
                {columnTasks.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                    {columnTasks.map((task) => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-[#F7F2EA] rounded-2xl p-10 border border-[#EDE7DC] flex items-center justify-center">
                    <EmptyState
                      title={`No ${column.title.toLowerCase()} tasks`}
                      description={
                        hasActiveFilters
                          ? 'No tasks match current filter criteria.'
                          : `Click Add Task to create a task in ${column.title}.`
                      }
                      actionLabel="+ Add Task"
                      onAction={() =>
                        openCreateModal(
                          filters.projectId !== 'all' ? filters.projectId : undefined,
                          column.id
                        )
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          );
        }))}
      </div>
    </div>
  );
};
