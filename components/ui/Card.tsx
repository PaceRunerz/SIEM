import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  action?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, action }) => {
  return (
    <div className={`bg-charcoal-800/50 backdrop-blur-md border border-zinc-800 rounded-xl overflow-hidden shadow-xl ${className}`}>
      {(title || action) && (
        <div className="px-6 py-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/30">
          {title && <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">{title}</h3>}
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-6 h-full">
        {children}
      </div>
    </div>
  );
};