import React, { useState } from 'react';

export const Avatar = ({ member, size = 'sm', showName = false, border = false, light = false }) => {
  const [imageError, setImageError] = useState(false);

  if (!member) {
    return (
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-[#EFE9DE] text-[#747871] flex items-center justify-center text-xs font-medium shrink-0">
          ?
        </div>
        {showName && <span className="text-sm font-normal text-[#747871]">Unassigned</span>}
      </div>
    );
  }

  const sizeClasses = {
    xs: 'w-8 h-8 text-xs',
    sm: 'w-9 h-9 text-xs',
    md: 'w-11 h-11 text-sm',
    lg: 'w-14 h-14 text-base',
  };

  const hasAvatar = member.avatar && !imageError;

  return (
    <div className="flex items-center gap-3 min-w-0">
      <div
        className={`${sizeClasses[size] || sizeClasses.sm} rounded-full overflow-hidden flex items-center justify-center font-medium text-white shadow-2xs shrink-0 select-none ${
          border ? 'ring-2 ring-white' : 'ring-1 ring-[#EDE7DC]'
        }`}
        style={{ backgroundColor: member.color || '#8FA866' }}
        title={`${member.name} (${member.role})`}
      >
        {hasAvatar ? (
          <img
            src={member.avatar}
            alt={member.name}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover rounded-full"
            loading="lazy"
          />
        ) : (
          <span>{member.initials}</span>
        )}
      </div>
      {showName && (
        <div className="min-w-0">
          <p className={`text-sm font-medium truncate ${light ? 'text-white' : 'text-[#2D322C]'}`}>
            {member.name}
          </p>
          <p className={`text-xs font-normal truncate ${light ? 'text-white/70' : 'text-[#747871]'}`}>
            {member.role}
          </p>
        </div>
      )}
    </div>
  );
};

export const AvatarGroup = ({ members = [], max = 4, size = 'xs', overflowLight = false }) => {
  const visible = members.slice(0, max);
  const remaining = members.length - max;

  return (
    <div className="flex items-center -space-x-2">
      {visible.map((member, idx) => (
        <div key={member?.id || idx} className="ring-2 ring-white rounded-full">
          <Avatar member={member} size={size} border />
        </div>
      ))}
      {remaining > 0 && (
        <span
          className={`w-8 h-8 rounded-full text-xs font-medium flex items-center justify-center ring-2 ring-white ${
            overflowLight
              ? 'bg-black/20 text-white'
              : 'bg-[#EFE9DE] text-[#2D322C]'
          }`}
        >
          +{remaining}
        </span>
      )}
    </div>
  );
};
