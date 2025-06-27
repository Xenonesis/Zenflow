import React from 'react';

interface ActivityRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: 'purple' | 'teal' | 'indigo' | string;
}

export const ActivityRing: React.FC<ActivityRingProps> = ({
  progress,
  size = 36,
  strokeWidth = 4,
  color = 'purple'
}) => {
  // Ensure progress is between 0 and 100
  const normalizedProgress = Math.min(Math.max(progress, 0), 100);
  
  // Calculate radius and other dimensions
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (normalizedProgress / 100) * circumference;
  
  // Center of the circle
  const center = size / 2;
  
  // Determine color
  let ringColor = '';
  if (color === 'purple') {
    ringColor = 'stroke-health-primary';
  } else if (color === 'teal') {
    ringColor = 'stroke-health-secondary';
  } else if (color === 'indigo') {
    ringColor = 'stroke-indigo-500';
  } else {
    ringColor = `stroke-${color}-500`;
  }

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Background Ring */}
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="currentColor"
          className="stroke-slate-200 dark:stroke-slate-700"
          strokeWidth={strokeWidth}
        />
        
        {/* Progress Ring */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          className={ringColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      
      {/* Percentage Text (Optional) */}
      <div 
        className="absolute inset-0 flex items-center justify-center text-xs font-medium"
        style={{ transform: 'rotate(0deg)' }}
      >
        {normalizedProgress}%
      </div>
    </div>
  );
}; 