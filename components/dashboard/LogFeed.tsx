import React, { useEffect, useRef, useState } from 'react';
import { Card } from '../ui/Card';
import { LogEntry } from '../../types';
import { Terminal, Search, ArrowDown } from 'lucide-react';

interface LogFeedProps {
  logs: LogEntry[];
  isPaused: boolean;
  onTogglePause: () => void;
  blockedIps: Set<string>;
}

export const LogFeed: React.FC<LogFeedProps> = ({ logs, isPaused, onTogglePause, blockedIps }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  // Track whether auto-scroll should be active based on scroll position
  const [autoScroll, setAutoScroll] = useState(true);

  // Filter logs based on search term
  const filteredLogs = logs.filter(log => 
    searchTerm === '' || 
    log.payload.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.src_ip.includes(searchTerm) ||
    log.event_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle scroll events to toggle auto-scroll
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      // If user is within 50px of the bottom, consider them "at the bottom" and enable auto-scroll
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
      setAutoScroll(isAtBottom);
    }
  };

  useEffect(() => {
    // Only auto-scroll if enabled (user is at bottom), not paused, and not searching
    if (!isPaused && searchTerm === '' && autoScroll && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [logs, isPaused, searchTerm, autoScroll]);

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
      setAutoScroll(true);
    }
  };

  return (
    <Card 
      title="Live Ingestion Feed" 
      className="h-[400px] flex flex-col relative"
      action={
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3 h-3 absolute left-2 top-1.5 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search logs..." 
              className="bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs rounded pl-7 pr-2 py-1 focus:outline-none focus:border-emerald-500 w-32 focus:w-48 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={onTogglePause}
            className={`text-xs px-2 py-1 rounded border ${isPaused ? 'border-yellow-500 text-yellow-500' : 'border-emerald-500 text-emerald-500'}`}
          >
            {isPaused ? 'PAUSED' : 'LIVE'}
          </button>
        </div>
      }
    >
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="bg-[#0c0c0c] rounded-lg p-4 font-mono text-xs h-full overflow-y-auto border border-zinc-800 shadow-inner relative"
      >
        {filteredLogs.map((log) => {
          const isError = log.protocol === 'HTTP' && log.status === 'blocked';
          const isSsh = log.protocol === 'SSH';
          const isBlocked = blockedIps.has(log.src_ip) || log.status === 'blocked';
          
          return (
            <div 
              key={log.id} 
              className={`mb-1 grid grid-cols-[140px_1fr] gap-2 p-0.5 rounded transition-colors ${
                isBlocked ? 'bg-red-900/10 border-l-2 border-red-900/50' : 'hover:bg-white/5 border-l-2 border-transparent'
              }`}
            >
              <span className={`select-none ${isBlocked ? 'text-red-900/50' : 'text-zinc-500'}`}>
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
              <div className="break-all">
                <span className={`font-bold mr-2 ${isSsh ? 'text-purple-400' : 'text-blue-400'}`}>
                  [{log.protocol}]
                </span>
                <span className={`${isBlocked ? 'text-red-500 line-through' : 'text-emerald-600'} mr-2`}>
                  {log.src_ip}
                </span>
                <span className={isError || isBlocked ? 'text-red-400' : 'text-zinc-300'}>
                  {log.payload}
                </span>
              </div>
            </div>
          );
        })}
        
        {filteredLogs.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-zinc-600">
            <Terminal className="w-8 h-8 mb-2 opacity-50" />
            <p>{logs.length === 0 ? "Waiting for log ingestion..." : "No logs match your search."}</p>
          </div>
        )}
      </div>

      {/* Floating Resume Button */}
      {!autoScroll && !isPaused && searchTerm === '' && logs.length > 0 && (
        <div className="absolute bottom-8 left-0 right-0 flex justify-center pointer-events-none">
           <button 
             onClick={scrollToBottom}
             className="pointer-events-auto bg-emerald-500/90 hover:bg-emerald-500 text-white text-[10px] font-bold py-1 px-3 rounded-full shadow-lg flex items-center gap-1 transition-all backdrop-blur-sm animate-bounce"
           >
             <ArrowDown className="w-3 h-3" /> RESUME FEED
           </button>
        </div>
      )}
    </Card>
  );
};