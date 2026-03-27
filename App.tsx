import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Shield, Bell, Settings, LayoutDashboard, Wifi, WifiOff } from 'lucide-react';

import { StatGrid } from './components/dashboard/StatGrid';
import { LiveTrafficChart } from './components/dashboard/LiveTrafficChart';
import { ThreatMap } from './components/dashboard/ThreatMap';
import { AlertsTable } from './components/dashboard/AlertsTable';
import { LogFeed } from './components/dashboard/LogFeed';
import { SettingsView } from './components/settings/SettingsView';

import { LogEntry, Alert, SiemStats, Severity } from './types';
import { INITIAL_STATS } from './constants';
import { generateRandomLog, detectThreats } from './services/simulationService';

const App: React.FC = () => {
  // Application State
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [stats, setStats] = useState<SiemStats>(INITIAL_STATS);
  const [chartData, setChartData] = useState<{time: string, eps: number}[]>([]);
  const [blockedIps, setBlockedIps] = useState<Set<string>>(new Set());
  
  // Connectivity State
  const [isConnected, setIsConnected] = useState(false);
  const [useSimulation, setUseSimulation] = useState(true);
  const wsRef = useRef<WebSocket | null>(null);

  // UI State
  const [isLive, setIsLive] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'alerts' | 'settings'>('dashboard');

  const handleBlockIp = (ip: string) => {
    setBlockedIps(prev => {
      const newSet = new Set(prev);
      newSet.add(ip);
      return newSet;
    });
  };

  // --- WebSocket Connection Logic ---
  useEffect(() => {
    // Attempt to connect to backend
    const connectWs = () => {
      try {
        const ws = new WebSocket('ws://localhost:8000/ws');
        
        ws.onopen = () => {
          console.log('Connected to SIEM Backend');
          setIsConnected(true);
          setUseSimulation(false); // Disable simulation if backend is present
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            
            if (data.type === 'LOG') {
              const newLog = data.payload as LogEntry;
              // Apply local blocking logic even to real logs
              setBlockedIps(prev => {
                if (prev.has(newLog.src_ip)) {
                  newLog.status = 'blocked';
                  newLog.payload = `[BLOCKED] ${newLog.payload}`;
                }
                return prev;
              });

              setLogs(prev => [...prev, newLog].slice(-100));
              setStats(prev => ({ ...prev, totalLogs: prev.totalLogs + 1 }));
            }
            
            if (data.type === 'ALERT') {
              const newAlert = data.payload as Alert;
              setAlerts(prev => [newAlert, ...prev].slice(0, 50));
              setStats(prev => ({
                ...prev,
                activeThreats: prev.activeThreats + 1,
                criticalAlerts: newAlert.severity === Severity.CRITICAL ? prev.criticalAlerts + 1 : prev.criticalAlerts
              }));
            }
            
            if (data.type === 'STATS') {
               // If backend sends aggregated stats
               setStats(prev => ({...prev, ...data.payload}));
            }

          } catch (e) {
            console.error('Error parsing WS message', e);
          }
        };

        ws.onclose = () => {
          console.log('Disconnected from Backend');
          setIsConnected(false);
          setUseSimulation(true); // Fallback to simulation
        };

        ws.onerror = () => {
          setIsConnected(false);
          setUseSimulation(true);
        };

        wsRef.current = ws;
      } catch (e) {
        setUseSimulation(true);
      }
    };

    connectWs();

    // Cleanup
    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, []);


  // --- Simulation Logic (Fallback) ---
  const handleSimulationIngestion = useCallback(() => {
    if (!isLive || !useSimulation) return;

    // 1. Ingest Log
    const newLog = generateRandomLog();
    
    // Apply blocking rule
    if (blockedIps.has(newLog.src_ip)) {
      newLog.status = 'blocked';
      newLog.payload = `[BLOCKED] ${newLog.payload}`;
    }
    
    // 2. Detection Engine
    const newAlert = detectThreats(newLog);

    // 3. Update State
    setLogs(prev => {
      const updated = [...prev, newLog];
      return updated.slice(-100); 
    });

    if (newAlert) {
      setAlerts(prev => [newAlert, ...prev].slice(0, 50));
      setStats(prev => ({
        ...prev,
        activeThreats: prev.activeThreats + 1,
        criticalAlerts: newAlert.severity === Severity.CRITICAL ? prev.criticalAlerts + 1 : prev.criticalAlerts
      }));
    }

    setStats(prev => ({ ...prev, totalLogs: prev.totalLogs + 1 }));

  }, [isLive, blockedIps, useSimulation]);

  // Traffic Chart Simulation (Always runs locally for visual effect unless backend sends it)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const newEps = Math.floor(Math.random() * 50) + 20; 
      
      setChartData(prev => {
        const newData = [...prev, { time: now.toLocaleTimeString(), eps: newEps }];
        return newData.slice(-20); 
      });

      if (useSimulation) {
         setStats(prev => ({ ...prev, eventsPerSecond: newEps }));
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [useSimulation]);

  // Trigger Simulation Interval
  useEffect(() => {
    if (useSimulation) {
      const interval = setInterval(handleSimulationIngestion, 800); 
      return () => clearInterval(interval);
    }
  }, [handleSimulationIngestion, useSimulation]);


  return (
    <div className="min-h-screen bg-charcoal-900 text-zinc-300 font-sans selection:bg-emerald-500/30">
      
      {/* Top Navigation */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-zinc-900/80 backdrop-blur-md border-b border-zinc-800 flex items-center justify-between px-6 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
            <Shield className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-white font-bold tracking-wide">SENTINEL <span className="text-emerald-500">SIEM</span></h1>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Security Operations Center</p>
          </div>
        </div>

        <nav className="flex items-center gap-6">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${activeTab === 'dashboard' ? 'text-emerald-500' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </button>
          <button 
             onClick={() => setActiveTab('alerts')}
             className={`flex items-center gap-2 text-sm font-medium transition-colors ${activeTab === 'alerts' ? 'text-emerald-500' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <Bell className="w-4 h-4" /> Alerts 
            {alerts.length > 0 && <span className="bg-danger-500 text-white text-[10px] px-1.5 rounded-full">{alerts.length}</span>}
          </button>
          <button 
             onClick={() => setActiveTab('settings')}
             className={`flex items-center gap-2 text-sm font-medium transition-colors ${activeTab === 'settings' ? 'text-emerald-500' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <Settings className="w-4 h-4" /> Settings
          </button>
          
          <div className="h-4 w-px bg-zinc-700 mx-2"></div>
          
          <div className="flex items-center gap-2">
            {isConnected ? (
              <>
                <Wifi className="w-4 h-4 text-emerald-500" />
                <span className="text-xs text-emerald-500 font-medium">Connected</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-yellow-500" />
                <span className="text-xs text-yellow-500 font-medium">Simulation Mode</span>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Main Layout */}
      <main className="pt-24 pb-12 px-6 max-w-[1600px] mx-auto">
        
        {activeTab === 'dashboard' ? (
          <>
            <StatGrid stats={stats} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2">
                <LiveTrafficChart data={chartData} />
              </div>
              <div className="lg:col-span-1">
                <ThreatMap recentLogs={logs} blockedIps={blockedIps} />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AlertsTable alerts={alerts} onBlockIp={handleBlockIp} blockedIps={blockedIps} />
              <LogFeed logs={logs} isPaused={!isLive} onTogglePause={() => setIsLive(!isLive)} blockedIps={blockedIps} />
            </div>
          </>
        ) : activeTab === 'alerts' ? (
           <div className="space-y-6">
              <AlertsTable alerts={alerts} onBlockIp={handleBlockIp} blockedIps={blockedIps} />
           </div>
        ) : (
          <SettingsView />
        )}
      </main>
    </div>
  );
};

export default App;