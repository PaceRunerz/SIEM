import { LogEntry, Alert, Severity, SiemStats } from './types';

// Simplified world map path for SVG rendering
export const WORLD_MAP_PATH = "M157.6,146.1c2.4-0.6,4.8-1.4,7.1-2.4c1.6-0.7,3.1-1.6,4.5-2.6c0.8-0.6,1.6-1.2,2.3-1.9c1.6-1.4,3-3,4.3-4.7 c0.6-0.9,1.2-1.8,1.8-2.7c1.1-1.9,2.1-3.9,2.9-6c0.4-1.1,0.8-2.2,1.1-3.3c0.7-2.3,1.1-4.7,1.3-7.1c0.1-1.2,0.1-2.4,0.1-3.6 c-0.1-1.2-0.3-2.4-0.6-3.6c-0.6-2.3-1.6-4.5-2.8-6.6c-0.6-1-1.3-2-2-3c-1.5-1.8-3.1-3.5-4.9-5c-0.9-0.7-1.8-1.4-2.8-2 c-1.9-1.2-3.9-2.2-6-3c-1-0.4-2.1-0.7-3.2-1c-2.3-0.5-4.6-0.7-7-0.6c-1.2,0-2.4,0.2-3.6,0.5c-2.3,0.6-4.5,1.5-6.6,2.6 c-1,0.6-2,1.2-3,1.9c-1.9,1.4-3.6,3-5.2,4.8c-0.7,0.9-1.4,1.8-2,2.8c-1.3,2-2.3,4.1-3.1,6.3c-0.4,1.1-0.7,2.2-1,3.3 c-0.5,2.3-0.7,4.7-0.6,7.1c0,1.2,0.2,2.4,0.4,3.6c0.5,2.3,1.3,4.6,2.4,6.7c0.6,1.1,1.2,2.1,1.9,3.1c1.5,2,3.2,3.7,5.1,5.2 c1,0.7,1.9,1.4,2.9,2c2,1.2,4.2,2.2,6.4,2.9C153.2,145.7,155.4,146,157.6,146.1z";

// Mock Data Generators for Simulation Mode
export const MOCK_IPS = [
  '192.168.1.50', '10.0.0.5', '172.16.0.22', // Internal
  '45.33.22.11', '89.10.12.13', '203.0.113.5', '198.51.100.2' // External/Malicious
];

export const MOCK_PAYLOADS = [
  { type: 'SSH', content: 'Failed password for root from', risk: 'high' },
  { type: 'HTTP', content: 'GET /index.html HTTP/1.1', risk: 'low' },
  { type: 'HTTP', content: 'GET /admin.php?id=1 UNION SELECT 1,2,3', risk: 'critical' },
  { type: 'TCP', content: 'SYN packet received', risk: 'low' },
  { type: 'UDP', content: 'DNS Query google.com', risk: 'low' },
  { type: 'HTTP', content: '<script>alert(1)</script>', risk: 'high' },
];

export const GEO_LOCATIONS: Record<string, {x: number, y: number, country: string}> = {
  '45.33.22.11': { x: 200, y: 150, country: 'USA' }, // North America
  '89.10.12.13': { x: 450, y: 140, country: 'DE' }, // Europe
  '203.0.113.5': { x: 650, y: 180, country: 'CN' }, // Asia
  '198.51.100.2': { x: 500, y: 250, country: 'RU' }, // Russia/Asia
};

export const INITIAL_STATS: SiemStats = {
  totalLogs: 12450,
  activeThreats: 3,
  eventsPerSecond: 45,
  criticalAlerts: 1
};