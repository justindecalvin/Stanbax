import React, { useState, useRef, useEffect } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { 
  X, 
  Send, 
  Bot, 
  Sparkles, 
  User, 
  Clock, 
  Lock, 
  Smile, 
  Paperclip, 
  GraduationCap, 
  Users, 
  ChevronRight, 
  RotateCcw,
  CheckCircle2,
  Copy,
  Check
} from 'lucide-react';
import { SchoolLogo } from '../SchoolLogo';

interface SchoolChatSystemProps {
  currentUserRole: string;
  currentUserId: string;
  currentUserName: string;
  currentUserSubtext?: string;
  initialPopupChannelId: string;
  onClosePopup: () => void;
  hideStories?: boolean;
}

export const SchoolChatSystem: React.FC<SchoolChatSystemProps> = ({
  currentUserRole,
  currentUserId,
  currentUserName,
  currentUserSubtext,
  initialPopupChannelId,
  onClosePopup
}) => {
  const { 
    chatChannels, 
    chatMessages, 
    sendChatMessage, 
    schoolInfo 
  } = useSchool();

  const [activeChannelId, setActiveChannelId] = useState<string>(initialPopupChannelId);
  const [inputText, setInputText] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Dedicated Calvin AI conversation history stored in local state/storage
  const isCalvinAi = activeChannelId === 'calvin-ai';

  const [calvinMessages, setCalvinMessages] = useState<Array<{
    id: string;
    sender: 'user' | 'calvin';
    text: string;
    timestamp: string;
  }>>(() => {
    try {
      const saved = localStorage.getItem(`calvin_popup_${currentUserId}`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'calvin-welcome',
        sender: 'calvin',
        text: `Hello ${currentUserName.split(' ')[0] || 'Scholar'}! I am **Calvin**, the official 24/7 AI Ambassador and Academic Tutor for **${schoolInfo?.name || 'Stanbax Schools'}**.\n\nI can answer questions regarding:\n• **Academic Tutoring**: Mathematics, Physics, Chemistry, Biology, English and Senior WAEC/Cambridge exam prep\n• **Admissions & School Life**: Tuition fees, resumption dates, student clubs, and campus facilities\n\nHow can I help you excel today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem(`calvin_popup_${currentUserId}`, JSON.stringify(calvinMessages));
    } catch {}
  }, [calvinMessages, currentUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [calvinMessages, chatMessages, isAiLoading, activeChannelId]);

  const activeChannel = chatChannels.find(c => c.id === activeChannelId);

  const handleSendCalvinMessage = async () => {
    const textToSend = inputText.trim();
    if (!textToSend || isAiLoading) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user' as const,
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setCalvinMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsAiLoading(true);

    try {
      // Build conversation history for API
      const history = calvinMessages.slice(-6).map(m => ({
        role: m.sender === 'user' ? ('user' as const) : ('model' as const),
        parts: [{ text: m.text }]
      }));

      const res = await fetch('/api/calvin-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          studentName: currentUserName,
          role: currentUserRole,
          classLevel: currentUserSubtext?.includes('Scholar') ? currentUserSubtext : 'SSS 2',
          chatHistory: history
        })
      });

      const data = await res.json();
      const replyText = data?.reply || "I am here to assist your academic journey at Stanbax Schools. Please ask your question again.";

      setCalvinMessages(prev => [
        ...prev,
        {
          id: `calvin-${Date.now()}`,
          sender: 'calvin',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      setCalvinMessages(prev => [
        ...prev,
        {
          id: `calvin-${Date.now()}`,
          sender: 'calvin',
          text: "I am ready to help you learn! Stanbax Schools is dedicated to excellence and character. Feel free to rephrase your academic or admissions question.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSendChannelMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    if (isCalvinAi) {
      handleSendCalvinMessage();
      return;
    }

    if (activeChannel?.isReadOnly && currentUserRole !== 'admin') {
      return;
    }

    sendChatMessage({
      channelId: activeChannelId,
      senderId: currentUserId,
      senderName: currentUserName,
      senderRole: currentUserRole as any,
      content: inputText.trim()
    });

    setInputText('');
  };

  const channelMessages = chatMessages.filter(m => m.channelId === activeChannelId);

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200"
      onClick={onClosePopup}
    >
      <div 
        className="w-full max-w-2xl h-[92vh] max-h-[720px] bg-white rounded-3xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-stone-900 text-white p-4 sm:p-5 flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3 min-w-0">
            {isCalvinAi ? (
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-stone-950 flex items-center justify-center shadow-lg font-black shrink-0 ring-2 ring-amber-400/50">
                <Sparkles className="w-5 h-5 text-stone-950" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-white shrink-0">
                {activeChannel?.type === 'announcement' ? <SchoolLogo size="xs" showText={false} /> : <Users className="w-5 h-5 text-indigo-300" />}
              </div>
            )}

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base text-white truncate">
                  {isCalvinAi ? 'Calvin AI (Official Tutor & Ambassador)' : activeChannel?.name || 'School Discussion'}
                </h3>
                {isCalvinAi && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-stone-950 uppercase tracking-wider">
                    24/7 AI
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-300 truncate">
                {isCalvinAi ? 'Instant, tailored academic derivations & admissions knowledge' : activeChannel?.description || 'Community Channel'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClosePopup}
            className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition cursor-pointer shrink-0"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-stone-50/50">
          {isCalvinAi ? (
            // Calvin AI Conversation List
            <>
              {calvinMessages.map(msg => (
                <div 
                  key={msg.id}
                  className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'calvin' && (
                    <div className="w-8 h-8 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center shrink-0 shadow-xs font-bold text-xs mt-1">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`max-w-[85%] rounded-2xl p-4 shadow-2xs ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-xs'
                      : 'bg-white text-stone-800 border border-stone-200 rounded-tl-xs'
                  }`}>
                    <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-normal">
                      {msg.text}
                    </div>
                    <div className={`text-[10px] mt-2 flex items-center gap-2 ${
                      msg.sender === 'user' ? 'text-blue-200 justify-end' : 'text-stone-400 justify-between'
                    }`}>
                      <span>{msg.timestamp}</span>
                      {msg.sender === 'calvin' && (
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(msg.text);
                            setCopiedId(msg.id);
                            setTimeout(() => setCopiedId(null), 2000);
                          }}
                          className="hover:text-stone-700 cursor-pointer flex items-center gap-1"
                        >
                          {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isAiLoading && (
                <div className="flex gap-3 justify-start items-center">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center shrink-0 shadow-xs animate-bounce">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="bg-white border border-stone-200 rounded-2xl px-4 py-3 shadow-2xs flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                    <span className="text-xs text-stone-500 font-semibold">Calvin is preparing your tailored response...</span>
                  </div>
                </div>
              )}
            </>
          ) : (
            // Standard Channel Messages
            <>
              {channelMessages.length === 0 ? (
                <div className="text-center py-16 text-stone-400 space-y-2">
                  <p className="text-sm font-semibold">No messages yet in this discussion.</p>
                  <p className="text-xs">Be the first to share an academic insight or update!</p>
                </div>
              ) : (
                channelMessages.map(msg => {
                  const isMine = msg.senderId === currentUserId;
                  return (
                    <div 
                      key={msg.id}
                      className={`flex gap-3 ${isMine ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[85%] rounded-2xl p-4 shadow-2xs ${
                        isMine 
                          ? 'bg-indigo-600 text-white rounded-tr-xs' 
                          : 'bg-white text-stone-800 border border-stone-200 rounded-tl-xs'
                      }`}>
                        {!isMine && (
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="text-xs font-black text-stone-900">{msg.senderName}</span>
                            <span className="text-[10px] uppercase font-bold text-amber-600 px-1.5 py-0.2 bg-amber-50 rounded-md">
                              {msg.senderRole}
                            </span>
                          </div>
                        )}
                        <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                        <span className={`text-[10px] mt-1 block ${isMine ? 'text-indigo-200 text-right' : 'text-stone-400'}`}>
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendChannelMessage} className="p-3 sm:p-4 bg-white border-t border-stone-200 flex items-center gap-2 shrink-0">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              isCalvinAi 
                ? "Ask Calvin any academic formula, exam topic, or admissions inquiry..." 
                : activeChannel?.isReadOnly && currentUserRole !== 'admin'
                ? "This bulletin channel is broadcast-only by School Leadership."
                : "Type your message..."
            }
            disabled={(!isCalvinAi && activeChannel?.isReadOnly && currentUserRole !== 'admin') || isAiLoading}
            className="flex-1 px-4 py-3 rounded-2xl bg-stone-50 border border-stone-200 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 text-stone-900 placeholder:text-stone-400"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isAiLoading}
            className="p-3 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold transition shadow-md hover:shadow-blue-500/25 cursor-pointer shrink-0"
            title="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
