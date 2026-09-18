import React, { useState } from 'react';
import {
  Mail,
  Send,
  CheckCircle2,
  Clock,
  Sparkles,
  Truck,
  MessageSquare,
  CheckCheck,
  Search
} from 'lucide-react';

export default function CommunicationsInbox({
  conversations = [],
  onSendEmail,
  onSimulateReply,
  currentUser
}) {
  const [selectedConvoId, setSelectedConvoId] = useState(conversations[0]?.id || null);
  const [replyInput, setReplyInput] = useState('');
  const [promisedDays, setPromisedDays] = useState(3);
  const [searchTerm, setSearchTerm] = useState('');

  const selectedConvo = conversations.find((c) => c.id === selectedConvoId) || conversations[0] || null;

  const filteredConvos = conversations.filter((c) => {
    const sName = c?.supplierName || '';
    const subject = c?.threadSubject || c?.productName || '';
    return sName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           subject.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleSendApproved = (messageId) => {
    if (onSendEmail && selectedConvo) {
      onSendEmail(selectedConvo.id, messageId, currentUser?.username || 'Operator');
    }
  };

  const handleSimulateSupplierResponse = () => {
    if (!replyInput.trim() && !selectedConvo) return;
    const body = replyInput.trim() ||
      `Dear SupplyGuard Team,\n\nWe acknowledge your expedited PO request. We can divert a production batch and dispatch 500 units within ${promisedDays} business days via priority air freight at +10% unit charge. Please confirm acceptance.\n\nBest regards,\n${selectedConvo?.supplierName} Fulfillment`;

    if (onSimulateReply && selectedConvo) {
      onSimulateReply(selectedConvo.id, body, promisedDays);
      setReplyInput('');
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="border-b border-[#280B0B]/15 pb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-[#280B0B] flex items-center space-x-2.5 tracking-tight">
            <MessageSquare className="h-5 w-5 text-[#C92924] fill-current" />
            <span>Autonomous Supplier Communications Desk</span>
            <span className="text-xs font-bold text-[#C92924] bg-white/70 px-2.5 py-0.5 rounded-full border border-[#C92924]/30 shadow-2xs">
              {conversations.length} active threads
            </span>
          </h2>
          <p className="text-xs text-[#280B0B]/80 font-medium mt-1">
            Human-in-the-loop autonomous procurement email drafts, negotiation transcripts, and webhook ingestion.
          </p>
        </div>
      </div>

      {conversations.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500 space-y-3">
          <MessageSquare className="h-10 w-10 text-slate-300 mx-auto" />
          <p className="text-sm font-bold text-slate-800">No active communication threads yet</p>
          <p className="text-xs text-slate-500">
            Autonomous drafts are created automatically when high-risk events emerge or when requesting alternate vendor quotes.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 rounded-2xl border border-slate-200/80 overflow-hidden h-[640px] shadow-sm bg-white">
          
          {/* Left Thread List (col-4) */}
          <div className="lg:col-span-4 bg-slate-50/60 border-r border-slate-200 flex flex-col justify-between">
            {/* Search */}
            <div className="p-3 bg-white border-b border-slate-200">
              <div className="relative">
                <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search supplier communications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl bg-slate-50 pl-10 pr-3 py-2 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#E51A24] focus:ring-2 focus:ring-red-100 border border-slate-200"
                />
              </div>
            </div>

            {/* Thread List Items */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-200/60">
              {filteredConvos.map((convo) => {
                const isSelected = selectedConvo?.id === convo.id;
                const lastMsg = convo.messages && convo.messages.length > 0
                  ? convo.messages[convo.messages.length - 1]
                  : null;
                const hasPending = convo.messages?.some((m) => m.deliveryStatus === 'PENDING_APPROVAL');

                return (
                  <button
                    key={convo.id}
                    onClick={() => setSelectedConvoId(convo.id)}
                    className={`w-full text-left p-4 flex items-start space-x-3 transition-colors ${
                      isSelected ? 'bg-white border-l-4 border-[#C92924] text-slate-900 shadow-xs' : 'hover:bg-slate-100/70 text-slate-700'
                    }`}
                  >
                    {/* Circular Avatar */}
                    <div className="h-10 w-10 rounded-full bg-red-50/80 border border-red-200/80 flex items-center justify-center text-xs font-bold text-[#C92924] shrink-0 uppercase shadow-xs">
                      {convo.supplierName ? convo.supplierName.substring(0, 2) : 'SP'}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {convo.supplierName || 'Unknown Vendor'}
                        </span>
                        <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                          {lastMsg?.timestamp || 'Now'}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-600 truncate mt-0.5 font-medium">
                        {convo.threadSubject || convo.productName || 'Procurement Thread'}
                      </p>

                      <div className="mt-1.5 flex items-center justify-between text-[10px]">
                        <span className="text-slate-400 truncate max-w-[140px]">
                          {lastMsg ? (lastMsg.body || lastMsg.text || 'Message sent').substring(0, 30) + '...' : 'Draft created'}
                        </span>
                        {hasPending && (
                          <span className="rounded-full bg-red-50 text-[#E51A24] border border-red-200 px-2 py-0.5 text-[9px] font-bold">
                            Action Required
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chat Conversation View Right (col-8) */}
          <div className="lg:col-span-8 bg-white flex flex-col justify-between overflow-hidden">
            {selectedConvo ? (
              <>
                {/* Chat Top Bar */}
                <div className="border-b border-slate-100 px-5 py-3.5 bg-white flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-9 w-9 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-xs font-bold text-[#E51A24] uppercase">
                      {(selectedConvo.supplierName || 'SP').substring(0, 2)}
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">{selectedConvo.supplierName || 'Vendor'}</h3>
                      <p className="text-[10px] text-slate-500 flex items-center space-x-1.5 font-mono">
                        <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                        <span>{selectedConvo.supplierEmail || 'vendor@supplychain.net'}</span>
                        <span>&bull;</span>
                        <span>SKU: {selectedConvo.productName || 'Inventory SKU'}</span>
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold text-slate-700">
                    Audit-Verified
                  </span>
                </div>

                {/* Messages Stream */}
                <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/30">
                  {/* Security Notice */}
                  <div className="flex justify-center">
                    <div className="rounded-full bg-white border border-slate-200 px-4 py-1 text-[10px] font-medium text-slate-500 text-center max-w-md shadow-xs">
                      🔒 Verified against real-time risk engine and sealed in audit log.
                    </div>
                  </div>

                  {selectedConvo?.messages?.map((msg, mIdx) => {
                    const isAI = msg.sender === 'AI' || msg.sender === 'SUPPLYGUARD_AI';
                    const isPending = msg.deliveryStatus === 'PENDING_APPROVAL';

                    return (
                      <div
                        key={msg.id || mIdx}
                        className={`flex flex-col ${isAI ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`relative max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 shadow-sm border ${
                            isAI
                              ? 'bg-red-50/80 text-slate-900 border-red-200 rounded-tr-none'
                              : 'bg-white text-slate-900 border-slate-200 rounded-tl-none'
                          }`}
                        >
                          {/* Sender Label */}
                          <div className="flex items-center justify-between text-[10px] font-bold mb-1.5">
                            <span className={isAI ? 'text-[#E51A24]' : 'text-slate-700'}>
                              {msg.senderName || (isAI ? 'SupplyGuard Autonomous Agent' : (selectedConvo.supplierName || 'Supplier'))}
                            </span>
                            <span className={`text-[9px] uppercase ml-2 px-1.5 py-0.5 rounded ${
                              isAI ? 'bg-red-100 text-[#E51A24]' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {msg.deliveryStatus || (isAI ? 'SENT' : 'RECEIVED')}
                            </span>
                          </div>

                          {/* Body */}
                          <p className="text-xs whitespace-pre-wrap leading-relaxed font-sans font-medium text-slate-800">
                            {msg.body || msg.text || ''}
                          </p>

                          {/* Footer Timestamp & Checkmark */}
                          <div className="mt-2 flex items-center justify-end space-x-1 text-[10px] font-mono text-slate-400">
                            <span>
                              {msg.timestamp || 'Now'}
                            </span>
                            {isAI && (
                              <CheckCheck className="h-3.5 w-3.5 stroke-[2] text-[#C92924]" />
                            )}
                          </div>

                          {/* Human Approval Action on Draft */}
                          {isPending && (
                            <div className="mt-3 pt-3 border-t border-red-200 flex items-center justify-between">
                              <span className="text-[10px] font-bold text-[#C92924] flex items-center space-x-1">
                                <Clock className="h-3.5 w-3.5" />
                                <span>Pending Sign-Off</span>
                              </span>
                              <button
                                onClick={() => handleSendApproved(msg.id)}
                                className="flex items-center space-x-1.5 rounded-full bg-[#C92924] hover:bg-[#a8201c] text-white font-bold px-3.5 py-1.5 text-xs shadow-sm transition hover:scale-105"
                              >
                                <Send className="h-3 w-3" />
                                <span>Authorize & Dispatch</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Simulation Composer */}
                <div className="p-4 bg-white border-t border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 px-1">
                    <span className="flex items-center space-x-1.5">
                      <Truck className="h-3.5 w-3.5 text-[#C92924]" />
                      <span>Simulate Vendor Reply (Webhook Ingestion)</span>
                    </span>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-slate-500">Promised Air Freight:</span>
                      <select
                        value={promisedDays}
                        onChange={(e) => setPromisedDays(Number(e.target.value))}
                        className="rounded-lg bg-slate-50 border border-slate-200 px-2 py-0.5 text-xs font-bold text-slate-800"
                      >
                        <option value={2}>2 days</option>
                        <option value={3}>3 days</option>
                        <option value={5}>5 days</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={replyInput}
                      onChange={(e) => setReplyInput(e.target.value)}
                      placeholder={`Type simulated response from ${selectedConvo.supplierName}...`}
                      className="flex-1 rounded-xl bg-slate-50 px-4 py-2.5 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#C92924] focus:ring-2 focus:ring-red-100 border border-slate-200"
                    />
                    <button
                      onClick={handleSimulateSupplierResponse}
                      className="rounded-xl bg-[#C92924] hover:bg-[#a8201c] text-white p-2.5 font-bold shadow-sm transition flex items-center justify-center"
                      title="Send Vendor Response"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-400 text-xs font-semibold">
                Select a thread to view supplier negotiations
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
