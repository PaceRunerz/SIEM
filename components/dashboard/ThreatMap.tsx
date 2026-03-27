import React from 'react';
import { Card } from '../ui/Card';
import { LogEntry } from '../../types';
import { GEO_LOCATIONS } from '../../constants';
import { Lock } from 'lucide-react';

interface ThreatMapProps {
  recentLogs: LogEntry[];
  blockedIps: Set<string>;
}

export const ThreatMap: React.FC<ThreatMapProps> = ({ recentLogs, blockedIps }) => {
  // Get active threats from external IPs
  // We dedup IPs to avoid stacking too many indicators
  const uniqueThreatIps = Array.from(new Set(recentLogs.map(l => l.src_ip)))
    .filter(ip => 
      !ip.startsWith('192') && 
      !ip.startsWith('10.') &&
      GEO_LOCATIONS[ip]
    );

  return (
    <Card title="Global Threat Origin" className="h-[400px] relative">
      <div className="w-full h-full bg-[#0a0a0a] rounded-lg relative overflow-hidden flex items-center justify-center">
        {/* Abstract Dot Grid Background to simulate map texture */}
        <div className="absolute inset-0 opacity-20" 
             style={{ 
               backgroundImage: 'radial-gradient(#3f3f46 1px, transparent 1px)', 
               backgroundSize: '20px 20px' 
             }}>
        </div>

        {/* Simplified World Map SVG */}
        <svg viewBox="0 0 1000 500" className="w-full h-full opacity-30 pointer-events-none">
          <path d="M50,150 Q200,50 350,150 T650,150 T950,250" fill="none" stroke="#27272a" strokeWidth="2" />
          {/* North America Approximation */}
          <path d="M100,80 L250,80 L200,250 L80,200 Z" fill="#18181b" stroke="#27272a" />
          {/* Europe/Asia Approximation */}
          <path d="M400,80 L800,80 L750,300 L450,250 Z" fill="#18181b" stroke="#27272a" />
          {/* Africa Approximation */}
          <path d="M420,260 L550,260 L500,450 L450,400 Z" fill="#18181b" stroke="#27272a" />
          {/* South America Approximation */}
          <path d="M180,260 L300,260 L280,450 L200,400 Z" fill="#18181b" stroke="#27272a" />
        </svg>

        {/* Active Threat Blips */}
        {uniqueThreatIps.map((ip) => {
          const loc = GEO_LOCATIONS[ip];
          const isBlocked = blockedIps.has(ip);
          
          return (
            <div
              key={ip}
              className="absolute"
              style={{
                left: `${(loc.x / 1000) * 100}%`,
                top: `${(loc.y / 500) * 100}%`,
              }}
            >
              <div className="relative group">
                {!isBlocked && (
                  <div className="absolute -inset-2 bg-red-500 rounded-full opacity-20 animate-ping"></div>
                )}
                
                {isBlocked ? (
                  <div className="relative w-4 h-4 bg-zinc-800 rounded-full border border-red-500 flex items-center justify-center shadow-lg">
                    <Lock className="w-2.5 h-2.5 text-red-500" />
                  </div>
                ) : (
                  <div className="relative w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
                )}
                
                {/* Tooltip on hover */}
                <div className="absolute top-4 left-4 bg-zinc-900 border border-zinc-700 p-2 rounded text-xs whitespace-nowrap z-20 pointer-events-none hidden group-hover:block shadow-xl">
                  <span className={`${isBlocked ? 'text-zinc-400 line-through' : 'text-red-400 font-bold'}`}>{ip}</span>
                  {isBlocked && <span className="text-red-500 font-bold ml-2">BLOCKED</span>}
                  <br/>
                  <span className="text-zinc-500">{loc.country}</span>
                </div>
              </div>
            </div>
          );
        })}

        <div className="absolute bottom-4 left-4 text-xs text-zinc-500">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-red-500"></span> Active Threat
          </div>
          <div className="flex items-center gap-2 mb-1">
             <div className="w-2 h-2 flex items-center justify-center"><Lock className="w-2 h-2 text-zinc-500"/></div> Blocked IP
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-zinc-700"></span> Neutral
          </div>
        </div>
      </div>
    </Card>
  );
};