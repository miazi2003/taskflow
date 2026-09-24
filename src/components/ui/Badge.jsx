import React from 'react';

export const Badge = ({ children, variant = 'default', size = 'sm', dot = false }) => {
  const variantStyles = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    primary: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    info: 'bg-sky-50 text-sky-700 border-sky-200',
    neutral: 'bg-slate-50 text-slate-600 border-slate-200',
  };

  const dotColors = {
    default: 'bg-slate-400',
    primary: 'bg-indigo-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
    info: 'bg-sky-500',
    neutral: 'bg-slate-400',
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-medium',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border ${variantStyles[variant] || variantStyles.default} ${sizeStyles[size] || sizeStyles.sm}`}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant] || dotColors.default}`} />
      )}
      {children}
    </span>
  );
};

export const PriorityBadge = ({ priority }) => {
  const configs = {
    low: { label: 'Low', variant: 'neutral' },
    medium: { label: 'Medium', variant: 'info' },
    high: { label: 'High', variant: 'warning' },
    urgent: { label: 'Urgent', variant: 'danger' },
  };

  const config = configs[priority] || configs.medium;

  return (
    <Badge variant={config.variant} dot>
      {config.label}
    </Badge>
  );
};

export const StatusBadge = ({ status }) => {
  const configs = {
    todo: { label: 'To Do', variant: 'default' },
    'in-progress': { label: 'In Progress', variant: 'primary' },
    done: { label: 'Done', variant: 'success' },
  };

  const config = configs[status] || configs.todo;

  return (
    <Badge variant={config.variant} dot>
      {config.label}
    </Badge>
  );
};
