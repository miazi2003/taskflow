import React, { useState, useEffect } from 'react';
import { X, Calendar, Folder, User, CheckCircle, AlertTriangle, Trash2 } from 'lucide-react';
import { useTaskFlow } from '../../context/TaskContext';
import { getTodayDateString } from '../../utils/dateUtils';

export const TaskModal = () => {
  const {
    isModalOpen,
    modalMode,
    editingTask,
    defaultModalProject,
    defaultModalStatus,
    closeModal,
    createTask,
    updateTask,
    deleteTask,
    projects,
    teamMembers,
  } = useTaskFlow();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('todo');
  const [priority, setPriority] = useState('medium');
  const [errors, setErrors] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (!isModalOpen) {
      setShowDeleteConfirm(false);
      return;
    }

    if (modalMode === 'edit' && editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description || '');
      setProjectId(editingTask.projectId);
      setAssigneeId(editingTask.assigneeId);
      setDueDate(editingTask.dueDate);
      setStatus(editingTask.status);
      setPriority(editingTask.priority);
      setErrors({});
    } else {
      setTitle('');
      setDescription('');
      setProjectId(defaultModalProject || (projects[0]?.id ?? ''));
      setAssigneeId(teamMembers[0]?.id ?? '');
      setDueDate(getTodayDateString());
      setStatus(defaultModalStatus || 'todo');
      setPriority('medium');
      setErrors({});
    }
  }, [isModalOpen, modalMode, editingTask, defaultModalProject, defaultModalStatus, projects, teamMembers]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, closeModal]);

  if (!isModalOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = 'Task title is required';
    }
    if (!projectId) {
      newErrors.projectId = 'Please select a project';
    }
    if (!assigneeId) {
      newErrors.assigneeId = 'Please assign a team member';
    }
    if (!dueDate) {
      newErrors.dueDate = 'Due date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (modalMode === 'create') {
      createTask({
        title: title.trim(),
        description: description.trim() || undefined,
        projectId,
        assigneeId,
        dueDate,
        status,
        priority,
      });
    } else if (modalMode === 'edit' && editingTask) {
      updateTask(editingTask.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        projectId,
        assigneeId,
        dueDate,
        status,
        priority,
      });
    }

    closeModal();
  };

  const handleDelete = () => {
    if (editingTask) {
      deleteTask(editingTask.id);
      closeModal();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 transition-all transform animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {modalMode === 'create' ? 'Create New Task' : 'Edit Task'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {modalMode === 'create'
                ? 'Fill in the details below to add a new task to your workspace.'
                : 'Update task properties, assignment, and status.'}
            </p>
          </div>
          <button
            onClick={closeModal}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Task Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
              }}
              placeholder="e.g. Conduct accessibility audit on patient portal"
              className={`w-full px-3.5 py-2 text-sm bg-white border ${
                errors.title ? 'border-rose-300 ring-1 ring-rose-300' : 'border-slate-200'
              } rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all`}
              autoFocus
            />
            {errors.title && (
              <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                {errors.title}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Project <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Folder className="w-4 h-4" />
                </div>
                <select
                  value={projectId}
                  onChange={(e) => {
                    setProjectId(e.target.value);
                    if (errors.projectId) setErrors((prev) => ({ ...prev, projectId: '' }));
                  }}
                  className="w-full pl-9 pr-8 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Assignee <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <select
                  value={assigneeId}
                  onChange={(e) => {
                    setAssigneeId(e.target.value);
                    if (errors.assigneeId) setErrors((prev) => ({ ...prev, assigneeId: '' }));
                  }}
                  className="w-full pl-9 pr-8 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
                >
                  {teamMembers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} - {m.role}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Due Date <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Calendar className="w-4 h-4" />
                </div>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => {
                    setDueDate(e.target.value);
                    if (errors.dueDate) setErrors((prev) => ({ ...prev, dueDate: '' }));
                  }}
                  className="w-full pl-9 pr-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Workflow Status <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setStatus('todo')}
                className={`py-2 px-3 text-xs font-medium rounded-lg border text-center transition-all ${
                  status === 'todo'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                To Do
              </button>
              <button
                type="button"
                onClick={() => setStatus('in-progress')}
                className={`py-2 px-3 text-xs font-medium rounded-lg border text-center transition-all ${
                  status === 'in-progress'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                In Progress
              </button>
              <button
                type="button"
                onClick={() => setStatus('done')}
                className={`py-2 px-3 text-xs font-medium rounded-lg border text-center transition-all ${
                  status === 'done'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-700 font-semibold'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                Done
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Description / Requirements <span className="text-slate-400 lowercase font-normal">(optional)</span>
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add key deliverables, acceptance criteria, or context..."
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            {modalMode === 'edit' ? (
              <div>
                {!showDeleteConfirm ? (
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete Task
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-rose-600 font-medium">Confirm?</span>
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="px-2 py-1 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-md"
                    >
                      Yes, Delete
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-2 py-1 text-xs text-slate-500 hover:text-slate-700"
                    >
                      No
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-xs transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                {modalMode === 'create' ? 'Create Task' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
