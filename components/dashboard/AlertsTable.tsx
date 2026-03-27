import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Alert, Severity } from '../../types';
import { ShieldCheck, XOctagon, Ban, Filter } from 'lucide-react';

interface AlertsTableProps {
  alerts: Alert[];
  onBlockIp: (ip: string) => void;
  blockedIps: Set<string>;
}

const SeverityBadge: React.FC<{ severity: Severity }> = ({ severity }) => {
  const styles = {
    [Severity.LOW]: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    [Severity.MEDIUM]: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    [Severity.HIGH]: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    [Severity.CRITICAL]: 'bg-red-500/10 text-red-400 border-red-500/20',
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${styles[severity]}`}>
      {severity}
    </span>
  );
};

export const AlertsTable: React.FC<AlertsTableProps> = ({ alerts, onBlockIp, blockedIps }) => {
  const [filterSeverity, setFilterSeverity] = useState<Severity | 'ALL'>('ALL');

  const filteredAlerts = alerts.filter(alert => 
    filterSeverity === 'ALL' ? true : alert.severity === filterSeverity
  );

  return (
    <Card 
      title="Recent Security Alerts" 
      className="h-[400px] flex flex-col"
      action={
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-zinc-500" />
          <select 
            className="bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs rounded px-2 py-1 focus:outline-none focus:border-emerald-500"
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value as Severity | 'ALL')}
          >
            <option value="ALL">All Severities</option>
            <option value={Severity.CRITICAL}>Critical</option>
            <option value={Severity.HIGH}>High</option>
            <option value={Severity.MEDIUM}>Medium</option>
            <option value={Severity.LOW}>Low</option>
          </select>
        </div>
      }
    >
      <div className="overflow-auto flex-1">
        <table className="w-full text-left text-sm text-zinc-400">
          <thead className="bg-zinc-900/50 text-zinc-200 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 font-medium">Severity</th>
              <th className="px-4 py-3 font-medium">Timestamp</th>
              <th className="px-4 py-3 font-medium">Rule</th>
              <th className="px-4 py-3 font-medium">Source IP</th>
              <th className="px-4 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {filteredAlerts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-zinc-500">
                  <ShieldCheck className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  {alerts.length === 0 ? 'No active alerts detected.' : 'No alerts match filter.'}
                </td>
              </tr>
            ) : (
              filteredAlerts.map((alert) => {
                const isBlocked = blockedIps.has(alert.src_ip);
                return (
                  <tr key={alert.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3">
                      <SeverityBadge severity={alert.severity} />
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="px-4 py-3 text-white font-medium">
                      {alert.rule_name}
                    </td>
                    <td className="px-4 py-3 font-mono text-zinc-300">
                      {alert.src_ip}
                      {isBlocked && <span className="ml-2 text-red-500 text-[10px] uppercase font-bold tracking-wider">[Blocked]</span>}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button 
                        onClick={() => !isBlocked && onBlockIp(alert.src_ip)}
                        disabled={isBlocked}
                        className={`p-1 rounded transition-colors ${
                          isBlocked 
                            ? 'text-zinc-600 cursor-not-allowed' 
                            : 'hover:bg-red-500/20 text-red-400'
                        }`} 
                        title={isBlocked ? "IP Blocked" : "Block IP"}
                      >
                        {isBlocked ? <Ban className="w-4 h-4" /> : <XOctagon className="w-4 h-4" />}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};