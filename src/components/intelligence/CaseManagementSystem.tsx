import React, { useState, useEffect } from 'react';
import { ProcurementCase } from '../../types/evaluation';
import { Briefcase, AlertCircle, Clock, CheckCircle2, User, Search, Filter, Plus, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const CaseManagementSystem: React.FC = () => {
  const [cases, setCases] = useState<ProcurementCase[]>([]);
  const [selectedCase, setSelectedCase] = useState<ProcurementCase | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v4/cases');
      const data = await res.json();
      setCases(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm" id="case-system">
      {/* Case Sidebar List */}
      <div className="w-96 border-r border-slate-100 flex flex-col h-full bg-slate-50/30">
        <div className="p-6 border-b border-slate-100 bg-white">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Briefcase size={20} className="text-blue-600" />
              Procurement Cases
            </h2>
            <button className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
              <Plus size={20} />
            </button>
          </div>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search cases..." 
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-3 text-slate-400" size={18} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cases.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCase(c)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                selectedCase?.id === c.id 
                  ? 'bg-white border-blue-200 shadow-md scale-[1.02]' 
                  : 'bg-white border-slate-100 hover:border-slate-200'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                  c.status === 'IN_INVESTIGATION' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
                }`}>
                  {c.status.replace('_', ' ')}
                </span>
                <span className={`text-[10px] font-bold ${
                  c.priority === 'URGENT' ? 'text-rose-600' : 'text-slate-400'
                }`}>
                  {c.priority}
                </span>
              </div>
              <h3 className="font-bold text-slate-800 text-sm mb-1">{c.title}</h3>
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{c.description}</p>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                  <User size={12} />
                  {c.assignedOfficer}
                </div>
                <div className="text-[10px] text-slate-300 font-medium">#{c.id}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Case Details View */}
      <div className="flex-1 flex flex-col h-full bg-white">
        <AnimatePresence mode="wait">
          {selectedCase ? (
            <motion.div
              key={selectedCase.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col h-full"
            >
              <div className="p-8 border-b border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-bold uppercase tracking-widest">
                      {selectedCase.type}
                    </span>
                    <span className="text-slate-400 text-sm">ID: {selectedCase.id}</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50">
                      Transfer Case
                    </button>
                    <button className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-100">
                      Resolve Case
                    </button>
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-slate-900">{selectedCase.title}</h1>
                <p className="mt-4 text-slate-600 leading-relaxed text-lg">{selectedCase.description}</p>
              </div>

              <div className="flex-1 overflow-y-auto p-8 grid grid-cols-2 gap-12">
                {/* Timeline */}
                <div className="space-y-6">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Clock size={16} />
                    Investigation Timeline
                  </h3>
                  <div className="relative pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                    {selectedCase.timeline.map((event, idx) => (
                      <div key={idx} className="relative">
                        <div className="absolute -left-8 top-1 w-6 h-6 bg-white border-2 border-slate-200 rounded-full flex items-center justify-center z-10">
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 text-sm">{event.event}</div>
                          <div className="text-[10px] text-slate-400 font-medium uppercase mt-1">
                            {new Date(event.timestamp).toLocaleString()} • {event.officer}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Attachments & Entities */}
                <div className="space-y-8">
                  <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Linked Evidence</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedCase.evidence.map((ev, i) => (
                        <div key={i} className="p-4 border border-slate-100 rounded-xl flex items-center gap-3 bg-slate-50/50 hover:border-blue-200 transition-colors cursor-pointer">
                          <div className="p-2 bg-white rounded-lg border border-slate-100 text-rose-500 shadow-sm">
                            <AlertCircle size={20} />
                          </div>
                          <div className="overflow-hidden">
                            <div className="font-bold text-xs text-slate-800 truncate">{ev}</div>
                            <div className="text-[10px] text-slate-400 uppercase font-medium">Document</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Related Entities</h3>
                    <div className="space-y-3">
                      {selectedCase.linkedEntities.map((ent, i) => (
                        <div key={i} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl bg-slate-50/50">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-400">
                              <User size={16} />
                            </div>
                            <span className="text-sm font-bold text-slate-800">{ent}</span>
                          </div>
                          <ChevronRight size={16} className="text-slate-300" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-20">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
                <Briefcase size={40} className="text-slate-200" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">No Case Selected</h2>
              <p className="text-slate-400 mt-2 max-w-sm">Select a procurement case from the sidebar to view full investigation details, timeline, and linked evidence.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CaseManagementSystem;
