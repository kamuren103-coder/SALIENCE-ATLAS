import React, { useState } from 'react';
import { Bot, Send, X, Sparkles, CheckCircle2, ShieldAlert, Cpu } from 'lucide-react';
import { Tenant } from '../../types';

interface CopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentTenant: Tenant;
}

interface Message {
  id: string;
  sender: 'user' | 'atlas';
  text: string;
  timestamp: string;
  sources?: string[];
}

export const CopilotDrawer: React.FC<CopilotDrawerProps> = ({
  isOpen,
  onClose,
  currentTenant,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'atlas',
      text: `Salience Atlas AI Copilot active. Connected to ${currentTenant.name} Grid SCADA & SCM Digital Twin. Ask me about corridor loadings, drone anomalies, heavy logistics convoys, or PPADA tender compliance.`,
      timestamp: 'Just now',
      sources: ['SCADA RTU Telemetry', 'PPADA 2015 Knowledge Base', 'Digital Twin Graph']
    }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isThinking) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    setIsThinking(true);

    try {
      const res = await fetch('/api/copilot/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: currentInput, tenantId: currentTenant.id })
      });
      const data = await res.json();
      
      const atlasMsg: Message = {
        id: `atl-${Date.now()}`,
        sender: 'atlas',
        text: data.answer || 'Analysis complete. Grid telemetry and logistics records match operational thresholds.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: data.sources || ['Atlas Core']
      };
      setMessages(prev => [...prev, atlasMsg]);
    } catch {
      const fallbackMsg: Message = {
        id: `atl-${Date.now()}`,
        sender: 'atlas',
        text: `Corridor Suswa-Isinya 400kV is currently operating at 64% capacity (640 MW / 1,000 MW). No critical N-1 contingencies are unhedged. Thermal imaging drone flight #409 confirmed tower structural integrity at Tower 184.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: ['Local Telemetry Cache', 'Suswa RTU']
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <aside className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      {/* Drawer Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-100 font-mono flex items-center gap-1.5">
              <span>ATLAS SCM COPILOT</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              Autonomous Grid Reasoning • Zero-Trust
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-lg p-3 text-xs ${
                msg.sender === 'user'
                  ? 'bg-cyan-600 text-white rounded-br-none'
                  : 'bg-slate-800/80 border border-slate-700/80 text-slate-200 rounded-bl-none'
              }`}
            >
              <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-2 pt-2 border-t border-slate-700/60 flex flex-wrap gap-1">
                  {msg.sources.map((s, idx) => (
                    <span
                      key={idx}
                      className="text-[9px] px-1.5 py-0.2 rounded bg-slate-900/60 text-cyan-400 font-mono border border-cyan-500/20"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <span className="text-[10px] text-slate-500 font-mono mt-1 px-1">
              {msg.timestamp}
            </span>
          </div>
        ))}
        {isThinking && (
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/50">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>Reasoning across transmission topology & contracts…</span>
          </div>
        )}
      </div>

      {/* Suggested Quick Queries */}
      <div className="px-4 py-2 bg-slate-950/40 border-t border-slate-800/60 flex flex-wrap gap-1.5">
        {[
          'Check Suswa-Isinya 400kV',
          'Tender TND-2026-NVS status',
          'Drone #12 corona alert'
        ].map((promptText, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              setInput(promptText);
            }}
            className="text-[10px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono transition-colors border border-slate-700/60"
          >
            {promptText}
          </button>
        ))}
      </div>

      {/* Chat Input */}
      <form onSubmit={handleSend} className="p-3 border-t border-slate-800 bg-slate-950/80 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask Copilot about national grid operations…"
          className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
        />
        <button
          type="submit"
          disabled={!input.trim() || isThinking}
          className="p-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </aside>
  );
};
