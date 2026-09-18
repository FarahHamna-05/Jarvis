import React, { useState } from 'react';
import { History, Check, X, Search, FileJson } from 'lucide-react';

export default function AuditTrail({ auditLogs = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSnapshot, setSelectedSnapshot] = useState(null);

  const filteredLogs = auditLogs.filter((log) => {
    return (log.eventType && log.eventType.toLowerCase().includes(searchTerm.toLowerCase())) ||
           (log.actionTaken && log.actionTaken.toLowerCase().includes(searchTerm.toLowerCase())) ||
           (log.approvedBy && log.approvedBy.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  return (
    <div className="space-y-5 text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2D5AC] pb-5">
        <div>
          <h2 className="text-xl font-extrabold text-[#1E223D] flex items-center space-x-2.5">
            <span className="p-2 rounded-xl bg-red-50 text-[#E51A24] border border-red-200/60">
              <History className="h-5 w-5" />
            </span>
            <span>Immutable Human-in-the-Loop Audit Trail</span>
            <span className="text-xs font-bold text-[#E51A24] bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
              {auditLogs.length} entries
            </span>
          </h2>
          <p className="text-xs text-[#1E223D]/75 mt-1">
            Cryptographically timestamped audit records tracking every AI recommendation, telemetry snapshot, and operator sign-off.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search audit trail..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-[#E2D5AC] bg-white/95 pl-10 pr-4 py-2 text-xs font-semibold text-[#1E223D] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E51A24]/30 focus:border-[#E51A24] shadow-2xs transition"
          />
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-2xl border border-[#E2D5AC] bg-white/95 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50/80 text-[11px] uppercase font-bold text-slate-500 tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Timestamp</th>
                <th className="px-5 py-3.5">Event Type</th>
                <th className="px-5 py-3.5">Action & Reasoning</th>
                <th className="px-5 py-3.5">Human Decision</th>
                <th className="px-5 py-3.5">Sign-off By</th>
                <th className="px-5 py-3.5 text-right">Data Snapshot</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-slate-400 font-medium">
                    No matching audit records found.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const isApproved = log.userApproved === true;
                  const isRejected = log.userApproved === false;

                  return (
                    <tr key={log.id} className="hover:bg-slate-50/70 transition font-medium">
                      <td className="px-5 py-3.5 font-mono text-slate-500 whitespace-nowrap">
                        {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'Just now'}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span className="rounded-lg bg-slate-100 border border-slate-200 px-2.5 py-1 font-mono text-[10px] font-bold text-slate-700">
                          {log.eventType}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-900 max-w-md">
                        <p className="font-bold truncate text-slate-900">{log.actionTaken}</p>
                        {log.reasoningDetails && (
                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{log.reasoningDetails}</p>
                        )}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        {isApproved ? (
                          <span className="inline-flex items-center space-x-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-0.5 text-[10px] font-extrabold">
                            <Check className="h-3.5 w-3.5 stroke-[3]" />
                            <span>APPROVED</span>
                          </span>
                        ) : isRejected ? (
                          <span className="inline-flex items-center space-x-1.5 rounded-full bg-red-50 text-[#E51A24] border border-red-200 px-3 py-0.5 text-[10px] font-extrabold">
                            <X className="h-3.5 w-3.5 stroke-[3]" />
                            <span>REJECTED</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-slate-100 text-slate-600 border border-slate-200 px-2.5 py-0.5 text-[10px] font-mono font-medium">
                            SYSTEM_RUN
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-slate-800 whitespace-nowrap">
                        {log.approvedBy || 'SYSTEM'}
                      </td>
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        {log.dataSnapshotJson ? (
                          <button
                            onClick={() => setSelectedSnapshot(log.dataSnapshotJson)}
                            className="inline-flex items-center space-x-1.5 text-slate-700 hover:text-[#E51A24] hover:bg-red-50 hover:border-red-200 bg-slate-50 px-3 py-1 rounded-xl border border-slate-200 font-mono text-[11px] font-semibold transition"
                          >
                            <FileJson className="h-3.5 w-3.5" />
                            <span>View JSON</span>
                          </button>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Snapshot Modal */}
      {selectedSnapshot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 max-w-xl w-full space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <FileJson className="h-4 w-4 text-[#E51A24]" />
                <span>Audit Telemetry Snapshot (State at Decision Time)</span>
              </h3>
              <button
                onClick={() => setSelectedSnapshot(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <pre className="rounded-xl bg-slate-900 p-4 font-mono text-xs text-emerald-400 overflow-x-auto max-h-80 whitespace-pre-wrap border border-slate-800 shadow-inner">
              {JSON.stringify(typeof selectedSnapshot === 'string' ? JSON.parse(selectedSnapshot) : selectedSnapshot, null, 2)}
            </pre>
            <div className="text-right">
              <button
                onClick={() => setSelectedSnapshot(null)}
                className="rounded-xl bg-[#E51A24] hover:bg-[#C91822] px-5 py-2 text-xs font-bold text-white shadow-sm transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

