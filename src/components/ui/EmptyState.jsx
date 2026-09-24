import React from 'react';
import { Inbox } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white/70 rounded-3xl border border-dashed border-[#D8D2C5] w-full">
      <div className="w-12 h-12 rounded-full bg-[#F4EFE6] flex items-center justify-center text-[#747871] mb-3">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-bold text-[#1B1F1B] mb-1">{title}</h3>
      <p className="text-xs text-[#747871] max-w-xs mb-4 font-medium leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          type="button"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-[#1B1F1B] bg-[#F4EFE6] hover:bg-[#EAE4D7] rounded-full transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
