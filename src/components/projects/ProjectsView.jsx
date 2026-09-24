import React from 'react';
import { Plus, ArrowRight } from 'lucide-react';
import { useTaskFlow } from '../../context/TaskContext';
import { AvatarGroup } from '../ui/Avatar';
import { CircularProgress } from '../ui/CircularProgress';
import { Badge } from '../ui/Badge';

export const ProjectsView = () => {
  const {
    projects,
    tasks,
    teamMembers,
    filters,
    openCreateModal,
    filterByProjectAndNavigate,
  } = useTaskFlow();

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Fintech':
        return '#9BB4E8';
      case 'E-Commerce':
        return '#8FA866';
      case 'Healthcare':
        return '#FA709A';
      case 'SaaS / DevTools':
        return '#F6D75C';
      default:
        return '#8FA866';
    }
  };

  const displayedProjects = projects.filter((project) => {
    if (!filters.searchQuery.trim()) return true;
    const q = filters.searchQuery.toLowerCase().trim();
    const nameMatch = project.name.toLowerCase().includes(q);
    const descMatch = project.description.toLowerCase().includes(q);
    const clientMatch = project.client.toLowerCase().includes(q);
    const catMatch = project.category.toLowerCase().includes(q);
    const hasMatchingTask = tasks.some(
      (t) =>
        t.projectId === project.id &&
        (t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q))
    );
    return nameMatch || descMatch || clientMatch || catMatch || hasMatchingTask;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-[#1B1F1B]">
            Projects Overview
          </h1>
          <p className="text-xs sm:text-sm text-[#747871] mt-0.5 max-w-xl font-normal">
            Manage active client engagements, monitor completion velocity, and balance team workloads across all initiatives.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => openCreateModal()}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium bg-[#1B1F1B] hover:bg-[#2D322C] text-white rounded-full transition-all shadow-2xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayedProjects.length === 0 ? (
          <div className="bg-white rounded-[20px] p-12 text-center border border-[#EDE7DC] col-span-full">
            <p className="text-sm font-medium text-[#1B1F1B]">No projects found</p>
            <p className="text-xs text-[#747871] mt-1 font-normal">
              No initiatives matched &ldquo;{filters.searchQuery}&rdquo;. Try another search term.
            </p>
          </div>
        ) : (
          displayedProjects.map((project) => {
          const projectTasks = tasks.filter((t) => t.projectId === project.id);
          const doneCount = projectTasks.filter((t) => t.status === 'done').length;
          const inProgressCount = projectTasks.filter((t) => t.status === 'in-progress').length;
          const todoCount = projectTasks.filter((t) => t.status === 'todo').length;
          const percentage = projectTasks.length > 0 ? Math.round((doneCount / projectTasks.length) * 100) : 0;

          const assignedMemberIds = Array.from(new Set(projectTasks.map((t) => t.assigneeId)));
          const assignedMembers = assignedMemberIds
            .map((id) => teamMembers.find((m) => m.id === id))
            .filter(Boolean);

          const catColor = getCategoryColor(project.category);

          return (
            <div
              key={project.id}
              className="bg-white rounded-[20px] p-6 border border-[#EDE7DC] hover:border-[#D0C8B8] shadow-2xs hover:shadow-soft transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="default" size="xs">
                        {project.code}
                      </Badge>
                      <span
                        className="text-xs font-medium px-2.5 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${catColor}25`,
                          color: '#1B1F1B',
                        }}
                      >
                        {project.category}
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-[#1B1F1B]">
                      {project.name}
                    </h3>
                    <p className="text-xs font-normal text-[#747871] mt-0.5">
                      Client: {project.client}
                    </p>
                  </div>

                  <CircularProgress
                    percentage={percentage}
                    size={54}
                    strokeWidth={4.5}
                    color={catColor}
                  />
                </div>

                <p className="text-xs sm:text-[13px] text-[#555952] leading-relaxed mb-6 font-normal">
                  {project.description}
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-[#F2ECE1]">
                <div className="flex items-center justify-between text-xs font-medium text-[#747871]">
                  <span>Workload Breakdown</span>
                  <span className="text-[#1B1F1B]">
                    {todoCount} To Do • {inProgressCount} In Progress • {doneCount} Done
                  </span>
                </div>

                <div className="w-full bg-[#F4EFE6] rounded-full h-2 overflow-hidden flex">
                  <div
                    className="h-full transition-all duration-500"
                    style={{
                      width: `${projectTasks.length > 0 ? (doneCount / projectTasks.length) * 100 : 0}%`,
                      backgroundColor: catColor,
                    }}
                  />
                  <div
                    className="h-full bg-[#1B1F1B]/30 transition-all duration-500"
                    style={{
                      width: `${projectTasks.length > 0 ? (inProgressCount / projectTasks.length) * 100 : 0}%`,
                    }}
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <AvatarGroup members={assignedMembers} max={4} size="xs" />
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openCreateModal(project.id)}
                      className="px-3.5 py-1.5 rounded-full text-xs font-medium text-[#1B1F1B] bg-[#F4EFE6] hover:bg-[#EAE4D7] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Task
                    </button>
                    <button
                      type="button"
                      onClick={() => filterByProjectAndNavigate(project.id)}
                      className="px-3.5 py-1.5 rounded-full text-xs font-medium text-white bg-[#1B1F1B] hover:bg-[#2D322C] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Board</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        }))}
      </div>
    </div>
  );
};
