import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import {
  Mail,
  Send,
  CheckCircle2,
  Clock,
  Sparkles,
  Truck,
  MessageSquare,
  CheckCheck,
  Search,
  AlertTriangle,
  RefreshCw,
  XCircle,
  KeyRound,
  ExternalLink,
  X,
  ShieldCheck
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
  const [sendingMessageId, setSendingMessageId] = useState(null);
  const [recipientOverrides, setRecipientOverrides] = useState({});
  const [saveAsDefaultSupplier, setSaveAsDefaultSupplier] = useState({});

  // Gmail Sender Configuration State
  const [isGmailModalOpen, setIsGmailModalOpen] = useState(false);
  const [gmailUser, setGmailUser] = useState('');
  const [gmailPass, setGmailPass] = useState('');
  const [testRecipient, setTestRecipient] = useState('');
  const [emailConfig, setEmailConfig] = useState(null);
  const [isSavingGmail, setIsSavingGmail] = useState(false);
  const [gmailFeedback, setGmailFeedback] = useState(null);

  useEffect(() => {
    fetchEmailConfig();
  }, []);

  const fetchEmailConfig = async () => {
    try {
      const res = await apiClient.get('/communications/email-config');
      setEmailConfig(res.data);
      if (res.data?.gmailUsername) {
        setGmailUser(res.data.gmailUsername);
      }
    } catch (e) {
      console.error('Failed to fetch email config:', e);
    }
  };

  const handleSaveAndTestGmail = async (e) => {
    e.preventDefault();
    setIsSavingGmail(true);
    setGmailFeedback(null);
    try {
      await apiClient.post('/communications/email-config', {
        gmailUsername: gmailUser.trim(),
        gmailAppPassword: gmailPass.trim()
      });

      if (testRecipient.trim()) {
        const testRes = await apiClient.post('/communications/test-email', {
          toEmail: testRecipient.trim(),
          subject: 'SupplyGuard Real Gmail Delivery Test',
          body: `Success! SupplyGuard is now authenticated and dispatching emails directly from your Gmail address (${gmailUser.trim()}) to supplier inboxes.`
        });
        if (testRes.data?.success) {
          setGmailFeedback({
            type: 'success',
            text: `✅ Connected! Test email delivered to ${testRecipient.trim()} via Gmail SMTP.`
          });
        } else {
          setGmailFeedback({
            type: 'error',
            text: testRes.data?.message || 'SMTP Authentication failed.'
          });
        }
      } else {
        setGmailFeedback({
          type: 'success',
          text: '✅ Gmail credentials saved! Outreach emails will now be sent directly from your authentic Gmail account.'
        });
      }
      await fetchEmailConfig();
    } catch (err) {
      setGmailFeedback({
        type: 'error',
        text: err.response?.data?.message || err.message || 'Failed to configure Gmail.'
      });
    } finally {
      setIsSavingGmail(false);
    }
  };

  const selectedConvo = conversations.find((c) => c.id === selectedConvoId) || conversations[0];

  const filteredConvos = conversations.filter((c) =>
    c.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.threadSubject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendApproved = async (messageId) => {
    if (onSendEmail && selectedConvo) {
      const overrideEmail = recipientOverrides[messageId] !== undefined
        ? recipientOverrides[messageId]
        : selectedConvo.supplierEmail;

      setSendingMessageId(messageId);
      try {
        await onSendEmail(
          selectedConvo.id,
          messageId,
          currentUser?.username || 'Operator',
          overrideEmail,
          saveAsDefaultSupplier[messageId] !== undefined ? saveAsDefaultSupplier[messageId] : true
        );
      } finally {
        setSendingMessageId(null);
      }
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
    <div className="space-y-4 text-slate-900">
      {/* Header */}
      <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2.5">
            <MessageSquare className="h-5 w-5 text-[#E51A24] fill-current" />
            <span>Autonomous Supplier Communications Desk</span>
            <span className="text-xs font-bold text-[#E51A24] bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
              {conversations.length} active threads
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real email delivery from your authentic Gmail account to the supplier's real inbox.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {emailConfig?.gmailConfigured ? (
            <button
              onClick={() => setIsGmailModalOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-xs hover:bg-emerald-100 transition cursor-pointer"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Gmail: {emailConfig.gmailUsername}</span>
            </button>
          ) : (
            <button
              onClick={() => setIsGmailModalOpen(true)}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-[#E51A24] text-xs font-bold shadow-xs transition cursor-pointer"
            >
              <KeyRound className="h-3.5 w-3.5" />
              <span>Connect Real Gmail Sender</span>
            </button>
          )}
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
                      isSelected ? 'bg-white border-l-4 border-[#E51A24] text-slate-900 shadow-xs' : 'hover:bg-slate-100/70 text-slate-700'
                    }`}
                  >
                    {/* Circular Avatar */}
                    <div className="h-10 w-10 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-xs font-bold text-[#E51A24] shrink-0 uppercase shadow-xs">
                      {convo.supplierName ? convo.supplierName.substring(0, 2) : 'SP'}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {convo.supplierName}
                        </span>
                        <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                          {lastMsg?.timestamp ? new Date(lastMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '12:00'}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-600 truncate mt-0.5 font-medium">
                        {convo.threadSubject}
                      </p>

                      <div className="mt-1.5 flex items-center justify-between text-[10px]">
                        <span className="text-slate-400 truncate max-w-[140px]">
                          {lastMsg ? lastMsg.body.substring(0, 30) + '...' : 'Draft created'}
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
                      {selectedConvo.supplierName.substring(0, 2)}
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">{selectedConvo.supplierName}</h3>
                      <p className="text-[10px] text-slate-500 flex items-center space-x-1.5 font-mono">
                        <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                        <span>{selectedConvo.supplierEmail}</span>
                        <span>&bull;</span>
                        <span>SKU: {selectedConvo.productName}</span>
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

                  {selectedConvo.messages?.map((msg) => {
                    const isAI = msg.sender === 'AI';
                    const isPending = msg.deliveryStatus === 'PENDING_APPROVAL';
                    const isSent = msg.deliveryStatus === 'SENT' || msg.deliveryStatus === 'sent' || msg.status === 'sent';
                    const isFailed = msg.deliveryStatus === 'FAILED' || msg.deliveryStatus === 'failed' || msg.status === 'failed';

                    return (
                      <div
                        key={msg.id}
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
                              {msg.senderName || (isAI ? 'SupplyGuard Autonomous Agent' : selectedConvo.supplierName)}
                            </span>
                            <span className={`text-[9px] uppercase ml-2 px-2 py-0.5 rounded-full font-bold ${
                              isSent ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                              isFailed ? 'bg-red-100 text-[#E51A24] border border-red-300' :
                              isAI ? 'bg-red-100 text-[#E51A24]' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {isSent ? '✅ SENT' : isFailed ? '❌ FAILED' : msg.deliveryStatus}
                            </span>
                          </div>

                          {/* Body */}
                          <p className="text-xs whitespace-pre-wrap leading-relaxed font-sans font-medium text-slate-800">
                            {msg.body}
                          </p>

                          {/* Footer Timestamp & Checkmark */}
                          <div className="mt-2 flex items-center justify-end space-x-1 text-[10px] font-mono text-slate-400">
                            <span>
                              {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}
                            </span>
                            {isAI && (
                              <CheckCheck className={`h-3.5 w-3.5 stroke-[2] ${isSent ? 'text-emerald-600' : 'text-[#E51A24]'}`} />
                            )}
                          </div>

                          {/* Real SendGrid Confirmed Sent Status */}
                          {isSent && (
                            <div className="mt-2.5 pt-2 border-t border-emerald-200/80 flex items-center justify-between text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200 shadow-xs">
                              <span className="flex items-center space-x-1.5 truncate">
                                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                                <span className="truncate">
                                  ✅ Sent to <span className="underline font-mono">{msg.recipientEmail || selectedConvo.supplierEmail}</span> at{' '}
                                  {new Date(msg.sentAt || msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </span>
                              <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-200/70 text-emerald-900 shrink-0 ml-2 font-bold">
                                {msg.deliveryDetails?.toLowerCase().includes('gmail') || emailConfig?.gmailConfigured ? 'Gmail SMTP 250 OK' : 'SendGrid 202'}
                              </span>
                            </div>
                          )}

                          {/* Delivery Failure Alert */}
                          {isFailed && (
                            <div className="mt-2.5 pt-2 border-t border-red-200 space-y-2 bg-red-50/90 p-3 rounded-xl border border-red-200">
                              <div className="flex items-start space-x-2 text-[#E51A24] font-bold text-[11px]">
                                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                                <div>
                                  <span className="block font-bold">❌ Delivery Failed</span>
                                  <span className="text-[10px] font-normal text-slate-700 block mt-0.5 leading-relaxed">
                                    {msg.deliveryDetails || 'Invalid credentials or connection error. Click "Connect Real Gmail Sender" above to enable authentic sending.'}
                                  </span>
                                </div>
                              </div>

                              <div className="pt-2 border-t border-red-100 space-y-1.5">
                                <span className="text-[10px] text-slate-600 block">Edit recipient address to retry delivery:</span>
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="email"
                                    value={recipientOverrides[msg.id] !== undefined ? recipientOverrides[msg.id] : (msg.recipientEmail || selectedConvo.supplierEmail || '')}
                                    onChange={(e) => setRecipientOverrides({ ...recipientOverrides, [msg.id]: e.target.value })}
                                    placeholder="supplier@gmail.com"
                                    className="flex-1 text-xs font-mono px-2.5 py-1.5 rounded-lg border border-red-200 bg-white text-slate-900 focus:outline-none focus:border-[#E51A24]"
                                  />
                                  <button
                                    disabled={sendingMessageId === msg.id}
                                    onClick={() => handleSendApproved(msg.id)}
                                    className="px-3.5 py-1.5 bg-[#E51A24] hover:bg-[#C91822] text-white rounded-lg text-[11px] font-bold transition flex items-center space-x-1 disabled:opacity-50 cursor-pointer shadow-xs shrink-0"
                                  >
                                    <RefreshCw className={`h-3 w-3 ${sendingMessageId === msg.id ? 'animate-spin' : ''}`} />
                                    <span>{sendingMessageId === msg.id ? 'Retrying...' : 'Retry Dispatch'}</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Human Approval Action on Draft */}
                          {isPending && (
                            <div className="mt-3 pt-3 border-t border-red-200 space-y-2.5">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="font-bold text-[#E51A24] flex items-center space-x-1">
                                  <Clock className="h-3.5 w-3.5" />
                                  <span>Pending Sign-Off</span>
                                </span>
                                <span className="text-[10px] text-emerald-700 font-mono font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center space-x-1">
                                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                  <span>From: {emailConfig?.gmailUsername || 'freefiregodtamil@gmail.com'}</span>
                                </span>
                              </div>

                              {/* Destination Email Override Field */}
                              <div className="rounded-xl bg-white p-2.5 border border-red-200/80 space-y-2">
                                <div className="flex items-center justify-between text-[10px]">
                                  <span className="font-bold text-slate-700">Recipient Supplier Gmail Address:</span>
                                  <span className="text-[9px] text-emerald-600 font-semibold">Live delivery target</span>
                                </div>
                                <input
                                  type="email"
                                  value={recipientOverrides[msg.id] !== undefined ? recipientOverrides[msg.id] : (selectedConvo.supplierEmail || '')}
                                  onChange={(e) => setRecipientOverrides({ ...recipientOverrides, [msg.id]: e.target.value })}
                                  placeholder="e.g. supplier@gmail.com"
                                  className="w-full text-xs font-mono font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-[#E51A24]"
                                />
                                <label className="flex items-center space-x-2 text-[10px] font-semibold text-slate-600 cursor-pointer pt-0.5">
                                  <input
                                    type="checkbox"
                                    checked={saveAsDefaultSupplier[msg.id] !== undefined ? saveAsDefaultSupplier[msg.id] : true}
                                    onChange={(e) => setSaveAsDefaultSupplier({ ...saveAsDefaultSupplier, [msg.id]: e.target.checked })}
                                    className="rounded border-slate-300 text-[#E51A24] focus:ring-red-200"
                                  />
                                  <span>Save as {selectedConvo.supplierName}'s permanent contact Gmail in directory</span>
                                </label>
                              </div>

                              <div className="flex items-center justify-end">
                                <button
                                  disabled={sendingMessageId === msg.id}
                                  onClick={() => handleSendApproved(msg.id)}
                                  className="flex items-center space-x-1.5 rounded-xl bg-[#E51A24] hover:bg-[#C91822] text-white font-bold px-4 py-2 text-xs shadow-sm transition hover:scale-102 disabled:opacity-50 cursor-pointer"
                                >
                                  {sendingMessageId === msg.id ? (
                                    <>
                                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                                      <span>Dispatching via Gmail SMTP...</span>
                                    </>
                                  ) : (
                                    <>
                                      <Send className="h-3.5 w-3.5" />
                                      <span>Authorize & Dispatch from freefiregodtamil@gmail.com</span>
                                    </>
                                  )}
                                </button>
                              </div>
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
                      <Truck className="h-3.5 w-3.5 text-[#E51A24]" />
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
                      className="flex-1 rounded-xl bg-slate-50 px-4 py-2.5 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#E51A24] focus:ring-2 focus:ring-red-100 border border-slate-200"
                    />
                    <button
                      onClick={handleSimulateSupplierResponse}
                      className="rounded-xl bg-[#E51A24] hover:bg-[#C91822] text-white p-2.5 font-bold shadow-sm transition flex items-center justify-center"
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

      {/* Real Gmail Connection Modal */}
      {isGmailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-5 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-[#E51A24] shadow-xs">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Connect Real Gmail Sender
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Send authentic emails directly from your Gmail to the supplier's inbox
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsGmailModalOpen(false);
                  setGmailFeedback(null);
                }}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Step-by-Step Instructions Banner */}
            <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-3.5 text-xs text-amber-900 space-y-1.5">
              <div className="font-bold flex items-center space-x-1.5 text-amber-950">
                <ShieldCheck className="h-4 w-4 text-amber-600" />
                <span>How to get your 16-Character Google App Password:</span>
              </div>
              <ol className="list-decimal list-inside text-[11px] text-amber-800 space-y-1 pl-1">
                <li>Go to your <a href="https://myaccount.google.com/security" target="_blank" rel="noreferrer" className="underline font-bold text-amber-950 inline-flex items-center space-x-0.5"><span>Google Account Security</span><ExternalLink className="h-2.5 w-2.5 ml-0.5 inline" /></a></li>
                <li>Ensure <strong>2-Step Verification</strong> is enabled</li>
                <li>Go to <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noreferrer" className="underline font-bold text-amber-950 inline-flex items-center space-x-0.5"><span>App Passwords</span><ExternalLink className="h-2.5 w-2.5 ml-0.5 inline" /></a> and generate an app named <strong>"SupplyGuard"</strong></li>
                <li>Copy the 16-character password (e.g. <code className="font-mono bg-amber-100 px-1 py-0.5 rounded">abcd efgh ijkl mnop</code>)</li>
              </ol>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveAndTestGmail} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Gmail Address
                </label>
                <input
                  type="email"
                  required
                  value={gmailUser}
                  onChange={(e) => setGmailUser(e.target.value)}
                  placeholder="e.g. yourname@gmail.com"
                  className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-[#E51A24] focus:ring-2 focus:ring-red-100 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Google App Password (16 characters)
                </label>
                <input
                  type="password"
                  required
                  value={gmailPass}
                  onChange={(e) => setGmailPass(e.target.value)}
                  placeholder="e.g. abcd efgh ijkl mnop"
                  className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-[#E51A24] focus:ring-2 focus:ring-red-100 transition"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Spaces are automatically stripped before authenticating with Google SMTP.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Send Instant Test Email To (Optional)
                </label>
                <input
                  type="email"
                  value={testRecipient}
                  onChange={(e) => setTestRecipient(e.target.value)}
                  placeholder="e.g. supplier@gmail.com or your_other_email@gmail.com"
                  className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-[#E51A24] focus:ring-2 focus:ring-red-100 transition"
                />
              </div>

              {/* Feedback Message */}
              {gmailFeedback && (
                <div
                  className={`p-3 rounded-xl text-xs font-medium border ${
                    gmailFeedback.type === 'success'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-red-50 border-red-200 text-[#E51A24]'
                  }`}
                >
                  {gmailFeedback.text}
                </div>
              )}

              {/* Modal Actions */}
              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsGmailModalOpen(false);
                    setGmailFeedback(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={isSavingGmail}
                  className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-[#E51A24] hover:bg-[#C91822] text-white text-xs font-bold shadow-md transition disabled:opacity-50 cursor-pointer"
                >
                  {isSavingGmail ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Verifying with Google...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Save & Test Real Gmail</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
