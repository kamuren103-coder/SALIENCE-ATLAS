import React from 'react';
import { 
  ShieldAlert, 
  Users, 
  Key, 
  Server, 
  CheckCircle, 
  Lock, 
  Activity,
  Sliders
} from 'lucide-react';

export const AdminOsModule: React.FC = () => {
  const users = [
    {
      id: 'usr-01',
      name: 'Eng. Julius Kipng’etich',
      email: 'jkipngetich@ketraco.co.ke',
      role: 'Chief Grid Controller',
      clearance: 'LEVEL_5_EXECUTIVE',
      tenant: 'KETRACO National Grid',
      status: 'ACTIVE',
    },
    {
      id: 'usr-02',
      name: 'Sarah Wambui (Esq.)',
      email: 'swambui@ketraco.co.ke',
      role: 'Head of Procurement & Legal',
      clearance: 'LEVEL_4_STATUTORY',
      tenant: 'KETRACO National Grid',
      status: 'ACTIVE',
    },
    {
      id: 'usr-03',
      name: 'Capt. Kevin Otieno',
      email: 'kotieno@aerotas.co.ke',
      role: 'BVLOS Chief Flight Commander',
      clearance: 'LEVEL_3_OPERATIONAL',
      tenant: 'Drone Flight Consortium',
      status: 'ACTIVE',
    },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#101827] border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400">ACTIVE OPERATORS</div>
          <div className="text-2xl font-bold text-slate-100 mt-1">42 Users</div>
          <div className="text-[11px] text-cyan-400 mt-1">Role-Based Access Enforced</div>
        </div>
        <div className="bg-[#101827] border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400">TENANT ISOLATION</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">Strict RBAC</div>
          <div className="text-[11px] text-emerald-300/80 mt-1">Zero cross-tenant leakage</div>
        </div>
        <div className="bg-[#101827] border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400">MFA ENFORCEMENT</div>
          <div className="text-2xl font-bold text-slate-100 mt-1">100%</div>
          <div className="text-[11px] text-cyan-400 mt-1">FIDO2 / Hardware Security Keys</div>
        </div>
        <div className="bg-[#101827] border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400">SYSTEM HEALTH</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">NOMINAL</div>
          <div className="text-[11px] text-slate-400 mt-1">All services healthy</div>
        </div>
      </div>

      {/* Users & RBAC */}
      <div className="bg-[#101827] border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            <h2 className="font-semibold text-slate-100 text-sm">Operator Clearance & RBAC Directory</h2>
          </div>
          <span className="text-xs font-mono text-slate-400">NATIONAL GRID SECURITY</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#070b14] text-slate-400 font-mono text-[11px] border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">OPERATOR / EMAIL</th>
                <th className="px-4 py-3">ASSIGNED ROLE</th>
                <th className="px-4 py-3">SECURITY CLEARANCE</th>
                <th className="px-4 py-3">TENANT</th>
                <th className="px-4 py-3">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-100">{user.name}</div>
                    <div className="text-[10px] font-mono text-slate-400">{user.email}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-300">{user.role}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[10px]">
                      {user.clearance}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400">{user.tenant}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
                      {user.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
