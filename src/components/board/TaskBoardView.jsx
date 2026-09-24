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
  SlidersHorizontal,
  Folder,
  User,
  Flag,
  Check,
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
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [expandedFilter, setExpandedFilter] = useState(null);

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
    <div className="space-y-6 w-full">
      <div className="border-b border-[#EDE7DC]/80 pb-3">
        <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar">
          {statusTabs.map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => updateFilter('status', tab.id)}
                className={`flex items-center gap-1.5 sm:gap-2 pb-1 text-xs sm:text-sm whitespace-nowrap transition-all relative cursor-pointer shrink-0 ${
                  isActive
                    ? 'text-[#1B1F1B] font-semibold border-b-2 border-[#1B1F1B]'
                    : 'text-[#747871] hover:text-[#1B1F1B] font-normal border-b-2 border-transparent'
                }`}
              >
                <span className="whitespace-nowrap">{tab.label}</span>
                <span
                  className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-normal whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-[#EFE9DF] text-[#1B1F1B] font-medium'
                      : 'bg-[#FAF7F2] text-[#747871]'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() =>
              openCreateModal(
                filters.projectId !== 'all' ? filters.projectId : undefined,
                currentTab !== 'all' ? currentTab : undefined
              )
            }
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-medium bg-[#1B1F1B] hover:bg-[#2D322C] text-white rounded-full transition-all shadow-2xs cursor-pointer whitespace-nowrap shrink-0"
          >
            <Plus className="w-3.5 h-3.5 shrink-0" />
            <span className="whitespace-nowrap">New Task</span>
          </button>

          <div className="flex items-center gap-2 sm:gap-2.5 flex-1 justify-end min-w-0">
            <div className="relative flex-1 max-w-[180px] sm:max-w-xs min-w-[110px]">
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
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#747871] hover:text-[#1B1F1B] cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="relative md:hidden">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border transition-all cursor-pointer whitespace-nowrap shadow-2xs ${
                  mobileFilterOpen || (filters.projectId !== 'all' || filters.assigneeId !== 'all' || filters.priority !== 'all')
                    ? 'border-[#1B1F1B] bg-[#1B1F1B] text-white'
                    : 'border-[#EDE7DC] bg-white text-[#2D322C] hover:bg-[#FAF7F2]'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5 shrink-0" />
                <span>Filters</span>
                {(filters.projectId !== 'all' || filters.assigneeId !== 'all' || filters.priority !== 'all') && (
                  <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold ${
                    mobileFilterOpen || (filters.projectId !== 'all' || filters.assigneeId !== 'all' || filters.priority !== 'all')
                      ? 'bg-white text-[#1B1F1B]'
                      : 'bg-[#1B1F1B] text-white'
                  }`}>
                    {(filters.projectId !== 'all' ? 1 : 0) + (filters.assigneeId !== 'all' ? 1 : 0) + (filters.priority !== 'all' ? 1 : 0)}
                  </span>
                )}
              </button>

              {mobileFilterOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => {
                      setMobileFilterOpen(false);
                      setExpandedFilter(null);
                    }}
                  />
                  <div className="absolute right-0 top-full mt-2 z-50 w-[290px] sm:w-[320px] bg-white rounded-2xl border border-[#EDE7DC] p-3 shadow-soft-lg space-y-2 animate-dropdown-in">
                    <div className="flex items-center justify-between px-1 pb-1.5 border-b border-[#F2ECE1]">
                      <span className="text-xs font-semibold text-[#1B1F1B]">Filter Tasks</span>
                      {(filters.projectId !== 'all' || filters.assigneeId !== 'all' || filters.priority !== 'all') && (
                        <button
                          type="button"
                          onClick={() => resetFilters()}
                          className="text-[11px] font-medium text-[#B82B59] hover:underline cursor-pointer"
                        >
                          Clear All
                        </button>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <div className="border border-[#EDE7DC] rounded-xl overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setExpandedFilter(expandedFilter === 'project' ? null : 'project')}
                          className="w-full flex items-center justify-between p-2.5 text-xs text-[#1B1F1B] bg-[#FAF7F2] hover:bg-[#F4EFE6] transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <Folder className="w-3.5 h-3.5 text-[#747871] shrink-0" />
                            <span className="font-medium text-[#555952]">Project:</span>
                            <span className="font-semibold truncate text-[#1B1F1B]">
                              {filters.projectId === 'all' ? 'All Projects' : projects.find((p) => p.id === filters.projectId)?.name || 'All Projects'}
                            </span>
                          </div>
                          <ChevronDown className={`w-3.5 h-3.5 text-[#747871] shrink-0 transition-transform duration-200 ${expandedFilter === 'project' ? 'rotate-180' : ''}`} />
                        </button>
                        {expandedFilter === 'project' && (
                          <div className="p-1 space-y-0.5 bg-white max-h-48 overflow-y-auto no-scrollbar border-t border-[#F2ECE1] animate-accordion-in">
                            {[{ value: 'all', label: 'All Projects' }, ...projects.map((p) => ({ value: p.id, label: p.name }))].map((opt) => {
                              const isSelected = filters.projectId === opt.value;
                              return (
                                <button
                                  key={opt.value}
                                  type="button"
                                  onClick={() => {
                                    updateFilter('projectId', opt.value);
                                    setExpandedFilter(null);
                                  }}
                                  className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-colors cursor-pointer ${
                                    isSelected ? 'bg-[#F4EFE6] text-[#1B1F1B] font-semibold' : 'text-[#555952] hover:bg-[#FAF7F2]'
                                  }`}
                                >
                                  <span className="truncate">{opt.label}</span>
                                  {isSelected && <Check className="w-3.5 h-3.5 text-[#1B1F1B] shrink-0" />}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      <div className="border border-[#EDE7DC] rounded-xl overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setExpandedFilter(expandedFilter === 'assignee' ? null : 'assignee')}
                          className="w-full flex items-center justify-between p-2.5 text-xs text-[#1B1F1B] bg-[#FAF7F2] hover:bg-[#F4EFE6] transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <User className="w-3.5 h-3.5 text-[#747871] shrink-0" />
                            <span className="font-medium text-[#555952]">Assignee:</span>
                            <span className="font-semibold truncate text-[#1B1F1B]">
                              {filters.assigneeId === 'all' ? 'All Assignees' : teamMembers.find((m) => m.id === filters.assigneeId)?.name || 'All Assignees'}
                            </span>
                          </div>
                          <ChevronDown className={`w-3.5 h-3.5 text-[#747871] shrink-0 transition-transform duration-200 ${expandedFilter === 'assignee' ? 'rotate-180' : ''}`} />
                        </button>
                        {expandedFilter === 'assignee' && (
                          <div className="p-1 space-y-0.5 bg-white max-h-48 overflow-y-auto no-scrollbar border-t border-[#F2ECE1] animate-accordion-in">
                            {[{ value: 'all', label: 'All Assignees' }, ...teamMembers.map((m) => ({ value: m.id, label: m.name, avatar: m.avatar }))].map((opt) => {
                              const isSelected = filters.assigneeId === opt.value;
                              return (
                                <button
                                  key={opt.value}
                                  type="button"
                                  onClick={() => {
                                    updateFilter('assigneeId', opt.value);
                                    setExpandedFilter(null);
                                  }}
                                  className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-colors cursor-pointer ${
                                    isSelected ? 'bg-[#F4EFE6] text-[#1B1F1B] font-semibold' : 'text-[#555952] hover:bg-[#FAF7F2]'
                                  }`}
                                >
                                  <div className="flex items-center gap-2 truncate">
                                    {opt.avatar && <img src={opt.avatar} alt="" className="w-4 h-4 rounded-full object-cover shrink-0" />}
                                    <span className="truncate">{opt.label}</span>
                                  </div>
                                  {isSelected && <Check className="w-3.5 h-3.5 text-[#1B1F1B] shrink-0" />}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      <div className="border border-[#EDE7DC] rounded-xl overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setExpandedFilter(expandedFilter === 'priority' ? null : 'priority')}
                          className="w-full flex items-center justify-between p-2.5 text-xs text-[#1B1F1B] bg-[#FAF7F2] hover:bg-[#F4EFE6] transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <Flag className="w-3.5 h-3.5 text-[#747871] shrink-0" />
                            <span className="font-medium text-[#555952]">Priority:</span>
                            <span className="font-semibold truncate text-[#1B1F1B]">
                              {filters.priority === 'all' ? 'All Priorities' : filters.priority ? filters.priority.charAt(0).toUpperCase() + filters.priority.slice(1) : 'All Priorities'}
                            </span>
                          </div>
                          <ChevronDown className={`w-3.5 h-3.5 text-[#747871] shrink-0 transition-transform duration-200 ${expandedFilter === 'priority' ? 'rotate-180' : ''}`} />
                        </button>
                        {expandedFilter === 'priority' && (
                          <div className="p-1 space-y-0.5 bg-white max-h-48 overflow-y-auto no-scrollbar border-t border-[#F2ECE1] animate-accordion-in">
                            {[
                              { value: 'all', label: 'All Priorities' },
                              { value: 'urgent', label: 'Urgent', color: '#FA709A' },
                              { value: 'high', label: 'High Priority', color: '#E5A800' },
                              { value: 'medium', label: 'Medium Priority', color: '#4466B3' },
                              { value: 'low', label: 'Low Priority', color: '#747871' },
                            ].map((opt) => {
                              const isSelected = (filters.priority || 'all') === opt.value;
                              return (
                                <button
                                  key={opt.value}
                                  type="button"
                                  onClick={() => {
                                    updateFilter('priority', opt.value);
                                    setExpandedFilter(null);
                                  }}
                                  className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-colors cursor-pointer ${
                                    isSelected ? 'bg-[#F4EFE6] text-[#1B1F1B] font-semibold' : 'text-[#555952] hover:bg-[#FAF7F2]'
                                  }`}
                                >
                                  <div className="flex items-center gap-2 truncate">
                                    {opt.color && <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: opt.color }} />}
                                    <span className="truncate">{opt.label}</span>
                                  </div>
                                  {isSelected && <Check className="w-3.5 h-3.5 text-[#1B1F1B] shrink-0" />}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="hidden md:flex items-center gap-2.5">
              <CustomSelect
                value={filters.projectId}
                onChange={(val) => updateFilter('projectId', val)}
                options={[
                  { value: 'all', label: 'All Projects' },
                  ...projects.map((p) => ({ value: p.id, label: p.name })),
                ]}
                icon={Folder}
                className="w-[145px]"
                menuWidth="w-56"
              />

              <CustomSelect
                value={filters.assigneeId}
                onChange={(val) => updateFilter('assigneeId', val)}
                options={[
                  { value: 'all', label: 'All Assignees' },
                  ...teamMembers.map((m) => ({
                    value: m.id,
                    label: m.name,
                    avatar: m.avatar,
                  })),
                ]}
                icon={User}
                className="w-[145px]"
                menuWidth="w-56"
              />

              <CustomSelect
                value={filters.priority}
                onChange={(val) => updateFilter('priority', val)}
                options={[
                  { value: 'all', label: 'All Priorities' },
                  { value: 'urgent', label: 'Urgent', color: '#FA709A' },
                  { value: 'high', label: 'High Priority', color: '#E5A800' },
                  { value: 'medium', label: 'Medium Priority', color: '#4466B3' },
                  { value: 'low', label: 'Low Priority', color: '#747871' },
                ]}
                icon={Flag}
                className="w-[140px]"
                menuWidth="w-48"
              />

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1 text-xs font-normal text-[#747871] hover:text-[#1B1F1B] px-2 py-1 rounded-full hover:bg-[#EFE9DF]/50 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <X className="w-3.5 h-3.5 shrink-0" />
                  <span className="whitespace-nowrap">Clear</span>
                </button>
              )}

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowMoreMenu(!showMoreMenu)}
                  className="w-8 h-8 rounded-full border border-[#EDE7DC] bg-white hover:bg-[#FAF7F2] text-[#2D322C] flex items-center justify-center transition-colors shadow-2xs cursor-pointer shrink-0"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>

                {showMoreMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowMoreMenu(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl border border-[#EDE7DC] shadow-soft-lg p-1.5 z-50 animate-dropdown-in">
                      <button
                        type="button"
                        onClick={() => {
                          resetFilters();
                          setShowMoreMenu(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-[#2D322C] hover:bg-[#FAF7F2] rounded-xl transition-colors cursor-pointer"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
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
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-normal text-[#747871] hover:text-[#1B1F1B] hover:bg-[#EFE9DF]/60 rounded-full transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Plus className="w-3.5 h-3.5 shrink-0" />
                  <span className="whitespace-nowrap">Add Task</span>
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
        })
      )}
      </div>
    </div>
  );
};
