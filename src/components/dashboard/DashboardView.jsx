import React from 'react';
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  AlertOctagon,
  ArrowRight,
  Plus,
  Calendar,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { useTaskFlow } from '../../context/TaskContext';
import { Avatar } from '../ui/Avatar';
import { PriorityBadge, StatusBadge } from '../ui/Badge';
import { formatDisplayDate, isTaskOverdue, isTaskDueSoon } from '../../utils/dateUtils';

export const DashboardView = () => {
  const {
    tasks,
    projects,
    totalTasksCount,
    overdueTasks,
    dueSoonTasks,
    completedTasksCount,
    inProgressTasksCount,
    todoTasksCount,
    activeProjectsCount,
    openCreateModal,
    openEditModal,
    moveTaskStatus,
    filterByProjectAndNavigate,
    setActiveTab,
    getProjectById,
    getMemberById,
  } = useTaskFlow();

  const completionPercentage =
    totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

  const upcomingTasks = [...tasks]
    .filter((t) => t.status !== 'done')
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
              Workspace Overview
            </span>
            <span className="text-xs text-slate-400">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Welcome to TaskFlow
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Track client deliverables, identify bottlenecks, and keep your team aligned across all active projects.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('board')}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            <Layers className="w-4 h-4" />
            Open Kanban Board
          </button>
          <button
            onClick={() => openCreateModal()}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            Create Task
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div
          onClick={() => setActiveTab('board')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-subtle hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Active Projects
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FolderKanban className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{activeProjectsCount}</span>
            <span className="text-xs text-slate-500 font-medium">initiatives</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 group-hover:text-indigo-600 font-medium">
            <span>View all projects</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>

        <div
          onClick={() => setActiveTab('board')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-subtle hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Tasks
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{totalTasksCount}</span>
            <span className="text-xs text-slate-500 font-medium">
              ({inProgressTasksCount} in progress)
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>{todoTasksCount} To Do</span>
            <span>•</span>
            <span>{completedTasksCount} Done</span>
          </div>
        </div>

        <div
          onClick={() => setActiveTab('board')}
          className={`bg-white rounded-2xl p-5 border transition-all cursor-pointer group ${
            overdueTasks.length > 0
              ? 'border-rose-300 bg-rose-50/20 shadow-subtle ring-1 ring-rose-200'
              : 'border-slate-200 shadow-subtle'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Overdue Tasks
            </span>
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                overdueTasks.length > 0
                  ? 'bg-rose-100 text-rose-600'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              <AlertOctagon className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span
              className={`text-3xl font-bold ${
                overdueTasks.length > 0 ? 'text-rose-600' : 'text-slate-900'
              }`}
            >
              {overdueTasks.length}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {overdueTasks.length === 1 ? 'requires triage' : 'require triage'}
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium">
            <span className={overdueTasks.length > 0 ? 'text-rose-600' : 'text-slate-500'}>
              {overdueTasks.length > 0 ? 'Needs immediate attention' : 'No overdue items'}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        <div
          onClick={() => setActiveTab('board')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-subtle hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Tasks Due Soon
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{dueSoonTasks.length}</span>
            <span className="text-xs text-slate-500 font-medium">within 3 days</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Overall completion</span>
            <span className="font-semibold text-emerald-600">{completionPercentage}%</span>
          </div>
        </div>
      </div>

      {overdueTasks.length > 0 && (
        <div className="bg-rose-50/50 border border-rose-200 rounded-2xl p-5 shadow-subtle">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
                <AlertOctagon className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-rose-900">
                Overdue Tasks Requiring Triage ({overdueTasks.length})
              </h3>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {overdueTasks.map((task) => {
              const project = getProjectById(task.projectId);
              const assignee = getMemberById(task.assigneeId);

              return (
                <div
                  key={task.id}
                  onClick={() => openEditModal(task)}
                  className="bg-white p-3.5 rounded-xl border border-rose-200 shadow-xs hover:border-rose-300 transition-all flex flex-col justify-between gap-2 cursor-pointer"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span
                        className="text-[11px] font-medium px-2 py-0.5 rounded"
                        style={{
                          backgroundColor: `${project?.color || '#6366f1'}15`,
                          color: project?.color || '#6366f1',
                        }}
                      >
                        {project?.name}
                      </span>
                      <span className="text-xs font-semibold text-rose-600">
                        {formatDisplayDate(task.dueDate)}
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-slate-900">
                      {task.title}
                    </h4>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <Avatar member={assignee} size="xs" />
                      <span className="text-xs text-slate-600">{assignee?.name}</span>
                    </div>

                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => moveTaskStatus(task.id, 'in-progress')}
                        className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
                          task.status === 'in-progress'
                            ? 'bg-indigo-600 text-white font-semibold'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        In Progress
                      </button>
                      <button
                        type="button"
                        onClick={() => moveTaskStatus(task.id, 'done')}
                        className="px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors inline-flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Done
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Upcoming Tasks</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Active tasks sorted by upcoming deadlines across all projects
            </p>
          </div>
          <button
            onClick={() => setActiveTab('board')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 self-start sm:self-auto"
          >
            <span>View Kanban Board</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4 sm:px-6">Task Title</th>
                <th className="py-3 px-4">Project</th>
                <th className="py-3 px-4">Assignee</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {upcomingTasks.length > 0 ? (
                upcomingTasks.map((task) => {
                  const project = getProjectById(task.projectId);
                  const assignee = getMemberById(task.assigneeId);
                  const overdue = isTaskOverdue(task.dueDate, task.status);
                  const dueSoon = isTaskDueSoon(task.dueDate, task.status, 3);

                  return (
                    <tr
                      key={task.id}
                      onClick={() => openEditModal(task)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-2">
                          <PriorityBadge priority={task.priority} />
                          <span className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {task.title}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium"
                          style={{
                            backgroundColor: `${project?.color || '#6366f1'}15`,
                            color: project?.color || '#6366f1',
                          }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: project?.color || '#6366f1' }}
                          />
                          {project?.name}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <Avatar member={assignee} size="xs" showName />
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded ${
                            overdue
                              ? 'text-rose-700 bg-rose-50 border border-rose-200'
                              : dueSoon
                              ? 'text-amber-700 bg-amber-50 border border-amber-200'
                              : 'text-slate-600 bg-slate-50'
                          }`}
                        >
                          <Calendar className="w-3 h-3" />
                          {formatDisplayDate(task.dueDate)}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <StatusBadge status={task.status} />
                      </td>
                      <td
                        className="py-3.5 px-4 text-right whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <select
                          value={task.status}
                          onChange={(e) => moveTaskStatus(task.id, e.target.value)}
                          className="text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                        >
                          <option value="todo">To Do</option>
                          <option value="in-progress">In Progress</option>
                          <option value="done">Done</option>
                        </select>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 text-xs">
                    No active upcoming tasks scheduled.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-subtle">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Active Projects</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Initiatives, completion rates, and active team allocations
            </p>
          </div>
          <button
            onClick={() => setActiveTab('board')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 self-start sm:self-auto"
          >
            <span>View all in Kanban</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => {
            const projectTasks = tasks.filter((t) => t.projectId === project.id);
            const doneCount = projectTasks.filter((t) => t.status === 'done').length;
            const inProgressCount = projectTasks.filter((t) => t.status === 'in-progress').length;
            const todoCount = projectTasks.filter((t) => t.status === 'todo').length;
            const projectProgress =
              projectTasks.length > 0 ? Math.round((doneCount / projectTasks.length) * 100) : 0;

            const assignedMemberIds = Array.from(
              new Set(projectTasks.map((t) => t.assigneeId))
            );
            const assignedMembers = assignedMemberIds
              .map((id) => getMemberById(id))
              .filter(Boolean);

            return (
              <div
                key={project.id}
                className="bg-slate-50/60 rounded-xl p-5 border border-slate-200/90 hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: project.color }}
                      />
                      <div>
                        <h4 className="text-base font-bold text-slate-900 leading-tight">
                          {project.name}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {project.client} • <span className="font-medium text-slate-600">{project.category}</span>
                        </p>
                      </div>
                    </div>

                    <span
                      className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider"
                      style={{
                        backgroundColor: `${project.color}15`,
                        color: project.color,
                      }}
                    >
                      {project.code}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {project.description}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-200/80">
                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                      <span className="text-slate-600">
                        {todoCount} To Do • {inProgressCount} In Progress • {doneCount} Done
                      </span>
                      <span className="text-slate-900">
                        {projectProgress}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${projectProgress}%`,
                          backgroundColor: project.color,
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center -space-x-1.5">
                      {assignedMembers.slice(0, 4).map((member) => (
                        <div key={member?.id} className="ring-2 ring-white rounded-full">
                          <Avatar member={member} size="xs" />
                        </div>
                      ))}
                      {assignedMembers.length > 4 && (
                        <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 text-[10px] font-semibold flex items-center justify-center ring-2 ring-white">
                          +{assignedMembers.length - 4}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openCreateModal(project.id)}
                        className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors inline-flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        Task
                      </button>
                      <button
                        onClick={() => filterByProjectAndNavigate(project.id)}
                        className="px-2.5 py-1 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors inline-flex items-center gap-1"
                      >
                        <span>Board</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
