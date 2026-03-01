import React, { useState, useEffect } from 'react';

const MoodBar = ({ label, percentage, delay = 0 }) => {
  const [currentWidth, setCurrentWidth] = useState(0);
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    // Reset state when percentage changes
    setCurrentWidth(0);
    setCurrentValue(0);

    // Start animation after delay
    const timer = setTimeout(() => {
      setCurrentWidth(percentage);
    }, delay);

    // Counter animation
    let startTimestamp = null;
    let animationFrameId;
    const duration = 1500; // 1.5s for full animation

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      // Calculate current value ensuring we don't exceed target
      const nextValue = Math.floor(easeProgress * percentage);
      setCurrentValue(nextValue > percentage ? percentage : nextValue);

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      }
    };

    const counterTimer = setTimeout(() => {
        animationFrameId = window.requestAnimationFrame(step);
    }, delay);

    return () => {
        clearTimeout(timer);
        clearTimeout(counterTimer);
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [percentage, delay]);

  return (
    <div className="mb-[24px]">
      <div className="flex justify-between items-end mb-3">
        <span className="text-[11px] font-[800] tracking-[3px] uppercase text-[#0A0A0A]">
            {label}
        </span>
        <span className="font-mono text-[14px] text-[#0047FF] font-bold">
            {currentValue}%
        </span>
      </div>
      
      <div className="relative h-[6px] w-full bg-[#E5E5E5] overflow-hidden">
        <div 
            className="absolute top-0 left-0 h-full bg-[#0A0A0A] transition-all duration-[1500ms] cubic-bezier(0.16, 1, 0.3, 1)" 
            style={{ width: `${currentWidth}%` }}
        >
            {/* Red Marker */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[4px] h-[18px] bg-[#E8360D]"></div>
        </div>
      </div>
    </div>
  );
};

export default MoodBar;
