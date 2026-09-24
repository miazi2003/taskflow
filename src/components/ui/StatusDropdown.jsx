import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const STATUS_OPTIONS = [
  { id: 'todo', label: 'To Do', color: '#747871' },
  { id: 'in-progress', label: 'In Progress', color: '#8FA866' },
  { id: 'done', label: 'Done', color: '#4466B3' },
];

export const StatusDropdown = ({ status, onChange, direction = 'up' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentOption = STATUS_OPTIONS.find((opt) => opt.id === status) || STATUS_OPTIONS[0];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (optionId, e) => {
    e.stopPropagation();
    onChange(optionId);
    setIsOpen(false);
  };

  const isUp = direction === 'up';

  return (
    <div
      className={`relative inline-block text-left select-none ${isOpen ? 'z-50' : 'z-10'}`}
      ref={dropdownRef}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-[#1B1F1B] bg-transparent hover:bg-[#F4EFE6] border border-[#EDE7DC] hover:border-[#D5CDBD] rounded-full transition-all cursor-pointer"
      >
        <span>{currentOption.label}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-[#747871] transition-transform duration-200 ${
            isOpen ? (isUp ? 'rotate-0' : 'rotate-180') : (isUp ? 'rotate-180' : 'rotate-0')
          }`}
        />
      </button>

      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className={`absolute right-0 z-[100] w-36 bg-white rounded-2xl shadow-soft-lg border border-[#EDE7DC] p-1.5 transition-all ${
            isUp
              ? 'bottom-full mb-1.5 origin-bottom-right animate-dropdown-in-up'
              : 'top-full mt-1.5 origin-top-right animate-dropdown-in'
          }`}
        >
          {STATUS_OPTIONS.map((opt) => {
            const isSelected = opt.id === status;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={(e) => handleSelect(opt.id, e)}
                className={`w-full text-left px-3 py-2 text-xs font-medium rounded-xl flex items-center justify-between transition-colors ${
                  isSelected
                    ? 'bg-[#F4EFE6] text-[#1B1F1B]'
                    : 'text-[#555952] hover:bg-[#FAF7F2] hover:text-[#1B1F1B]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: opt.color }}
                  />
                  <span>{opt.label}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#1B1F1B]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
