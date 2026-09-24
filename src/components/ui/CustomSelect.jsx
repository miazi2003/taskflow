import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export const CustomSelect = ({
  value,
  onChange,
  options = [],
  placeholder = 'Select option',
  icon: Icon,
  direction = 'down',
  disabled = false,
  error = false,
  className = 'w-full',
  triggerClassName = '',
  menuWidth = 'w-full min-w-[200px]',
  align = 'left',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption = options.find((opt) => String(opt.value) === String(value));

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

  const handleSelect = (val, e) => {
    e.stopPropagation();
    onChange(val);
    setIsOpen(false);
  };

  const isUp = direction === 'up';

  return (
    <div
      ref={dropdownRef}
      className={`relative select-none ${className} ${isOpen ? 'z-50' : 'z-10'}`}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={(e) => {
          e.stopPropagation();
          if (!disabled) setIsOpen(!isOpen);
        }}
        className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-xs font-normal text-[#1B1F1B] bg-white border ${
          error
            ? 'border-[#B82B59] ring-1 ring-[#B82B59]'
            : isOpen
            ? 'border-[#1B1F1B]'
            : 'border-[#EDE7DC] hover:border-[#D5CDBD]'
        } rounded-full transition-all duration-150 cursor-pointer shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed ${triggerClassName}`}
      >
        <div className="flex items-center gap-2 min-w-0 truncate">
          {Icon && (
            <span className="text-[#747871] shrink-0">
              <Icon className="w-3.5 h-3.5" />
            </span>
          )}
          {selectedOption?.renderSelected ? (
            selectedOption.renderSelected()
          ) : selectedOption ? (
            <div className="flex items-center gap-2 min-w-0 truncate">
              {selectedOption.avatar && (
                <img
                  src={selectedOption.avatar}
                  alt=""
                  className="w-4 h-4 rounded-full object-cover shrink-0"
                />
              )}
              {selectedOption.color && (
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: selectedOption.color }}
                />
              )}
              <span className="truncate">{selectedOption.label}</span>
            </div>
          ) : (
            <span className="text-[#9CA3AF] truncate">{placeholder}</span>
          )}
        </div>

        <ChevronDown
          className={`w-3.5 h-3.5 text-[#747871] shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
        />
      </button>

      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className={`absolute ${
            align === 'right' ? 'right-0' : 'left-0'
          } z-[120] ${menuWidth} max-h-60 overflow-y-auto no-scrollbar bg-white rounded-2xl shadow-soft-lg border border-[#EDE7DC] p-1.5 transition-all ${
            isUp
              ? 'bottom-full mb-1.5 origin-bottom animate-dropdown-in-up'
              : 'top-full mt-1.5 origin-top animate-dropdown-in'
          }`}
        >
          {options.map((opt) => {
            const isSelected = String(opt.value) === String(value);
            return (
              <button
                key={opt.value}
                type="button"
                onClick={(e) => handleSelect(opt.value, e)}
                className={`w-full text-left px-3 py-2 text-xs font-normal rounded-xl flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#F4EFE6] text-[#1B1F1B] font-medium'
                    : 'text-[#555952] hover:bg-[#FAF7F2] hover:text-[#1B1F1B]'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0 truncate">
                  {opt.avatar && (
                    <img
                      src={opt.avatar}
                      alt=""
                      className="w-4 h-4 rounded-full object-cover shrink-0"
                    />
                  )}
                  {opt.color && (
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: opt.color }}
                    />
                  )}
                  {opt.icon && <span className="text-[#747871] shrink-0">{opt.icon}</span>}
                  <div className="min-w-0 truncate">
                    <span className="truncate block">{opt.label}</span>
                    {opt.sublabel && (
                      <span className="text-[11px] text-[#747871] block truncate font-normal">
                        {opt.sublabel}
                      </span>
                    )}
                  </div>
                </div>

                {isSelected && <Check className="w-3.5 h-3.5 text-[#1B1F1B] shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
