export const getTodayDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const isTaskOverdue = (dueDate, status) => {
  if (status === 'done') return false;
  const today = getTodayDateString();
  return dueDate < today;
};

export const isTaskDueSoon = (dueDate, status, daysAhead = 3) => {
  if (status === 'done') return false;
  const todayStr = getTodayDateString();
  if (dueDate < todayStr) return false;

  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + daysAhead);
  const year = targetDate.getFullYear();
  const month = String(targetDate.getMonth() + 1).padStart(2, '0');
  const day = String(targetDate.getDate()).padStart(2, '0');
  const thresholdStr = `${year}-${month}-${day}`;

  return dueDate <= thresholdStr;
};

export const formatDisplayDate = (dateString) => {
  if (!dateString) return '';
  const [yearStr, monthStr, dayStr] = dateString.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10) - 1;
  const day = parseInt(dayStr, 10);

  const date = new Date(year, month, day);
  const today = new Date();
  const todayClean = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
  const diffTime = date.getTime() - todayClean.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays < -1 && diffDays >= -7) return `${Math.abs(diffDays)}d overdue`;
  if (diffDays > 1 && diffDays <= 7) return `In ${diffDays}d`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
  });
};
