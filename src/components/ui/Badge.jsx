import React from 'react';

export const Badge = ({ children, variant = 'default', size = 'sm' }) => {
  const variantStyles = {
    default: 'bg-[#F2ECE1] text-[#3D423C]',
    olive: 'bg-[#8FA866]/18 text-[#4E662F]',
    pink: 'bg-[#FA709A]/18 text-[#B82B59]',
    blue: 'bg-[#9BB4E8]/25 text-[#3054A3]',
    yellow: 'bg-[#F6D75C]/35 text-[#7E6707]',
    translucent: 'bg-black/15 text-white',
    urgent: 'bg-[#FA709A]/18 text-[#B82B59]',
    success: 'bg-[#8FA866]/18 text-[#4E662F]',
  };

  const sizeStyles = {
    xs: 'text-xs px-3 py-1 font-medium',
    sm: 'text-xs sm:text-sm px-3.5 py-1.5 font-medium',
    md: 'text-sm sm:text-base px-4 py-2 font-medium',
  };

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full ${variantStyles[variant] || variantStyles.default} ${sizeStyles[size] || sizeStyles.sm} tracking-normal select-none`}
    >
      {children}
    </span>
  );
};

export const PriorityBadge = ({ priority, size = 'sm' }) => {
  const configs = {
    low: { label: 'Low', variant: 'default' },
    medium: { label: 'Medium', variant: 'blue' },
    high: { label: 'High', variant: 'yellow' },
    urgent: { label: 'Urgent', variant: 'pink' },
  };

  const config = configs[priority] || configs.medium;

  return (
    <Badge variant={config.variant} size={size}>
      {config.label}
    </Badge>
  );
};

export const StatusBadge = ({ status, size = 'sm' }) => {
  const configs = {
    todo: { label: 'To Do', variant: 'default' },
    'in-progress': { label: 'In Progress', variant: 'olive' },
    done: { label: 'Done', variant: 'success' },
  };

  const config = configs[status] || configs.todo;

  return (
    <Badge variant={config.variant} size={size}>
      {config.label}
    </Badge>
  );
};
