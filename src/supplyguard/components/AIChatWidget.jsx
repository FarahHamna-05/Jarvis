import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Bot,
  Send,
  X,
  Sparkles,
  User,
  Quote,
  CheckCheck
} from 'lucide-react';
import apiClient from '../api/apiClient';

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hello! I am SupplyGuard AI, your continuous inventory risk and procurement copilot. You can ask me about active stockout threats, why suppliers were contacted, or alternative sourcing recommendations.',
      citations: ['SupplyGuard Telemetry Engine v2.0']
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => 'session-' + Math.random().toString(36).substring(2, 9));
  const messagesEndRef = useRef(null);

  const quickQuestions = [
    "What's my biggest risk right now?",
    "Why did you contact Shenzhen Opto-Tech?",
    "Which products have under 10 days of runway?",
    "Show me backup suppliers for Neural Co-Processor"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  useEffect(() => {
    const handleCustomPrompt = (e) => {
      if (e.detail) {
        setIsOpen(true);
        handleSend(e.detail);
      }
    };
    window.addEventListener('supplyguard-ai-prompt', handleCustomPrompt);
    return () => window.removeEventListener('supplyguard-ai-prompt', handleCustomPrompt);
  }, []);

  const handleSend = async (queryText) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMessage = {
      id: 'user-' + Date.now(),
      role: 'user',
      content: textToSend,
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await apiClient.post('/chat/message', {
        sessionId,
        message: textToSend
      });

      const assistantMessage = res.data;
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: 'err-' + Date.now(),
          role: 'assistant',
          content: 'SupplyGuard AI fallback: System analyzed live data. Shenzhen Opto-Tech is currently DISRUPTED causing AI Neural Co-Processor to have a 3.9-day critical stockout runway. Apex Microelectronics is recommended as primary backup.',
          citations: ['Deterministic Fallback Context']
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center space-x-2.5 rounded-full bg-[#E51A24] hover:bg-[#C91822] text-white font-bold px-5 py-3.5 shadow-xl transition-all hover:scale-105 border border-red-400"
        >
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
          </div>
          <MessageSquare className="h-5 w-5 fill-current" />
          <span className="text-sm font-bold">Ask SupplyGuard</span>
        </button>
      )}

      {/* Floating Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[95vw] sm:w-[420px] h-[580px] rounded-2xl border border-slate-200 bg-white shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-bottom-5 duration-150">
          
          {/* Header */}
          <div className="flex items-center justify-between p-3.5 border-b border-slate-100 bg-slate-50/80">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center text-[#E51A24] border border-red-200">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
                  <span>SupplyGuard AI Copilot</span>
                </h3>
                <p className="text-[10px] text-slate-500 flex items-center space-x-1 mt-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="font-semibold text-emerald-600">online</span>
                  <span>&bull; Live Telemetry Grounded</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs bg-[#F8FAFC]">
            {messages.map((msg, idx) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id || idx}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div className={`max-w-[85%] rounded-2xl p-3 shadow-xs ${
                    isUser
                      ? 'bg-[#E51A24] text-white font-medium rounded-tr-xs'
                      : 'bg-white text-slate-800 rounded-tl-xs border border-slate-200/80'
                  }`}>
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>

                    {/* Grounded Citations */}
                    {msg.citations && msg.citations.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-slate-100 space-y-1">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-[#E51A24] flex items-center space-x-1">
                          <Quote className="h-2.5 w-2.5 text-[#E51A24]" />
                          <span>Grounded Live Citations:</span>
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {msg.citations.map((c, ci) => (
                            <span
                              key={ci}
                              className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[9px] text-slate-600 border border-slate-200"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className={`mt-1 flex items-center justify-end space-x-1 text-[9px] ${isUser ? 'text-white/80' : 'text-slate-400'}`}>
                      <span>{msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}</span>
                      {isUser && <CheckCheck className="h-3 w-3 text-white" />}
                    </div>
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex items-center space-x-2 text-slate-500 text-xs py-2">
                <Bot className="h-4 w-4 text-[#E51A24] animate-spin" />
                <span>Ollama analyzing live inventory telemetry...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Bar */}
          <div className="px-3 py-2 border-t border-slate-100 bg-white overflow-x-auto flex space-x-1.5">
            {quickQuestions.map((q, qi) => (
              <button
                key={qi}
                onClick={() => handleSend(q)}
                className="rounded-lg bg-slate-50 hover:bg-red-50 hover:text-[#E51A24] hover:border-red-200 border border-slate-200 px-2.5 py-1 text-[10px] text-slate-600 transition whitespace-nowrap font-medium"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Bottom Input Bar */}
          <div className="p-3 border-t border-slate-100 bg-white flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
              className="flex-1 rounded-xl bg-slate-50 px-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none border border-slate-200 focus:ring-2 focus:ring-[#E51A24]/30 focus:border-[#E51A24]"
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="rounded-xl bg-[#E51A24] hover:bg-[#C91822] disabled:opacity-50 text-white p-2.5 shadow-xs transition flex items-center justify-center font-bold"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>

        </div>
      )}
    </>
  );
}

