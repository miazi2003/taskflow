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
} from 'lucide-react';
import { useTaskFlow } from '../../context/TaskContext';
import { Avatar, AvatarGroup } from '../ui/Avatar';
import { PriorityBadge, StatusBadge, Badge } from '../ui/Badge';
import { CircularProgress } from '../ui/CircularProgress';
import { SegmentedRadialProgress } from './SegmentedRadialProgress';
import { StatusDropdown } from '../ui/StatusDropdown';
import { formatDisplayDate, isTaskOverdue, isTaskDueSoon } from '../../utils/dateUtils';

export const DashboardView = () => {
  const {
    tasks,
    filteredTasks,
    filters,
    projects,
    teamMembers,
    totalTasksCount,
    overdueTasks,
    dueSoonTasks,
    completedTasksCount,
    inProgressTasksCount,
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

  const inProgressTasks = tasks.filter((t) => t.status === 'in-progress');
  const activeTasks = tasks.filter((t) => t.status !== 'done');

  const featuredCard1 = overdueTasks[0] || activeTasks[0] || tasks[0];
  const featuredCard2 = inProgressTasks[0] || activeTasks[1] || tasks[1];
  const featuredCard3 = overdueTasks[1] || inProgressTasks[1] || activeTasks[2] || tasks[2];

  const upcomingTasks = filters.searchQuery.trim()
    ? filteredTasks
    : [...activeTasks].sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  const projectColors = ['#8FA866', '#FA709A', '#F6D75C', '#9BB4E8'];

  return (
    <div className="space-y-8 w-full font-normal">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
        <div className="lg:col-span-7 bg-[#F7F2EA] rounded-[20px] p-5 sm:p-8 lg:p-10 border border-[#EDE7DC] shadow-soft flex flex-col justify-between">
          <div>
            <h2 className="text-lg sm:text-2xl font-semibold text-[#1B1F1B] tracking-tight">
              Overall progress
            </h2>
          </div>

          <div className="my-auto py-3 sm:py-4 flex items-center justify-center">
            <SegmentedRadialProgress percentage={completionPercentage} />
          </div>
        </div>

        <div className="lg:col-span-5 bg-[#F7F2EA] rounded-[20px] p-5 sm:p-8 lg:p-10 border border-[#EDE7DC] shadow-soft flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-[#1B1F1B] tracking-tight">
              In Progress
            </h2>
            <button
              type="button"
              onClick={() => setActiveTab('projects')}
              className="text-xs font-medium text-[#4466B3] hover:text-[#1B1F1B] transition-colors"
            >
              View All
            </button>
          </div>

          <div className="space-y-3 my-auto">
            {projects.slice(0, 4).map((project, idx) => {
              const projectTasks = tasks.filter((t) => t.projectId === project.id);
              const done = projectTasks.filter((t) => t.status === 'done').length;
              const pct = projectTasks.length > 0 ? Math.round((done / projectTasks.length) * 100) : 0;
              const color = projectColors[idx % projectColors.length];

              return (
                <div
                  key={project.id}
                  onClick={() => filterByProjectAndNavigate(project.id)}
                  className="bg-white rounded-xl p-3.5 border border-[#EDE7DC] hover:border-[#D8D0C0] shadow-2xs hover:shadow-soft transition-all cursor-pointer flex items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <CircularProgress
                      percentage={pct}
                      size={44}
                      strokeWidth={4}
                      color={color}
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-semibold text-[#1B1F1B] truncate group-hover:text-[#4466B3] transition-colors">
                        {project.category || project.name}
                      </h4>
                      <p className="text-xs text-[#747871] truncate font-normal mt-0.5">
                        {project.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featuredCard1 && (
          <div
            onClick={() => openEditModal(featuredCard1)}
            className="bg-[#F7F2EA] rounded-[20px] p-7 sm:p-8 border border-[#EDE7DC] shadow-soft hover:shadow-soft-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-6">
                <div className="flex items-center gap-3">
                  <Avatar member={getMemberById(featuredCard1.assigneeId)} size="sm" />
                  <div>
                    <span className="text-[11px] uppercase font-medium text-[#747871] block leading-none">
                      Created
                    </span>
                    <span className="text-xs font-semibold text-[#1B1F1B] mt-1 block">
                      {getMemberById(featuredCard1.assigneeId)?.name || 'Elena Rostova'}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] uppercase font-medium text-[#747871] block leading-none">
                    Due date
                  </span>
                  <span className={`text-xs font-medium mt-1 block ${isTaskOverdue(featuredCard1.dueDate, featuredCard1.status) ? 'text-[#B82B59]' : 'text-[#1B1F1B]'}`}>
                    {featuredCard1.dueDate}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-semibold text-[#1B1F1B] mb-2">
                  Description
                </h4>
                <p className="text-xs text-[#747871] line-clamp-3 leading-relaxed font-normal">
                  {featuredCard1.description || featuredCard1.title}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#EAE3D5] flex items-center justify-between">
              <span className="text-xs font-medium text-[#1B1F1B]">
                Members ({teamMembers.length})
              </span>
              <AvatarGroup members={teamMembers} max={4} size="xs" />
            </div>
          </div>
        )}

        {featuredCard2 && (
          <div
            onClick={() => openEditModal(featuredCard2)}
            className="bg-[#8FA866] text-white rounded-[20px] p-7 sm:p-8 shadow-soft hover:shadow-soft-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-6">
                <Badge variant="translucent" size="xs">
                  {getProjectById(featuredCard2.projectId)?.category || 'Design'}
                </Badge>
                <span className="text-xs font-medium text-white/90">
                  {formatDisplayDate(featuredCard2.dueDate)}
                </span>
              </div>

              <div className="mb-6">
                <p className="text-sm sm:text-[15px] font-medium text-white leading-relaxed line-clamp-4">
                  {featuredCard2.title}: {featuredCard2.description || 'Adjust the typography scale across all pages to strengthen visual hierarchy and consistency.'}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-white/20 flex items-center justify-between">
              <span className="text-xs font-medium text-white/90">
                {getProjectById(featuredCard2.projectId)?.name}
              </span>
              <AvatarGroup members={teamMembers.slice(0, 4)} max={3} size="xs" overflowLight />
            </div>
          </div>
        )}

        {featuredCard3 && (
          <div
            onClick={() => openEditModal(featuredCard3)}
            className="bg-[#FA709A] text-white rounded-[20px] p-7 sm:p-8 shadow-soft hover:shadow-soft-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-6">
                <Badge variant="translucent" size="xs">
                  {getProjectById(featuredCard3.projectId)?.category || 'Research'}
                </Badge>
                <span className="text-xs font-medium text-white/90">
                  {formatDisplayDate(featuredCard3.dueDate)}
                </span>
              </div>

              <div className="mb-6">
                <p className="text-sm sm:text-[15px] font-medium text-white leading-relaxed line-clamp-4">
                  {featuredCard3.title}: {featuredCard3.description || 'Assemble a curated library of visual references with notes explaining their relevance, effectiveness, and design impact.'}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-white/20 flex items-center justify-between">
              <span className="text-xs font-medium text-white/90">
                {getProjectById(featuredCard3.projectId)?.name}
              </span>
              <AvatarGroup members={teamMembers.slice(1, 5)} max={3} size="xs" overflowLight />
            </div>
          </div>
        )}
      </div>

      <div className="bg-[#F7F2EA] rounded-[20px] p-6 sm:p-10 lg:p-12 border border-[#EDE7DC] shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-[#1B1F1B] tracking-tight">
              Upcoming Deliverables
            </h3>
            <p className="text-xs sm:text-sm text-[#747871] mt-0.5 sm:mt-1 font-normal">
              Active tasks scheduled across team initiatives
            </p>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap sm:flex-nowrap shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('board')}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-medium text-[#1B1F1B] bg-white hover:bg-[#FAF7F2] border border-[#EDE7DC] hover:border-[#D5CDBD] transition-all shadow-2xs whitespace-nowrap rounded-full cursor-pointer shrink-0"
            >
              <span className="whitespace-nowrap">Kanban Board</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </button>
            <button
              type="button"
              onClick={() => openCreateModal()}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-medium text-white bg-[#1B1F1B] hover:bg-[#2D322C] transition-all shadow-2xs whitespace-nowrap rounded-full cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5 shrink-0" />
              <span className="whitespace-nowrap">New Task</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto pb-2">
          <div className="min-w-[1240px] space-y-3">
            <div className="flex items-center gap-5 px-6 text-xs sm:text-[13px] font-medium text-[#747871] uppercase tracking-wider select-none">
              <div className="w-10 text-center shrink-0">No</div>
              <div className="w-24 shrink-0">Priority</div>
              <div className="min-w-[280px] flex-1">Task Title</div>
              <div className="w-48 shrink-0">Project</div>
              <div className="w-48 shrink-0">Assignee</div>
              <div className="w-36 shrink-0">Due Date</div>
              <div className="w-28 shrink-0">Status</div>
              <div className="w-32 shrink-0 text-right">Action</div>
            </div>

            {upcomingTasks.length === 0 ? (
              <div className="bg-white rounded-xl py-12 px-6 text-center border border-[#EDE7DC]">
                <p className="text-sm font-medium text-[#1B1F1B]">No deliverables found</p>
                <p className="text-xs text-[#747871] mt-1 font-normal">
                  No tasks matched &ldquo;{filters.searchQuery}&rdquo;. Try another search term or clear the filter.
                </p>
              </div>
            ) : (
              upcomingTasks.slice(0, 10).map((task, idx) => {
                const project = getProjectById(task.projectId);
                const assignee = getMemberById(task.assigneeId);
                const overdue = isTaskOverdue(task.dueDate, task.status);
                const dueSoon = isTaskDueSoon(task.dueDate, task.status, 3);

                return (
                  <div
                    key={task.id}
                    onClick={() => openEditModal(task)}
                    className="bg-white rounded-xl px-6 py-4.5 border border-[#EDE7DC] hover:border-[#D5CDBD] shadow-2xs hover:shadow-soft transition-all duration-150 cursor-pointer group flex items-center gap-5 min-h-[68px]"
                  >
                    <div className="w-10 text-center shrink-0 font-normal text-sm sm:text-base text-[#747871]">
                      {idx + 1}
                    </div>

                    <div className="w-24 shrink-0">
                      <PriorityBadge priority={task.priority} size="xs" />
                    </div>

                    <div className="min-w-[280px] flex-1 min-w-0 pr-3">
                      <span className="font-medium text-sm sm:text-[15px] text-[#2D322C] group-hover:text-[#4466B3] transition-colors truncate block" title={task.title}>
                        {task.title}
                      </span>
                    </div>

                    <div className="w-48 shrink-0 min-w-0">
                      <span className="text-sm text-[#555952] font-normal truncate block" title={project?.name}>
                        {project?.name}
                      </span>
                    </div>

                    <div className="w-48 shrink-0 min-w-0">
                      <Avatar member={assignee} size="xs" showName />
                    </div>

                    <div className="w-36 shrink-0">
                      <span
                        className={`inline-flex items-center gap-2 text-sm font-normal ${
                          overdue
                            ? 'text-[#B82B59]'
                            : dueSoon
                            ? 'text-[#7E6707]'
                            : 'text-[#555952]'
                        }`}
                      >
                        <Calendar className="w-4 h-4 shrink-0 text-[#747871]" />
                        <span>{formatDisplayDate(task.dueDate)}</span>
                      </span>
                    </div>

                    <div className="w-28 shrink-0">
                      <span className="text-sm font-normal text-[#555952]">
                        {task.status === 'in-progress' ? 'In Progress' : task.status === 'done' ? 'Done' : 'To Do'}
                      </span>
                    </div>

                    <div
                      className="w-32 shrink-0 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <StatusDropdown
                        status={task.status}
                        direction="down"
                        onChange={(newStatus) => moveTaskStatus(task.id, newStatus)}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
