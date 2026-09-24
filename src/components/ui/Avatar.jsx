import React from 'react';

export const Avatar = ({ member, size = 'sm', showName = false }) => {
  if (!member) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-medium">
          ?
        </div>
        {showName && <span className="text-sm text-slate-500">Unassigned</span>}
      </div>
    );
  }

  const sizeClasses = {
    xs: 'w-5 h-5 text-[10px]',
    sm: 'w-7 h-7 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
  };

  return (
    <div className="flex items-center gap-2">
      <div
        className={`${sizeClasses[size] || sizeClasses.sm} rounded-full flex items-center justify-center font-semibold text-white shadow-xs shrink-0 select-none`}
        style={{ backgroundColor: member.color }}
        title={`${member.name} (${member.role})`}
      >
        {member.initials}
      </div>
      {showName && (
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-800 truncate">{member.name}</p>
          <p className="text-xs text-slate-500 truncate">{member.role}</p>
        </div>
      )}
    </div>
  );
};
