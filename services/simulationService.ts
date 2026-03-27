import { LogEntry, Alert, Severity } from '../types';
import { MOCK_IPS, MOCK_PAYLOADS, GEO_LOCATIONS } from '../constants';

// Simple UUID generator
const uuid = () => Math.random().toString(36).substring(2, 9);

export const generateRandomLog = (): LogEntry => {
  const ip = MOCK_IPS[Math.floor(Math.random() * MOCK_IPS.length)];
  const payloadTemplate = MOCK_PAYLOADS[Math.floor(Math.random() * MOCK_PAYLOADS.length)];
  const isInternal = ip.startsWith('192') || ip.startsWith('10.');

  return {
    id: uuid(),
    timestamp: new Date().toISOString(),
    src_ip: ip,
    dest_port: payloadTemplate.type === 'SSH' ? 22 : payloadTemplate.type === 'HTTP' ? 80 : 443,
    event_type: payloadTemplate.type === 'SSH' ? 'auth_attempt' : 'web_request',
    protocol: payloadTemplate.type as any,
    payload: payloadTemplate.content,
    status: 'monitored',
    country: isInternal ? 'Internal' : (GEO_LOCATIONS[ip]?.country || 'Unknown')
  };
};

export const detectThreats = (log: LogEntry): Alert | null => {
  // 1. SQL Injection Rule
  if (/(UNION SELECT|OR 1=1)/i.test(log.payload)) {
    return {
      id: uuid(),
      timestamp: new Date().toISOString(),
      rule_name: 'SQL Injection Detected',
      severity: Severity.CRITICAL,
      src_ip: log.src_ip,
      description: `SQLi payload detected in web request: ${log.payload.substring(0, 30)}...`,
      mitigation: 'Block IP immediately and sanitize input parameters.',
      status: 'active'
    };
  }

  // 2. XSS Rule
  if (/(<script>|javascript:)/i.test(log.payload)) {
    return {
      id: uuid(),
      timestamp: new Date().toISOString(),
      rule_name: 'XSS Attempt',
      severity: Severity.HIGH,
      src_ip: log.src_ip,
      description: 'Cross-site scripting vector detected.',
      mitigation: 'Enable Content Security Policy (CSP) and WAF rules.',
      status: 'active'
    };
  }

  // 3. Brute Force Simulation (Simplified for single log context)
  if (log.payload.includes('Failed password')) {
    // In a real backend, we'd count frequency. Here we simulate a random trigger
    if (Math.random() > 0.7) {
      return {
        id: uuid(),
        timestamp: new Date().toISOString(),
        rule_name: 'Brute Force Attack',
        severity: Severity.MEDIUM,
        src_ip: log.src_ip,
        description: 'Multiple failed login attempts detected.',
        mitigation: 'Lock account temporarily and enforce 2FA.',
        status: 'active'
      };
    }
  }

  return null;
};