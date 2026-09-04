import React from 'react';
import { DigitalTwin } from '../../types/evaluation';
import { LayoutDashboard, Clock, Users, FileCheck, CheckCircle2, AlertCircle, Calendar, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface TenderTwinProps {
  twin: DigitalTwin;
}

const TenderTwin: React.FC<TenderTwinProps> = ({ twin }) => {
  const tenderNode = twin.nodes.find(n => n.id === twin.id);
  const bidders = twin.nodes.filter(n => n.type === 'SUPPLIER');
  const rules = twin.nodes.filter(n => n.type === 'RULE');

  const timeline = [
    { stage: 'Publication', date: '2026-05-10', status: 'Completed', icon: Calendar },
    { stage: 'Opening', date: '2026-06-15', status: 'Completed', icon: Clock },
    { stage: 'Evaluation', date: '2026-07-01', status: 'In Progress', icon: Users },
    { stage: 'Award', date: 'TBD', status: 'Pending', icon: CheckCircle2 }
  ];

  return (
    <div className="space-y-6" id="tender-twin">
      {/* Header */}
      <div className="bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/200/10 rounded-full blur-3xl -mr-32 -mt-32" />
        
        <div className="flex items-center gap-4 mb-6">
          <div className="px-3 py-1 bg-blue-500/200 rounded-full text-[10px] font-bold uppercase tracking-wider">
            {tenderNode?.properties.status || 'EVALUATION'}
          </div>
          <div className="text-slate-400 text-xs">Updated: {new Date(twin.lastUpdated).toLocaleString()}</div>
        </div>

        <h1 className="text-3xl font-bold mb-2">{tenderNode?.label}</h1>
        <p className="text-slate-400 max-w-2xl">{tenderNode?.properties.title || 'Enterprise SCM Procurement Object'}</p>

        <div className="grid grid-cols-4 gap-8 mt-10">
          <div>
            <div className="text-slate-400 text-xs font-bold uppercase mb-1">Participants</div>
            <div className="text-2xl font-bold">{bidders.length} Bidders</div>
          </div>
          <div>
            <div className="text-slate-400 text-xs font-bold uppercase mb-1">Rules Applied</div>
            <div className="text-2xl font-bold">{rules.length} Mandatory</div>
          </div>
          <div>
            <div className="text-slate-400 text-xs font-bold uppercase mb-1">Committee</div>
            <div className="text-2xl font-bold">5 Members</div>
          </div>
          <div>
            <div className="text-slate-400 text-xs font-bold uppercase mb-1">Budget</div>
            <div className="text-2xl font-bold font-mono text-emerald-400">KES 450M</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Timeline */}
        <div className="bg-[#05070D] rounded-2xl border border-slate-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800 bg-white/5 flex items-center justify-between">
            <h3 className="font-bold text-slate-200 flex items-center gap-2">
              <Clock size={18} className="text-blue-500" />
              Tender Timeline
            </h3>
          </div>
          <div className="p-6 relative">
            <div className="absolute left-9 top-10 bottom-10 w-0.5 bg-slate-800" />
            <div className="space-y-8">
              {timeline.map((item, idx) => (
                <div key={idx} className="flex gap-4 relative">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center z-10 ${
                    item.status === 'Completed' ? 'bg-emerald-500/200 text-white' :
                    item.status === 'In Progress' ? 'bg-blue-500/200 text-white animate-pulse' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    <item.icon size={12} />
                  </div>
                  <div>
                    <div className="font-bold text-slate-100 text-sm">{item.stage}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase">{item.date}</div>
                    <div className={`mt-1 text-[10px] font-bold px-1.5 py-0.5 rounded inline-block ${
                      item.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-600' :
                      item.status === 'In Progress' ? 'bg-blue-500/20 text-blue-600' :
                      'bg-white/5 text-slate-400'
                    }`}>
                      {item.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bidders & Compliance */}
        <div className="col-span-2 space-y-6">
          <div className="bg-[#05070D] rounded-2xl border border-slate-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 bg-white/5 flex items-center justify-between">
              <h3 className="font-bold text-slate-200 flex items-center gap-2">
                <Users size={18} className="text-blue-500" />
                Submitted Bidders
              </h3>
              <button className="text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:underline">Compare All</button>
            </div>
            <div className="p-0 overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-white/5/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4">Bidder Name</th>
                    <th className="px-6 py-4">Compliance</th>
                    <th className="px-6 py-4">Risk</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {bidders.map(bidder => (
                    <tr key={bidder.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-200">{bidder.label}</div>
                        <div className="text-[10px] text-slate-400">PIN: {bidder.properties.pin}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden w-20">
                            <div className="h-full bg-emerald-500/200 w-[95%]" />
                          </div>
                          <span className="text-xs font-bold text-emerald-600">95%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <AlertCircle size={14} className="text-emerald-500" />
                          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Low</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 bg-slate-800 hover:bg-blue-100 hover:text-blue-600 rounded-lg transition-colors">
                          <ArrowRight size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Legal Rule Linkages */}
          <div className="bg-[#05070D] rounded-2xl border border-slate-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 bg-white/5">
              <h3 className="font-bold text-slate-200 flex items-center gap-2">
                <FileCheck size={18} className="text-amber-500" />
                Legal Knowledge Graph
              </h3>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              {rules.map(rule => (
                <div key={rule.id} className="p-4 bg-white/5 rounded-xl border border-slate-800 border-l-4 border-l-amber-500">
                  <div className="font-bold text-slate-100 text-sm mb-1">{rule.label}</div>
                  <div className="text-xs text-slate-400 mb-3">{rule.properties.description}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-500/20 px-1.5 py-0.5 rounded">MANDATORY</span>
                    <button className="text-[10px] font-bold text-blue-600 hover:underline uppercase">View Rule</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenderTwin;
