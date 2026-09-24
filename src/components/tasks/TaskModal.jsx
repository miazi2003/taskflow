import React, { useState, useEffect } from 'react';
import { X, Folder, User, Check, AlertTriangle, Trash2, Loader2, Flag } from 'lucide-react';
import { useTaskFlow } from '../../context/TaskContext';
import { CustomSelect } from '../ui/CustomSelect';
import { getTodayDateString } from '../../utils/dateUtils';

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low Priority', color: '#747871' },
  { value: 'medium', label: 'Medium Priority', color: '#4466B3' },
  { value: 'high', label: 'High Priority', color: '#E5A800' },
  { value: 'urgent', label: 'Urgent', color: '#FA709A' },
];

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
  const [submitStatus, setSubmitStatus] = useState('idle');
  const [successAction, setSuccessAction] = useState('saved');

  useEffect(() => {
    if (!isModalOpen) {
      setShowDeleteConfirm(false);
      setSubmitStatus('idle');
      return;
    }

    if (modalMode === 'edit' && editingTask) {
      setTitle(editingTask.title || '');
      setDescription(editingTask.description || '');
      setProjectId(editingTask.projectId || '');
      setAssigneeId(editingTask.assigneeId || '');
      setDueDate(editingTask.dueDate || '');
      setStatus(editingTask.status || 'todo');
      setPriority(editingTask.priority || 'medium');
      setErrors({});
      setSubmitStatus('idle');
    } else {
      setTitle('');
      setDescription('');
      setProjectId(defaultModalProject || (projects[0]?.id ?? ''));
      setAssigneeId(teamMembers[0]?.id ?? '');
      setDueDate(getTodayDateString());
      setStatus(defaultModalStatus || 'todo');
      setPriority('medium');
      setErrors({});
      setSubmitStatus('idle');
    }
  }, [isModalOpen, modalMode, editingTask, defaultModalProject, defaultModalStatus, projects, teamMembers]);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isModalOpen && submitStatus === 'idle') {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, closeModal, submitStatus]);

  if (!isModalOpen) return null;

  const projectOptions = projects.map((p) => ({
    value: p.id,
    label: p.name,
    sublabel: p.category,
  }));

  const assigneeOptions = teamMembers.map((m) => ({
    value: m.id,
    label: m.name,
    sublabel: m.role,
    avatar: m.avatar,
  }));

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
    if (!status) {
      newErrors.status = 'Please select a status';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitStatus !== 'idle') return;
    if (!validate()) return;

    setSubmitStatus('loading');

    setTimeout(() => {
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
        setSuccessAction('created');
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
        setSuccessAction('saved');
      }

      setSubmitStatus('success');

      setTimeout(() => {
        closeModal();
        setSubmitStatus('idle');
      }, 850);
    }, 450);
  };

  const handleDelete = () => {
    if (editingTask && submitStatus === 'idle') {
      setSubmitStatus('loading');
      setTimeout(() => {
        deleteTask(editingTask.id);
        setSuccessAction('deleted');
        setSubmitStatus('success');
        setTimeout(() => {
          closeModal();
          setSubmitStatus('idle');
        }, 750);
      }, 400);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/35 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-hidden"
      onClick={() => submitStatus === 'idle' && closeModal()}
    >
      <div
        className="relative bg-white rounded-[24px] shadow-soft-lg max-w-lg w-full max-h-[96vh] sm:max-h-[90vh] overflow-y-auto no-scrollbar border border-[#EDE7DC] transition-all transform animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {submitStatus === 'success' && (
          <div className="absolute inset-0 z-50 bg-white rounded-[24px] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-150">
            <div className="w-16 h-16 rounded-full bg-[#8FA866]/15 flex items-center justify-center mb-3 animate-pop">
              <svg
                className="w-8 h-8 text-[#587236]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6L9 17l-5-5" className="animate-checkmark" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-[#1B1F1B] animate-in fade-in slide-in-from-bottom-2 duration-300">
              {successAction === 'created'
                ? 'Task Created Successfully!'
                : successAction === 'deleted'
                ? 'Task Deleted!'
                : 'Changes Saved!'}
            </h3>
            <p className="text-xs text-[#747871] mt-1 font-normal animate-in fade-in slide-in-from-bottom-2 duration-300">
              {successAction === 'deleted'
                ? 'The task was removed from your workspace.'
                : 'Workspace deliverables have been updated.'}
            </p>
          </div>
        )}

        <div className="sticky top-0 z-10 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-[#F2ECE1] bg-white/95 backdrop-blur-md">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-[#1B1F1B]">
              {modalMode === 'create' ? 'Create New Task' : 'Edit Task'}
            </h2>
            <p className="text-[11px] sm:text-xs text-[#747871] mt-0.5 font-normal">
              {modalMode === 'create'
                ? 'Fill in the details below to add a deliverable.'
                : 'Update task properties and delivery status.'}
            </p>
          </div>
          <button
            type="button"
            onClick={closeModal}
            disabled={submitStatus !== 'idle'}
            className="p-1.5 text-[#747871] hover:text-[#1B1F1B] hover:bg-[#F4EFE6] rounded-full transition-colors cursor-pointer disabled:opacity-40"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-3 sm:space-y-4">
          <div>
            <label className="block text-[11px] sm:text-xs font-medium text-[#2D322C] mb-1">
              Task Title <span className="text-[#B82B59] font-normal">*</span>
            </label>
            <input
              type="text"
              value={title}
              disabled={submitStatus !== 'idle'}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
              }}
              placeholder="e.g. Conduct accessibility audit on intake form"
              className={`w-full px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm bg-white border ${
                errors.title ? 'border-[#B82B59] ring-1 ring-[#B82B59]' : 'border-[#EDE7DC] hover:border-[#D5CDBD]'
              } rounded-xl text-[#1B1F1B] placeholder-[#9CA3AF] focus:outline-none focus:ring-1 focus:ring-[#1B1F1B] focus:border-[#1B1F1B] transition-all shadow-2xs disabled:opacity-50`}
              autoFocus
            />
            {errors.title && (
              <p className="text-[11px] font-normal text-[#B82B59] mt-0.5 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                {errors.title}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
            <div>
              <label className="block text-[11px] sm:text-xs font-medium text-[#2D322C] mb-1">
                Project <span className="text-[#B82B59] font-normal">*</span>
              </label>
              <CustomSelect
                value={projectId}
                options={projectOptions}
                placeholder="Select Project"
                icon={Folder}
                error={Boolean(errors.projectId)}
                disabled={submitStatus !== 'idle'}
                onChange={(val) => {
                  setProjectId(val);
                  if (errors.projectId) setErrors((prev) => ({ ...prev, projectId: '' }));
                }}
              />
              {errors.projectId && (
                <p className="text-[11px] font-normal text-[#B82B59] mt-0.5 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  {errors.projectId}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[11px] sm:text-xs font-medium text-[#2D322C] mb-1">
                Assignee <span className="text-[#B82B59] font-normal">*</span>
              </label>
              <CustomSelect
                value={assigneeId}
                options={assigneeOptions}
                placeholder="Select Assignee"
                icon={User}
                error={Boolean(errors.assigneeId)}
                disabled={submitStatus !== 'idle'}
                onChange={(val) => {
                  setAssigneeId(val);
                  if (errors.assigneeId) setErrors((prev) => ({ ...prev, assigneeId: '' }));
                }}
              />
              {errors.assigneeId && (
                <p className="text-[11px] font-normal text-[#B82B59] mt-0.5 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  {errors.assigneeId}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
            <div>
              <label className="block text-[11px] sm:text-xs font-medium text-[#2D322C] mb-1">
                Due Date <span className="text-[#B82B59] font-normal">*</span>
              </label>
              <input
                type="date"
                value={dueDate}
                disabled={submitStatus !== 'idle'}
                onChange={(e) => {
                  setDueDate(e.target.value);
                  if (errors.dueDate) setErrors((prev) => ({ ...prev, dueDate: '' }));
                }}
                className={`w-full px-3.5 py-1.5 sm:py-2 text-xs font-normal bg-white border ${
                  errors.dueDate ? 'border-[#B82B59] ring-1 ring-[#B82B59]' : 'border-[#EDE7DC] hover:border-[#D5CDBD]'
                } rounded-full text-[#1B1F1B] focus:outline-none focus:ring-1 focus:ring-[#1B1F1B] focus:border-[#1B1F1B] shadow-2xs transition-all disabled:opacity-50 cursor-pointer`}
              />
              {errors.dueDate && (
                <p className="text-[11px] font-normal text-[#B82B59] mt-0.5 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  {errors.dueDate}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[11px] sm:text-xs font-medium text-[#2D322C] mb-1">
                Priority
              </label>
              <CustomSelect
                value={priority}
                options={PRIORITY_OPTIONS}
                placeholder="Select Priority"
                icon={Flag}
                disabled={submitStatus !== 'idle'}
                onChange={(val) => setPriority(val)}
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] sm:text-xs font-medium text-[#2D322C] mb-1">
              Workflow Status <span className="text-[#B82B59] font-normal">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                disabled={submitStatus !== 'idle'}
                onClick={() => {
                  setStatus('todo');
                  if (errors.status) setErrors((prev) => ({ ...prev, status: '' }));
                }}
                className={`py-1.5 sm:py-2 px-2 sm:px-3 text-xs font-medium rounded-full border text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap min-w-0 ${
                  status === 'todo'
                    ? 'border-[#1B1F1B] bg-[#1B1F1B] text-white shadow-2xs'
                    : 'border-[#EDE7DC] bg-white text-[#555952] hover:bg-[#FAF7F2] hover:text-[#1B1F1B]'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${status === 'todo' ? 'bg-white' : 'bg-[#747871]'}`} />
                <span className="whitespace-nowrap">To Do</span>
              </button>
              <button
                type="button"
                disabled={submitStatus !== 'idle'}
                onClick={() => {
                  setStatus('in-progress');
                  if (errors.status) setErrors((prev) => ({ ...prev, status: '' }));
                }}
                className={`py-1.5 sm:py-2 px-2 sm:px-3 text-xs font-medium rounded-full border text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap min-w-0 ${
                  status === 'in-progress'
                    ? 'border-[#8FA866] bg-[#8FA866] text-white shadow-2xs'
                    : 'border-[#EDE7DC] bg-white text-[#555952] hover:bg-[#FAF7F2] hover:text-[#1B1F1B]'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${status === 'in-progress' ? 'bg-white' : 'bg-[#8FA866]'}`} />
                <span className="whitespace-nowrap">In Progress</span>
              </button>
              <button
                type="button"
                disabled={submitStatus !== 'idle'}
                onClick={() => {
                  setStatus('done');
                  if (errors.status) setErrors((prev) => ({ ...prev, status: '' }));
                }}
                className={`py-1.5 sm:py-2 px-2 sm:px-3 text-xs font-medium rounded-full border text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap min-w-0 ${
                  status === 'done'
                    ? 'border-[#4466B3] bg-[#4466B3] text-white shadow-2xs'
                    : 'border-[#EDE7DC] bg-white text-[#555952] hover:bg-[#FAF7F2] hover:text-[#1B1F1B]'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${status === 'done' ? 'bg-white' : 'bg-[#4466B3]'}`} />
                <span className="whitespace-nowrap">Done</span>
              </button>
            </div>
            {errors.status && (
              <p className="text-[11px] font-normal text-[#B82B59] mt-0.5 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                {errors.status}
              </p>
            )}
          </div>

          <div>
            <label className="block text-[11px] sm:text-xs font-medium text-[#2D322C] mb-1">
              Description <span className="text-[#747871] font-normal">(optional)</span>
            </label>
            <textarea
              rows={2}
              value={description}
              disabled={submitStatus !== 'idle'}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add key deliverables, acceptance criteria, or context..."
              className="w-full px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-normal bg-white border border-[#EDE7DC] hover:border-[#D5CDBD] rounded-xl text-[#1B1F1B] placeholder-[#9CA3AF] focus:outline-none focus:ring-1 focus:ring-[#1B1F1B] focus:border-[#1B1F1B] resize-none no-scrollbar shadow-2xs transition-all disabled:opacity-50"
            />
          </div>

          <div className="pt-2.5 sm:pt-3 border-t border-[#F2ECE1] flex items-center justify-between gap-2">
            {modalMode === 'edit' ? (
              <div>
                {!showDeleteConfirm ? (
                  <button
                    type="button"
                    disabled={submitStatus !== 'idle'}
                    onClick={() => setShowDeleteConfirm(true)}
                    className="inline-flex items-center justify-center gap-1.5 p-1.5 sm:px-3 sm:py-1.5 text-xs font-medium text-[#B82B59] hover:bg-[#FA709A]/15 rounded-full transition-colors cursor-pointer disabled:opacity-40 whitespace-nowrap"
                    title="Delete Task"
                    aria-label="Delete Task"
                  >
                    <Trash2 className="w-4 h-4 sm:w-3.5 sm:h-3.5 shrink-0" />
                    <span className="hidden sm:inline">Delete Task</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <span className="text-xs text-[#B82B59] font-medium whitespace-nowrap hidden sm:inline">Delete task?</span>
                    <button
                      type="button"
                      disabled={submitStatus !== 'idle'}
                      onClick={handleDelete}
                      className="px-2.5 py-1 text-xs font-medium text-white bg-[#B82B59] hover:bg-[#9B2048] rounded-full transition-colors cursor-pointer inline-flex items-center gap-1 whitespace-nowrap"
                    >
                      {submitStatus === 'loading' && <Loader2 className="w-3 h-3 animate-spin shrink-0" />}
                      <span>Confirm</span>
                    </button>
                    <button
                      type="button"
                      disabled={submitStatus !== 'idle'}
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-2 py-1 text-xs font-medium text-[#747871] hover:text-[#1B1F1B] transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Cancel
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
                disabled={submitStatus !== 'idle'}
                className="px-3.5 py-1.5 text-xs font-medium text-[#555952] hover:text-[#1B1F1B] hover:bg-[#F4EFE6] rounded-full transition-colors cursor-pointer disabled:opacity-40 whitespace-nowrap"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitStatus !== 'idle'}
                className={`inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white rounded-full shadow-2xs transition-all cursor-pointer whitespace-nowrap ${
                  submitStatus === 'loading'
                    ? 'bg-[#2D322C] opacity-90 cursor-wait'
                    : submitStatus === 'success'
                    ? 'bg-[#8FA866]'
                    : 'bg-[#1B1F1B] hover:bg-[#2D322C]'
                }`}
              >
                {submitStatus === 'loading' ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>{modalMode === 'create' ? 'Creating...' : 'Saving...'}</span>
                  </>
                ) : submitStatus === 'success' ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>{modalMode === 'create' ? 'Created!' : 'Saved!'}</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>{modalMode === 'create' ? 'Create Task' : 'Save Changes'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
