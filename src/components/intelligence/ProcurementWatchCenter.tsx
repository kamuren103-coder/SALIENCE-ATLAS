import React, { useState, useEffect } from 'react';
import { Activity, ShieldAlert, Clock, AlertCircle, BarChart3, TrendingUp, Users, CheckCircle2, MessageSquare, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import DecisionAssistant from './DecisionAssistant';

const ProcurementWatchCenter: React.FC = () => {
  const [showAssistant, setShowAssistant] = useState(false);
  const [metrics, setMetrics] = useState({
    activeEvaluations: 8,
    highRiskSuppliers: 3,
    pendingReviews: 5,
    complianceScore: 94.2
  });

  const alerts = [
    { id: 1, type: 'CRITICAL', title: 'Collusion Detected', desc: 'Price clustering in Tender 2026-08', time: '2m ago' },
    { id: 2, type: 'WARNING', title: 'Expiry Alert', desc: 'CR12 for Siemens Energy expires in 14 days', time: '1h ago' },
    { id: 3, type: 'INFO', title: 'Agent Completed', desc: 'OCR Agent finished Lot 4 classification', time: '3h ago' }
  ];

  return (
    <div className="flex flex-col h-full bg-slate-900 p-8 space-y-8 overflow-y-auto text-white" id="watch-center">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Activity className="text-emerald-500 animate-pulse" />
            Real-Time Procurement Watch Center
          </h1>
          <p className="text-slate-400 mt-1">Autonomous Monitoring & Command Command Platform</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-slate-800 rounded-xl border border-slate-700 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-bold uppercase tracking-wider">Systems Live</span>
          </div>
          <button 
            onClick={() => setShowAssistant(!showAssistant)}
            className={`p-2 rounded-xl border transition-all ${
              showAssistant ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare size={20} />
          </button>
          <button className="px-6 py-2 bg-blue-600 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors">
            Generate Executive Briefing
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-8 overflow-hidden">
        <div className="flex-1 flex flex-col gap-8 overflow-y-auto pr-2">
          {/* Hero Stats */}
          <div className="grid grid-cols-4 gap-6">
            {[
              { label: 'Active Evaluations', value: metrics.activeEvaluations, icon: Clock, color: 'text-blue-400', bg: 'bg-blue-400/10' },
              { label: 'High Risk Findings', value: metrics.highRiskSuppliers, icon: ShieldAlert, color: 'text-rose-400', bg: 'bg-rose-400/10' },
              { label: 'Pending Officer Reviews', value: metrics.pendingReviews, icon: Users, color: 'text-amber-400', bg: 'bg-amber-400/10' },
              { label: 'Compliance Index', value: `${metrics.complianceScore}%`, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-400/10' }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-6 bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl"
              >
                <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                  <stat.icon size={20} />
                </div>
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-8">
            {/* Live Alerts Stream */}
            <div className="col-span-1 bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden h-fit">
              <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
                <h3 className="font-bold text-sm flex items-center gap-2">
                  <AlertCircle size={16} className="text-rose-400" />
                  Intelligence Alerts
                </h3>
                <span className="text-[10px] font-bold text-slate-500 uppercase">Live Stream</span>
              </div>
              <div className="p-4 space-y-4">
                {alerts.map(alert => (
                  <div key={alert.id} className="p-4 bg-slate-800 border border-slate-700 rounded-xl relative overflow-hidden">
                    <div className={`absolute top-0 left-0 w-1 h-full ${
                      alert.type === 'CRITICAL' ? 'bg-rose-500' : alert.type === 'WARNING' ? 'bg-amber-500' : 'bg-blue-500'
                    }`} />
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        alert.type === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-700 text-slate-400'
                      }`}>
                        {alert.type}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">{alert.time}</span>
                    </div>
                    <div className="font-bold text-sm text-slate-200">{alert.title}</div>
                    <div className="text-xs text-slate-500 mt-1">{alert.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Predictive Analytics */}
            <div className="col-span-2 bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
                <h3 className="font-bold text-sm flex items-center gap-2">
                  <TrendingUp size={16} className="text-blue-400" />
                  Predictive Procurement Analytics
                </h3>
                <div className="flex gap-2">
                  {['Cost', 'Delay', 'Fraud'].map(t => (
                    <button key={t} className="px-3 py-1 bg-slate-700 rounded-lg text-[10px] font-bold hover:bg-slate-600 transition-colors">
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-8">
                <div className="h-64 flex items-end gap-4">
                  {[65, 45, 85, 30, 95, 50, 75, 40].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        className={`w-full rounded-t-lg ${h > 80 ? 'bg-rose-500' : h > 50 ? 'bg-blue-500' : 'bg-emerald-500'} opacity-80`}
                      />
                      <span className="text-[8px] text-slate-500 font-bold">W{i+1}</span>
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-3 gap-6 mt-12">
                  <div className="p-4 bg-slate-800 rounded-xl border border-slate-700">
                    <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Avg. Forecast Error</div>
                    <div className="text-xl font-bold text-emerald-400">± 2.4%</div>
                  </div>
                  <div className="p-4 bg-slate-800 rounded-xl border border-slate-700">
                    <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Risk Exposure</div>
                    <div className="text-xl font-bold text-rose-400">KES 48M</div>
                  </div>
                  <div className="p-4 bg-slate-800 rounded-xl border border-slate-700">
                    <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Throughput Rate</div>
                    <div className="text-xl font-bold text-blue-400">12.4 / Mo</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Assistant Sidebar */}
        <AnimatePresence>
          {showAssistant && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 400, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="h-full border-l border-slate-800 bg-slate-900/50 backdrop-blur-xl"
            >
              <div className="h-full p-4">
                <DecisionAssistant />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProcurementWatchCenter;
