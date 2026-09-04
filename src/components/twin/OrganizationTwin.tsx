import React from 'react';
import { DigitalTwin } from '../../types/evaluation';
import { LayoutDashboard, Users, FileText, Activity, ShieldCheck, Briefcase, Landmark, PieChart } from 'lucide-react';
import { motion } from 'motion/react';

interface OrganizationTwinProps {
  twin: DigitalTwin;
}

const OrganizationTwin: React.FC<OrganizationTwinProps> = ({ twin }) => {
  const orgNode = twin.nodes.find(n => n.id === twin.id);
  const tenders = twin.nodes.filter(n => n.type === 'TENDER');
  const suppliers = twin.nodes.filter(n => n.type === 'SUPPLIER');

  const stats = [
    { label: 'Active Tenders', value: tenders.length, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Registered Suppliers', value: 1240, icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Evaluation Workload', value: 'High', icon: Activity, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Compliance Score', value: '98%', icon: ShieldCheck, color: 'text-purple-600', bg: 'bg-purple-50' }
  ];

  return (
    <div className="space-y-6" id="organization-twin">
      {/* Header */}
      <div className="bg-[#05070D] rounded-2xl p-8 border border-slate-800 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
            <Landmark size={40} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-100">{orgNode?.label}</h1>
            <p className="text-slate-400 mt-1">Enterprise Procuring Entity Digital Twin</p>
            <div className="flex items-center gap-4 mt-4">
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-wider">
                {twin.complianceStatus}
              </span>
              <span className="text-xs text-slate-400 font-medium">Last Knowledge Refresh: {new Date(twin.lastUpdated).toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-[#05070D] p-6 rounded-2xl border border-slate-800 shadow-sm">
            <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
              <stat.icon size={20} />
            </div>
            <div className="text-2xl font-bold text-slate-100">{stat.value}</div>
            <div className="text-xs font-bold text-slate-400 uppercase mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Departmental Coverage */}
        <div className="col-span-1 bg-[#05070D] rounded-2xl border border-slate-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800 bg-white/5">
            <h3 className="font-bold text-slate-200 flex items-center gap-2">
              <Briefcase size={18} className="text-blue-500" />
              Departments & Units
            </h3>
          </div>
          <div className="p-6 space-y-4">
            {['Transmission', 'Substations', 'Finance', 'Supply Chain', 'Legal'].map((dept, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-slate-800">
                <span className="font-medium text-slate-300">{dept}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400">{3 + idx} Tenders</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Procurement Lifecycle Overview */}
        <div className="col-span-2 bg-[#05070D] rounded-2xl border border-slate-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800 bg-white/5 flex items-center justify-between">
            <h3 className="font-bold text-slate-200 flex items-center gap-2">
              <PieChart size={18} className="text-purple-500" />
              Historical Procurement Trends
            </h3>
            <button className="text-[10px] font-bold text-blue-600 uppercase">View All Analytics</button>
          </div>
          <div className="p-6">
             <div className="h-64 bg-white/5 rounded-xl border border-dashed border-slate-800 flex items-center justify-center">
                <div className="text-center">
                  <Activity size={32} className="mx-auto text-slate-300 mb-2" />
                  <p className="text-slate-400 text-sm">Interactive trend analysis visualization</p>
                </div>
             </div>
             
             <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="p-4 bg-white/5 rounded-xl border border-slate-800">
                   <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Avg. Cycle Time</div>
                   <div className="text-xl font-bold text-slate-200">42 Days</div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-slate-800">
                   <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Savings Rate</div>
                   <div className="text-xl font-bold text-emerald-600">12.5%</div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-slate-800">
                   <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Contract Variations</div>
                   <div className="text-xl font-bold text-rose-600">2.1%</div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationTwin;
