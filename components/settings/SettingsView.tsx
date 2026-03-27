import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { User, Key, Shield, CheckCircle, AlertCircle } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    organization: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [apiKey, setApiKey] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    // Simulate API Call to Backend
    try {
      // In a real scenario: await fetch('http://localhost:8000/api/register', { ... })
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock success
      setApiKey(`sk_live_${Math.random().toString(36).substring(2, 15)}_${Math.random().toString(36).substring(2, 15)}`);
      setStatus('success');
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Registration Form */}
        <Card title="Agent Registration" className="h-full">
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Organization Name</label>
              <div className="relative">
                <Shield className="w-4 h-4 absolute left-3 top-2.5 text-zinc-500" />
                <input 
                  type="text" 
                  required
                  className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 pl-9 text-sm text-zinc-200 focus:border-emerald-500 focus:outline-none"
                  placeholder="e.g. Acme Corp Cyber Div"
                  value={formData.organization}
                  onChange={e => setFormData({...formData, organization: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Admin Username</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-2.5 text-zinc-500" />
                <input 
                  type="text" 
                  required
                  className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 pl-9 text-sm text-zinc-200 focus:border-emerald-500 focus:outline-none"
                  placeholder="admin_user"
                  value={formData.username}
                  onChange={e => setFormData({...formData, username: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Password</label>
              <div className="relative">
                <Key className="w-4 h-4 absolute left-3 top-2.5 text-zinc-500" />
                <input 
                  type="password" 
                  required
                  className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 pl-9 text-sm text-zinc-200 focus:border-emerald-500 focus:outline-none"
                  placeholder="••••••••••••"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <button 
              disabled={status === 'loading' || status === 'success'}
              className={`w-full py-2 rounded font-medium text-sm transition-all ${
                status === 'success' 
                  ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/50' 
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/50'
              }`}
            >
              {status === 'loading' ? 'Registering...' : status === 'success' ? 'Agent Registered' : 'Create Account & Generate Keys'}
            </button>

            {status === 'error' && (
              <div className="flex items-center gap-2 text-red-400 text-xs mt-2 bg-red-900/20 p-2 rounded">
                <AlertCircle className="w-3 h-3" /> Registration failed. Is backend running?
              </div>
            )}
          </form>
        </Card>

        {/* API Key Display */}
        <Card title="Integration Details" className="h-full flex flex-col justify-between">
          <div>
            <p className="text-sm text-zinc-400 mb-4">
              Use these credentials to configure your log forwarders (Python Watchdog, Fluentd, or Filebeat).
            </p>
            
            {status === 'success' && apiKey ? (
              <div className="bg-[#0c0c0c] border border-emerald-500/30 rounded p-4 mb-4 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Secret API Key</p>
                <code className="text-emerald-400 font-mono text-sm break-all">{apiKey}</code>
                <div className="mt-2 text-[10px] text-zinc-500 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-emerald-500" /> Active & Ready for Ingestion
                </div>
              </div>
            ) : (
              <div className="bg-zinc-900/50 border border-zinc-800 border-dashed rounded p-8 flex flex-col items-center justify-center text-zinc-600 mb-4">
                <Key className="w-8 h-8 mb-2 opacity-20" />
                <span className="text-xs">Register to generate API keys</span>
              </div>
            )}
          </div>

          <div className="bg-zinc-800/30 p-3 rounded border border-zinc-700/50">
            <p className="text-xs text-zinc-300 font-semibold mb-1">Ingestion Endpoint:</p>
            <code className="text-xs text-blue-400 bg-black/30 px-2 py-1 rounded block w-full mb-2">
              POST http://localhost:8000/ingest
            </code>
            <p className="text-[10px] text-zinc-500">
              Payload must be JSON. See documentation for schema.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};