import React from 'react';

interface GridBackgroundProps {
  className?: string;
}

export default function GridBackground({ className = "fixed inset-0 z-[-1]" }: GridBackgroundProps) {
  return (
    <div className={`pointer-events-none flex items-center justify-center overflow-hidden ${className}`}>
      {/* Shared mask for both grid layers */}
      <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_100%_100%_at_50%_0%,#000_25%,transparent_100%)]">
        {/* Major Grid (Large Squares) */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98118_1.5px,transparent_1.5px),linear-gradient(to_bottom,#10b98118_1.5px,transparent_1.5px)] bg-[size:64px_64px]" />
        
        {/* Minor Grid (Squares inside Squares - 4x4 nested grid) */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98108_1px,transparent_1px),linear-gradient(to_bottom,#10b98108_1px,transparent_1px)] bg-[size:16px_16px]" />
      </div>
    </div>
  );
}
