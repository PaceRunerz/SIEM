import React from 'react';
import { Activity, ShieldAlert, Database, Server } from 'lucide-react';
import { Card } from '../ui/Card';
import { SiemStats } from '../../types';

interface StatGridProps {
  stats: SiemStats;
}

export const StatGrid: React.FC<StatGridProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <Card className="border-l-4 border-l-emerald-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-zinc-400 text-sm font-medium">Events Per Second</p>
            <h2 className="text-3xl font-bold text-white mt-1">{stats.eventsPerSecond}</h2>
            <p className="text-xs text-emerald-400 mt-2">↑ 12% from last hour</p>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-lg">
            <Activity className="w-6 h-6 text-emerald-500" />
          </div>
        </div>
      </Card>

      <Card className="border-l-4 border-l-danger-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-zinc-400 text-sm font-medium">Active Threats</p>
            <h2 className="text-3xl font-bold text-white mt-1">{stats.activeThreats}</h2>
            <p className="text-xs text-danger-400 mt-2">Requires attention</p>
          </div>
          <div className="p-3 bg-danger-500/10 rounded-lg">
            <ShieldAlert className="w-6 h-6 text-danger-500" />
          </div>
        </div>
      </Card>

      <Card className="border-l-4 border-l-blue-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-zinc-400 text-sm font-medium">Total Ingested</p>
            <h2 className="text-3xl font-bold text-white mt-1">{(stats.totalLogs / 1000).toFixed(1)}k</h2>
            <p className="text-xs text-blue-400 mt-2">+1.2k new entries</p>
          </div>
          <div className="p-3 bg-blue-500/10 rounded-lg">
            <Database className="w-6 h-6 text-blue-500" />
          </div>
        </div>
      </Card>

      <Card className="border-l-4 border-l-purple-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-zinc-400 text-sm font-medium">System Health</p>
            <h2 className="text-3xl font-bold text-white mt-1">98%</h2>
            <p className="text-xs text-purple-400 mt-2">All nodes operational</p>
          </div>
          <div className="p-3 bg-purple-500/10 rounded-lg">
            <Server className="w-6 h-6 text-purple-500" />
          </div>
        </div>
      </Card>
    </div>
  );
};