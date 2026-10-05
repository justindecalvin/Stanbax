import React, { useState, useEffect, useRef } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { 
  X, 
  Send, 
  Sparkles, 
  User, 
  Edit3, 
  Check, 
  Clock, 
  Phone, 
  ShieldCheck, 
  BookOpen, 
  CreditCard, 
  MapPin, 
  Award,
  MessageSquare
} from '../RealIcons';

interface SchoolRepresentativeChatProps {
  onClose: () => void;
}

const VISITOR_IDENTITY_KEY = 'stanbax_visitor_identity';

export const SchoolRepresentativeChat: React.FC<SchoolRepresentativeChatProps> = ({ onClose }) => {
  const {
    schoolInfo,
    schoolRepConfig,
    visitorConversations,
    sendVisitorMessage,
    requestCalvinAiInstantReply,
    getVisitorConversation
  } = useSchool();

  // Persistent unique visitor identity
  const [visitorIdentity, setVisitorIdentity] = useState<{ visitorId: string; visitorName: string; phone?: string }>(() => {
    try {
      const saved = localStorage.getItem(VISITOR_IDENTITY_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.visitorId && parsed.visitorName) {
          return parsed;
        }
      }
    } catch {}

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newIdentity = {
      visitorId: `visitor_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      visitorName: `Prospective Parent #${randomNum}`,
      phone: ''
    };
    try {
      localStorage.setItem(VISITOR_IDENTITY_KEY, JSON.stringify(newIdentity));
    } catch {}
    return newIdentity;
  });

  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(visitorIdentity.visitorName);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Retrieve current active conversation
  const currentConversation = getVisitorConversation(visitorIdentity.visitorId);
  const messages = currentConversation?.messages || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages.length, isThinking]);

  const handleSaveName = () => {
    const trimmed = editedName.trim();
    if (trimmed) {
      const updated = { ...visitorIdentity, visitorName: trimmed };
      setVisitorIdentity(updated);
      try {
        localStorage.setItem(VISITOR_IDENTITY_KEY, JSON.stringify(updated));
      } catch {}
    }
    setIsEditingName(false);
  };

  const handleTriggerCalvinAiStandIn = async () => {
    setIsThinking(true);
    try {
      await requestCalvinAiInstantReply(visitorIdentity.visitorId);
    } catch (err) {
      console.warn('Failed to trigger Calvin AI instant stand-in:', err);
    } finally {
      setIsThinking(false);
    }
  };

  const handleSend = async (messageToSend?: string) => {
    const text = (messageToSend || inputText).trim();
    if (!text || isThinking) return;

    setInputText('');
    setIsThinking(true);

    try {
      await sendVisitorMessage(visitorIdentity.visitorId, text, {
        name: visitorIdentity.visitorName,
        phone: visitorIdentity.phone
      });
    } catch (err) {
      console.warn('Failed to send visitor inquiry:', err);
    } finally {
      setIsThinking(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  const quickQuestions = [
    { label: '💳 Tuition Fees & Bursary', text: 'Could you explain the tuition fees breakdown and installment payment options?' },
    { label: '📝 Admission & Screening', text: 'How do I register for admissions and what are the entrance exam screening dates?' },
    { label: '📍 Location & Bus Routes', text: 'Where is the school located and what bus transportation routes do you cover in Ibadan?' },
    { label: '🎓 Dual Curriculum', text: 'Tell me about the British-Nigerian curriculum and WAEC/Cambridge preparations.' },
  ];

  return (
    <div className="flex flex-col h-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-neutral-200/80 animate-in fade-in zoom-in-95 duration-200 select-none sm:select-auto font-['Nunito',sans-serif]">
      {/* 1. Header: Representative Details & Live Status */}
      <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-neutral-900 text-white p-3.5 sm:p-4 shrink-0 shadow-md">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Representative Avatar with Status Indicator */}
            <div className="relative shrink-0">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-amber-400 text-neutral-950 flex items-center justify-center font-black shadow-md border-2 border-amber-300 overflow-hidden">
                {schoolRepConfig.repAvatar ? (
                  <img 
                    src={schoolRepConfig.repAvatar} 
                    alt={schoolRepConfig.repName} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <User className="w-6 h-6 text-neutral-950" />
                )}
              </div>
              <span 
                title={schoolRepConfig.isAvailable ? 'Representative Online' : 'Representative Away • Calvin AI Active'}
                className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-neutral-900 ${
                  schoolRepConfig.isAvailable ? 'bg-emerald-400 animate-pulse' : 'bg-purple-400'
                }`} 
              />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm sm:text-base text-white truncate tracking-tight">
                  {schoolRepConfig.repName}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-neutral-950 text-[10px] font-black uppercase tracking-wider shrink-0">
                  {schoolRepConfig.activeRole}
                </span>
              </div>
              <p className="text-xs text-blue-200/90 truncate font-semibold">
                {schoolRepConfig.repTitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-neutral-200 hover:text-white flex items-center justify-center transition cursor-pointer"
              title="Close Chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Status Subtitle Banner */}
        <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            {schoolRepConfig.isAvailable ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                <span className="text-emerald-300 font-bold truncate">Online • Rep is at the desk</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-purple-300 shrink-0" />
                <span className="text-purple-200 font-bold truncate">
                  Rep is Away • Calvin AI answering on their behalf
                </span>
              </>
            )}
          </div>
          <span className="text-neutral-400 text-[10px] shrink-0 font-medium">
            Stanbax Ibadan
          </span>
        </div>
      </div>

      {/* 2. Visitor Identity Bar (Unique & Persistent) */}
      <div className="bg-neutral-50 px-3.5 py-2 border-b border-neutral-200/80 flex items-center justify-between gap-2 shrink-0 text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-neutral-500 font-semibold text-[11px] shrink-0">Inquiring as:</span>
          {isEditingName ? (
            <div className="flex items-center gap-1.5 min-w-0">
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                className="px-2 py-0.5 rounded-lg border border-neutral-300 text-xs font-bold text-neutral-900 bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                autoFocus
              />
              <button
                type="button"
                onClick={handleSaveName}
                className="p-1 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition cursor-pointer"
                title="Save Name"
              >
                <Check className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="font-extrabold text-neutral-800 truncate text-[11px]">
                {visitorIdentity.visitorName}
              </span>
              <button
                type="button"
                onClick={() => {
                  setEditedName(visitorIdentity.visitorName);
                  setIsEditingName(true);
                }}
                className="text-neutral-400 hover:text-blue-700 p-0.5 rounded transition cursor-pointer shrink-0"
                title="Customize your name"
              >
                <Edit3 className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="px-1.5 py-0.5 rounded bg-neutral-200/80 text-neutral-600 text-[9px] font-mono font-bold">
            #{visitorIdentity.visitorId.slice(-5)}
          </span>
          <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-0.5">
            <Check className="w-3 h-3" />
            <span>Queries Retained</span>
          </span>
        </div>
      </div>

      {/* 3. Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-neutral-100/50">
        {/* Welcome Greeting from Representative */}
        <div className="flex gap-2.5 max-w-[90%] sm:max-w-[85%]">
          <div className="w-8 h-8 rounded-xl bg-blue-900 text-amber-300 flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
            {schoolRepConfig.repName.charAt(0)}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-black text-neutral-800">
                {schoolRepConfig.repName}
              </span>
              <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 text-[9px] font-extrabold uppercase">
                {schoolRepConfig.activeRole}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl rounded-tl-xs bg-white text-neutral-800 text-xs shadow-xs border border-neutral-200/70 leading-relaxed">
              {schoolRepConfig.welcomeMessage}
            </div>
          </div>
        </div>

        {/* Offline Calvin AI introduction notice if rep is away */}
        {!schoolRepConfig.isAvailable && messages.length === 0 && (
          <div className="p-3 rounded-2xl bg-purple-50 border border-purple-200/80 text-purple-900 text-xs space-y-1.5 shadow-2xs">
            <div className="flex items-center gap-1.5 font-black text-[11px] text-purple-950">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>Calvin AI Virtual Representative Ready</span>
            </div>
            <p className="text-[11px] text-purple-800 leading-relaxed">
              {schoolRepConfig.repName} is presently on campus duty. Feel free to ask any question below! I will provide immediate details on admissions, fees, and academics, and {schoolRepConfig.repName} can review and resume the conversation upon returning.
            </p>
          </div>
        )}

        {/* Message Thread */}
        {messages.map((msg, idx) => {
          const isVisitor = msg.sender === 'visitor';
          const isAi = msg.sender === 'calvin_ai';
          const isHumanRep = msg.sender === 'representative';

          // Detect if this is the first representative reply after Calvin AI responses (Handover resumption)
          const hadAiBefore = messages.slice(0, idx).some(m => m.sender === 'calvin_ai');
          const isFirstRepAfterAi = isHumanRep && hadAiBefore && !messages.slice(0, idx).some(m => m.sender === 'representative');

          if (isVisitor) {
            return (
              <div key={msg.id} className="flex justify-end">
                <div className="max-w-[85%] space-y-1 text-right">
                  <span className="text-[10px] text-neutral-400 font-semibold pr-1">
                    {msg.senderName}
                  </span>
                  <div className="p-3.5 rounded-2xl rounded-tr-xs bg-gradient-to-r from-blue-700 to-indigo-700 text-white text-xs shadow-sm text-left leading-relaxed">
                    {msg.content}
                  </div>
                  <span className="text-[9px] text-neutral-400 block pr-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          }

          // Reply from Calvin AI or Human Representative
          return (
            <React.Fragment key={msg.id}>
              {/* Handover Notice: Representative Resumed Chat Live */}
              {isFirstRepAfterAi && (
                <div className="flex items-center justify-center my-2">
                  <div className="px-3.5 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-950 text-[10px] font-black flex items-center gap-1.5 shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span>{schoolRepConfig.repName} has come online & resumed the conversation live</span>
                  </div>
                </div>
              )}

              <div className="flex gap-2.5 max-w-[90%] sm:max-w-[85%]">
                <div 
                  className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 shadow-xs ${
                    isAi ? 'bg-purple-700 text-white' : 'bg-emerald-700 text-amber-300'
                  }`}
                >
                  {isAi ? <Sparkles className="w-4 h-4 text-purple-200" /> : <ShieldCheck className="w-4 h-4 text-amber-300" />}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] font-black text-neutral-900">
                      {msg.senderName}
                    </span>
                    <span 
                      className={`px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase ${
                        isAi 
                          ? 'bg-purple-100 text-purple-900 border border-purple-200' 
                          : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      }`}
                    >
                      {isAi ? 'Virtual Rep' : 'Official Reply'}
                    </span>
                    {isHumanRep && (
                      <span className="text-[9px] font-bold text-emerald-700 flex items-center gap-0.5">
                        • Live from Desk
                      </span>
                    )}
                  </div>
                  <div 
                    className={`p-3.5 rounded-2xl rounded-tl-xs text-xs shadow-xs border leading-relaxed whitespace-pre-wrap ${
                      isAi 
                        ? 'bg-white text-neutral-800 border-purple-200/70' 
                        : 'bg-emerald-50/70 text-emerald-950 border-emerald-200'
                    }`}
                  >
                    {msg.content}
                  </div>
                  <span className="text-[9px] text-neutral-400 block pl-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </React.Fragment>
          );
        })}

        {/* Live Representative Reviewing Message Notice */}
        {schoolRepConfig.isAvailable && messages.length > 0 && messages[messages.length - 1].sender === 'visitor' && !isThinking && (
          <div className="p-3 rounded-2xl bg-emerald-50/90 border border-emerald-200 text-emerald-950 text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-black text-[11px] text-emerald-900">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Delivered to {schoolRepConfig.repName}'s Desk</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">Representative Online</span>
            </div>
            <p className="text-[11px] text-emerald-800 leading-relaxed">
              Your inquiry has been routed to {schoolRepConfig.repName} ({schoolRepConfig.repTitle}). Representative is active and will respond shortly.
            </p>
            <div className="pt-0.5">
              <button
                type="button"
                onClick={() => void handleTriggerCalvinAiStandIn()}
                className="text-[10px] font-extrabold text-purple-700 hover:text-purple-900 bg-purple-100/90 hover:bg-purple-200 px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <Sparkles className="w-3 h-3 text-purple-600" />
                <span>Need an instant answer? Ask Calvin AI to draft right now</span>
              </button>
            </div>
          </div>
        )}

        {/* Thinking Indicator */}
        {isThinking && (
          <div className="flex gap-2.5 items-center text-xs text-purple-700">
            <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-purple-600 animate-spin" />
            </div>
            <div className="p-3 rounded-2xl bg-white border border-purple-200 shadow-xs flex items-center gap-2">
              <span className="font-extrabold text-[11px]">Calvin AI is drafting response...</span>
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 4. Quick Inquiry Suggestions (if user hasn't sent messages yet or between queries) */}
      <div className="px-3 py-2 bg-neutral-50 border-t border-neutral-200/70 shrink-0">
        <span className="text-[10px] font-bold text-neutral-500 block mb-1">
          Quick Inquiries for {schoolRepConfig.repName}:
        </span>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => void handleSend(q.text)}
              disabled={isThinking}
              className="px-2.5 py-1 rounded-xl bg-white border border-neutral-200 hover:border-blue-400 hover:bg-blue-50/50 text-[10px] font-extrabold text-neutral-700 whitespace-nowrap transition cursor-pointer shadow-2xs active:scale-95 disabled:opacity-50"
            >
              {q.label}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Input Bar */}
      <div className="p-3 bg-white border-t border-neutral-200 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${schoolRepConfig.repName} or ask Calvin AI...`}
            disabled={isThinking}
            className="flex-1 px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs font-semibold text-neutral-900 placeholder:text-neutral-400 bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isThinking}
            className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white flex items-center justify-center transition cursor-pointer shadow-md disabled:opacity-40 disabled:cursor-not-allowed shrink-0 active:scale-95"
            title="Send Inquiry"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-[9px] text-center text-neutral-400 mt-1.5">
          Stanbax Admissions & Public Information Desk • All conversation history retained
        </p>
      </div>
    </div>
  );
};
