import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  MoreHorizontal,
  Edit2,
  Trash2,
} from 'lucide-react';
import { useTaskFlow } from '../../context/TaskContext';
import { Avatar } from '../ui/Avatar';
import { PriorityBadge } from '../ui/Badge';
import { formatDisplayDate, isTaskOverdue, isTaskDueSoon } from '../../utils/dateUtils';

export const TaskCard = ({ task }) => {
  const {
    getProjectById,
    getMemberById,
    openEditModal,
    moveTaskStatus,
    deleteTask,
  } = useTaskFlow();

  const [menuOpen, setMenuOpen] = useState(false);

  const project = getProjectById(task.projectId);
  const assignee = getMemberById(task.assigneeId);

  const overdue = isTaskOverdue(task.dueDate, task.status);
  const dueSoon = isTaskDueSoon(task.dueDate, task.status, 3);

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const getStatusTransitions = (currentStatus) => {
    switch (currentStatus) {
      case 'todo':
        return [
          { label: 'Start', nextStatus: 'in-progress', icon: <ArrowRight className="w-3 h-3" /> },
          { label: 'Complete', nextStatus: 'done', icon: <CheckCircle2 className="w-3 h-3" /> },
        ];
      case 'in-progress':
        return [
          { label: 'To Do', nextStatus: 'todo', icon: <ArrowLeft className="w-3 h-3" /> },
          { label: 'Done', nextStatus: 'done', icon: <CheckCircle2 className="w-3 h-3" /> },
        ];
      case 'done':
        return [
          { label: 'Reopen', nextStatus: 'in-progress', icon: <ArrowLeft className="w-3 h-3" /> },
        ];
      default:
        return [];
    }
  };

  const transitions = getStatusTransitions(task.status);

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={() => openEditModal(task)}
      className="group relative bg-white rounded-xl border border-slate-200/90 hover:border-slate-300 p-4 shadow-subtle hover:shadow-card-hover transition-all cursor-grab active:cursor-grabbing select-none"
    >
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          {project && (
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide uppercase"
              style={{
                backgroundColor: `${project.color}15`,
                color: project.color,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: project.color }}
              />
              {project.code}
            </span>
          )}
          <PriorityBadge priority={task.priority} />
        </div>

        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-opacity"
            title="Card Options"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {menuOpen && (
            <div
              className="absolute right-0 top-6 z-20 w-32 bg-white rounded-lg shadow-lg border border-slate-200 py-1"
              onMouseLeave={() => setMenuOpen(false)}
            >
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  openEditModal(task);
                }}
                className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
              >
                <Edit2 className="w-3 h-3" />
                Edit Task
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  deleteTask(task.id);
                }}
                className="w-full text-left px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2"
              >
                <Trash2 className="w-3 h-3" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <h4
        className={`text-sm font-semibold text-slate-900 leading-snug mb-2 group-hover:text-indigo-600 transition-colors ${
          task.status === 'done' ? 'line-through text-slate-500' : ''
        }`}
      >
        {task.title}
      </h4>

      {task.description && (
        <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-2">
        <div className="flex items-center gap-2">
          <Avatar member={assignee} size="xs" />
          <span className="text-xs text-slate-600 truncate max-w-[100px]" title={assignee?.name}>
            {assignee ? assignee.name.split(' ')[0] : 'Unassigned'}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <div
            className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md ${
              task.status === 'done'
                ? 'text-slate-400 bg-slate-50'
                : overdue
                ? 'text-rose-700 bg-rose-50 border border-rose-200'
                : dueSoon
                ? 'text-amber-700 bg-amber-50 border border-amber-200'
                : 'text-slate-500 bg-slate-50'
            }`}
            title={`Due: ${task.dueDate}`}
          >
            {overdue && task.status !== 'done' ? (
              <AlertCircle className="w-3 h-3 text-rose-500 shrink-0" />
            ) : dueSoon && task.status !== 'done' ? (
              <Clock className="w-3 h-3 text-amber-500 shrink-0" />
            ) : (
              <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
            )}
            <span>{formatDisplayDate(task.dueDate)}</span>
          </div>
        </div>
      </div>

      <div
        className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between gap-1 opacity-90 group-hover:opacity-100 transition-opacity"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-1">
          {transitions.map((t) => (
            <button
              key={t.nextStatus}
              type="button"
              onClick={() => moveTaskStatus(task.id, t.nextStatus)}
              className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-slate-600 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 rounded-md transition-colors"
              title={`Move to ${t.nextStatus}`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        <select
          value={task.status}
          onChange={(e) => moveTaskStatus(task.id, e.target.value)}
          className="text-[11px] text-slate-500 bg-transparent border-0 py-0.5 pl-1 pr-4 focus:ring-0 cursor-pointer font-medium hover:text-slate-900"
          title="Change Status"
        >
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>
    </div>
  );
};
