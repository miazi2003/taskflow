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
import { StatusDropdown } from '../ui/StatusDropdown';
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
          { label: 'Start', nextStatus: 'in-progress', icon: <ArrowRight className="w-3.5 h-3.5" /> },
          { label: 'Done', nextStatus: 'done', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
        ];
      case 'in-progress':
        return [
          { label: 'To Do', nextStatus: 'todo', icon: <ArrowLeft className="w-3.5 h-3.5" /> },
          { label: 'Done', nextStatus: 'done', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
        ];
      case 'done':
        return [
          { label: 'Reopen', nextStatus: 'in-progress', icon: <ArrowLeft className="w-3.5 h-3.5" /> },
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
      className="group relative bg-white rounded-[20px] border border-[#EDE7DC] hover:border-[#D0C8B8] p-5 shadow-2xs hover:shadow-soft transition-all duration-200 cursor-grab active:cursor-grabbing select-none flex flex-col justify-between gap-3.5 hover:z-30 focus-within:z-40"
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            {project && (
              <span
                className="text-xs font-medium text-[#747871] truncate max-w-[170px]"
                title={project.name}
              >
                {project.name}
              </span>
            )}
            <PriorityBadge priority={task.priority} size="xs" />
          </div>

          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="opacity-0 group-hover:opacity-100 p-1 text-[#747871] hover:text-[#1B1F1B] hover:bg-[#F4EFE6] rounded-full transition-opacity cursor-pointer"
              title="Card Options"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {menuOpen && (
              <div
                className="absolute right-0 top-7 z-50 w-32 bg-white rounded-2xl shadow-soft border border-[#EDE7DC] p-1"
                onMouseLeave={() => setMenuOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    openEditModal(task);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs font-medium text-[#1B1F1B] hover:bg-[#FAF7F2] rounded-xl flex items-center gap-2 cursor-pointer"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Edit Task</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    deleteTask(task.id);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs font-medium text-[#B82B59] hover:bg-[#FA709A]/10 rounded-xl flex items-center gap-2 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <h4
          className={`text-[15px] sm:text-base font-semibold text-[#1B1F1B] leading-snug mb-1.5 group-hover:text-[#4466B3] transition-colors ${
            task.status === 'done' ? 'line-through text-[#747871]' : ''
          }`}
        >
          {task.title}
        </h4>

        {task.description && (
          <p className="text-xs sm:text-[13px] font-normal text-[#555952] line-clamp-2 mb-2 leading-relaxed">
            {task.description}
          </p>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between pt-3 border-t border-[#F2ECE1]">
          <div className="flex items-center gap-2 min-w-0">
            <Avatar member={assignee} size="xs" />
            <span className="text-xs sm:text-[13px] font-medium text-[#1B1F1B] truncate max-w-[120px]" title={assignee?.name}>
              {assignee ? assignee.name : 'Unassigned'}
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full ${
                task.status === 'done'
                  ? 'text-[#747871] bg-[#F4EFE6]'
                  : overdue
                  ? 'bg-[#FA709A]/18 text-[#B82B59]'
                  : dueSoon
                  ? 'bg-[#F6D75C]/30 text-[#7E6707]'
                  : 'bg-[#F4EFE6] text-[#555952]'
              }`}
              title={`Due: ${task.dueDate}`}
            >
              {overdue && task.status !== 'done' ? (
                <AlertCircle className="w-3.5 h-3.5 text-[#B82B59] shrink-0" />
              ) : dueSoon && task.status !== 'done' ? (
                <Clock className="w-3.5 h-3.5 text-[#7E6707] shrink-0" />
              ) : (
                <Calendar className="w-3.5 h-3.5 text-[#747871] shrink-0" />
              )}
              <span>{formatDisplayDate(task.dueDate)}</span>
            </span>
          </div>
        </div>

        <div
          className="mt-3 pt-2.5 border-t border-[#F2ECE1] flex items-center justify-between gap-1 opacity-90 group-hover:opacity-100 transition-opacity"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-1">
            {transitions.map((t) => (
              <button
                key={t.nextStatus}
                type="button"
                onClick={() => moveTaskStatus(task.id, t.nextStatus)}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-[#555952] hover:text-[#1B1F1B] hover:bg-[#F4EFE6] rounded-full transition-colors cursor-pointer"
                title={`Move to ${t.nextStatus}`}
              >
                {t.icon}
                <span>{t.label}</span>
              </button>
            ))}
          </div>

          <StatusDropdown
            status={task.status}
            onChange={(newStatus) => moveTaskStatus(task.id, newStatus)}
          />
        </div>
      </div>
    </div>
  );
};
