import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { INITIAL_MEMBERS, INITIAL_PROJECTS, INITIAL_TASKS } from '../data/mockData';
import { isTaskOverdue, isTaskDueSoon } from '../utils/dateUtils';

const STORAGE_KEY_TASKS = 'taskflow_tasks_data';
const STORAGE_KEY_PROJECTS = 'taskflow_projects_data';

const initialFilterState = {
  searchQuery: '',
  projectId: 'all',
  assigneeId: 'all',
  status: 'all',
  priority: 'all',
};

const TaskContext = createContext(null);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TASKS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      return INITIAL_TASKS;
    }
    return INITIAL_TASKS;
  });

  const [projects] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROJECTS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      return INITIAL_PROJECTS;
    }
    return INITIAL_PROJECTS;
  });

  const [teamMembers] = useState(INITIAL_MEMBERS);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [filters, setFilters] = useState(initialFilterState);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [editingTask, setEditingTask] = useState(null);
  const [defaultModalProject, setDefaultModalProject] = useState(undefined);
  const [defaultModalStatus, setDefaultModalStatus] = useState(undefined);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
    } catch {
      
    }
  }, [tasks]);

  const getProjectById = (id) => {
    return projects.find((p) => p.id === id);
  };

  const getMemberById = (id) => {
    return teamMembers.find((m) => m.id === id);
  };

  const updateFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value ?? 'all',
    }));
  };

  const resetFilters = () => {
    setFilters(initialFilterState);
  };

  const createTask = (taskData) => {
    const newTask = {
      ...taskData,
      id: `tsk-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  };

  const updateTask = (id, updates) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updates } : task))
    );
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const moveTaskStatus = (id, newStatus) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, status: newStatus } : task))
    );
  };

  const openCreateModal = (projectId, status) => {
    setModalMode('create');
    setEditingTask(null);
    setDefaultModalProject(projectId);
    setDefaultModalStatus(status);
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setModalMode('edit');
    setEditingTask(task);
    setDefaultModalProject(task.projectId);
    setDefaultModalStatus(task.status);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
    setDefaultModalProject(undefined);
    setDefaultModalStatus(undefined);
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase().trim();
        const titleMatch = task.title.toLowerCase().includes(query);
        const descMatch = task.description?.toLowerCase().includes(query) ?? false;
        const project = getProjectById(task.projectId);
        const projectMatch = project?.name.toLowerCase().includes(query) ?? false;
        const member = getMemberById(task.assigneeId);
        const memberMatch = member?.name.toLowerCase().includes(query) ?? false;

        if (!titleMatch && !descMatch && !projectMatch && !memberMatch) {
          return false;
        }
      }

      if (filters.projectId && filters.projectId !== 'all') {
        if (task.projectId !== filters.projectId) return false;
      }

      if (filters.assigneeId && filters.assigneeId !== 'all') {
        if (task.assigneeId !== filters.assigneeId) return false;
      }

      if (filters.status && filters.status !== 'all') {
        if (task.status !== filters.status) return false;
      }

      if (filters.priority && filters.priority !== 'all') {
        if (task.priority !== filters.priority) return false;
      }

      return true;
    });
  }, [tasks, filters, projects, teamMembers]);

  const overdueTasks = useMemo(() => {
    return tasks.filter((t) => isTaskOverdue(t.dueDate, t.status));
  }, [tasks]);

  const dueSoonTasks = useMemo(() => {
    return tasks.filter((t) => isTaskDueSoon(t.dueDate, t.status, 3));
  }, [tasks]);

  const totalTasksCount = tasks.length;
  const completedTasksCount = tasks.filter((t) => t.status === 'done').length;
  const inProgressTasksCount = tasks.filter((t) => t.status === 'in-progress').length;
  const todoTasksCount = tasks.filter((t) => t.status === 'todo').length;
  const activeProjectsCount = projects.filter((p) => p.status === 'Active').length;

  const filterByProjectAndNavigate = (projectId) => {
    setFilters({
      ...initialFilterState,
      projectId,
    });
    setActiveTab('board');
  };

  const resetAllData = () => {
    setTasks(INITIAL_TASKS);
    setFilters(initialFilterState);
    localStorage.removeItem(STORAGE_KEY_TASKS);
    localStorage.removeItem(STORAGE_KEY_PROJECTS);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        projects,
        teamMembers,
        activeTab,
        setActiveTab,
        filters,
        setFilters,
        updateFilter,
        resetFilters,
        createTask,
        addTask: createTask,
        updateTask,
        deleteTask,
        moveTaskStatus,
        isModalOpen,
        modalMode,
        editingTask,
        defaultModalProject,
        defaultModalStatus,
        openCreateModal,
        openEditModal,
        closeModal,
        getProjectById,
        getMemberById,
        filteredTasks,
        totalTasksCount,
        overdueTasks,
        dueSoonTasks,
        completedTasksCount,
        inProgressTasksCount,
        todoTasksCount,
        activeProjectsCount,
        filterByProjectAndNavigate,
        resetAllData,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskFlow = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskFlow must be used within a TaskProvider');
  }
  return context;
};
