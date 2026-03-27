export enum Severity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface LogEntry {
  id: string;
  timestamp: string;
  src_ip: string;
  dest_port: number;
  event_type: string;
  protocol: 'TCP' | 'UDP' | 'HTTP' | 'SSH';
  payload: string;
  status: 'allowed' | 'blocked' | 'monitored';
  country?: string; // Geo-IP simulation
}

export interface Alert {
  id: string;
  timestamp: string;
  rule_name: string;
  severity: Severity;
  src_ip: string;
  description: string;
  mitigation: string;
  status: 'active' | 'resolved';
}

export interface SiemStats {
  totalLogs: number;
  activeThreats: number;
  eventsPerSecond: number;
  criticalAlerts: number;
}