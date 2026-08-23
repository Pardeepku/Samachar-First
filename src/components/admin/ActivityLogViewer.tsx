import React from 'react';
import { ActivityLog } from '../../types';
import { Activity, Clock, User, ShieldCheck } from 'lucide-react';

interface ActivityLogViewerProps {
  logs: ActivityLog[];
}

export const ActivityLogViewer: React.FC<ActivityLogViewerProps> = ({ logs }) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif font-black text-xl text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-400" />
          सिस्टम गतिविधि लॉग्स (System Activity Logs)
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          संपादकों व पत्रकारों द्वारा किए गए सभी कार्यों का ऑडिट ट्रेल (Security & Audit Trail)
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-semibold uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">समय (Timestamp)</th>
                <th className="py-3 px-4">उपयोगकर्ता (User)</th>
                <th className="py-3 px-4">क्रिया (Action)</th>
                <th className="py-3 px-4">विवरण (Details)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono text-[11px]">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString('hi-IN')}
                  </td>
                  <td className="py-3 px-4 text-white font-sans font-semibold">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      {log.userName}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-slate-800 text-amber-300 border border-slate-700 px-2 py-0.5 rounded text-[10px] font-bold">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-300 font-sans">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
