import React, { useState } from 'react';
import {
  Plus,
  Filter,
  Search,
  X,
  ListFilter,
  CircleDot,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { useTaskFlow } from '../../context/TaskContext';
import { TaskCard } from './TaskCard';
import { EmptyState } from '../ui/EmptyState';

const COLUMNS = [
  {
    id: 'todo',
    title: 'To Do',
    icon: <CircleDot className="w-4 h-4 text-slate-500" />,
    color: 'border-slate-300',
    badgeBg: 'bg-slate-100 text-slate-700',
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    icon: <Clock className="w-4 h-4 text-indigo-500" />,
    color: 'border-indigo-400',
    badgeBg: 'bg-indigo-50 text-indigo-700',
  },
  {
    id: 'done',
    title: 'Done',
    icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
    color: 'border-emerald-400',
    badgeBg: 'bg-emerald-50 text-emerald-700',
  },
];

export const TaskBoardView = () => {
  const {
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

  const hasActiveFilters =
    filters.searchQuery !== '' ||
    filters.projectId !== 'all' ||
    filters.assigneeId !== 'all' ||
    filters.priority !== 'all';

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
    <div className="space-y-6">
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Filter tasks by keyword..."
              value={filters.searchQuery}
              onChange={(e) => updateFilter('searchQuery', e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
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

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={filters.projectId}
                onChange={(e) => updateFilter('projectId', e.target.value)}
                className="bg-transparent text-xs font-medium text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="all">All Projects</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
              <ListFilter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={filters.assigneeId}
                onChange={(e) => updateFilter('assigneeId', e.target.value)}
                className="bg-transparent text-xs font-medium text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="all">All Assignees</option>
                {teamMembers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
              <select
                value={filters.priority || 'all'}
                onChange={(e) => updateFilter('priority', e.target.value)}
                className="bg-transparent text-xs font-medium text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="all">All Priorities</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Clear Filters
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
          <span className="text-xs font-medium text-slate-500">
            Showing <strong className="text-slate-800">{filteredTasks.length}</strong> tasks
          </span>
          <button
            onClick={() => openCreateModal(filters.projectId !== 'all' ? filters.projectId : undefined)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Task
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {COLUMNS.map((column) => {
          const columnTasks = filteredTasks.filter((t) => t.status === column.id);
          const isOver = dragOverColumn === column.id;

          return (
            <div
              key={column.id}
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.id)}
              className={`flex flex-col bg-slate-100/75 rounded-2xl p-4 border transition-all ${
                isOver
                  ? 'border-indigo-500 bg-indigo-50/50 ring-2 ring-indigo-200'
                  : 'border-slate-200/80'
              }`}
            >
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200/80">
                <div className="flex items-center gap-2">
                  {column.icon}
                  <h3 className="text-sm font-bold text-slate-800 tracking-tight">
                    {column.title}
                  </h3>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-bold ${column.badgeBg}`}
                  >
                    {columnTasks.length}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => openCreateModal(filters.projectId !== 'all' ? filters.projectId : undefined, column.id)}
                  className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-md transition-colors"
                  title={`Add task to ${column.title}`}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 space-y-3 min-h-[350px]">
                {columnTasks.length > 0 ? (
                  columnTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))
                ) : (
                  <div className="h-full flex items-center justify-center p-4">
                    <EmptyState
                      title={`No ${column.title.toLowerCase()} tasks`}
                      description={
                        hasActiveFilters
                          ? 'No tasks match current filter criteria.'
                          : `Drag a task here or click below to create one.`
                      }
                      actionLabel="+ Create Task"
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
        })}
      </div>
    </div>
  );
};
