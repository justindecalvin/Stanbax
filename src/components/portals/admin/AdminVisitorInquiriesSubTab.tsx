import React, { useState } from 'react';
import { useSchool } from '../../../context/SchoolContext';
import { 
  Users, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  User, 
  Edit3, 
  ShieldCheck, 
  Radio, 
  Save, 
  RotateCcw,
  Search,
  Phone,
  Mail,
  Calendar,
  Award,
  ChevronRight
} from '../../RealIcons';
import { SchoolRepRole } from '../../../types';

export const AdminVisitorInquiriesSubTab: React.FC = () => {
  const {
    schoolRepConfig,
    updateSchoolRepConfig,
    toggleRepAvailability,
    visitorConversations,
    replyAsRepresentative,
    markVisitorConversationRead
  } = useSchool();

  const [selectedVisitorId, setSelectedVisitorId] = useState<string | null>(
    visitorConversations.length > 0 ? visitorConversations[0].visitorId : null
  );
  const [repReplyText, setRepReplyText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);

  // Representative configuration state
  const [formRole, setFormRole] = useState<SchoolRepRole>(schoolRepConfig.activeRole);
  const [formName, setFormName] = useState(schoolRepConfig.repName);
  const [formTitle, setFormTitle] = useState(schoolRepConfig.repTitle);
  const [formWelcome, setFormWelcome] = useState(schoolRepConfig.welcomeMessage);
  const [formPhone, setFormPhone] = useState(schoolRepConfig.contactPhone || '+234 803 123 4567');
  const [formEmail, setFormEmail] = useState(schoolRepConfig.contactEmail || 'admissions@stanbaxschools.edu.ng');

  const selectedConversation = visitorConversations.find(c => c.visitorId === selectedVisitorId) || visitorConversations[0];

  const handleRoleQuickSelect = (role: SchoolRepRole) => {
    setFormRole(role);
    if (role === 'principal') {
      setFormName('Mrs. Bello');
      setFormTitle('School Principal & Head of Administration');
      setFormWelcome('Welcome to Stanbax Schools Ibadan! I am Mrs. Bello, Principal. How may we assist your family today with admissions, entrance examinations, or our British-Nigerian curriculum?');
    } else if (role === 'bursar') {
      setFormName('Mr. Olumide Ogunleye');
      setFormTitle('Chief Bursar & Finance Desk');
      setFormWelcome('Good day! I am Mr. Ogunleye, School Bursar. I am here to provide transparent fee schedules, installment options, and bursary clearance guidance.');
    } else if (role === 'admissions') {
      setFormName('Mrs. Folake Adeyemi');
      setFormTitle('Director of Admissions & Guidance');
      setFormWelcome('Welcome to the Stanbax Admissions Desk! Ask any questions regarding student registration, entrance test dates, Creche to SSS 3 placement, or campus tours.');
    } else {
      setFormName('Stanbax School Representative');
      setFormTitle('Official Campus Desk');
      setFormWelcome('Hello! Welcome to Stanbax Schools Ibadan. How can we assist you with our programs, admissions, or school facilities today?');
    }
  };

  const handleSaveConfig = () => {
    updateSchoolRepConfig({
      activeRole: formRole,
      repName: formName.trim() || 'School Representative',
      repTitle: formTitle.trim() || 'Campus Admissions Desk',
      welcomeMessage: formWelcome.trim(),
      contactPhone: formPhone.trim(),
      contactEmail: formEmail.trim()
    });
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 3000);
  };

  const handleSendRepReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConversation || !repReplyText.trim()) return;

    replyAsRepresentative(selectedConversation.visitorId, repReplyText, {
      name: schoolRepConfig.repName,
      title: schoolRepConfig.repTitle
    });

    // When the representative replies, ensure they are set as Online so the visitor sees them live
    if (!schoolRepConfig.isAvailable) {
      toggleRepAvailability(true);
    }

    setRepReplyText('');
  };

  const filteredConversations = visitorConversations.filter(c => 
    c.visitorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.visitorId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.messages.some(m => m.content.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* 1. Header Banner & Live Availability Toggle */}
      <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-neutral-900 text-white p-6 rounded-3xl shadow-sm border border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-black uppercase tracking-wider border border-blue-400/30">
              Landing Page Inquiries
            </span>
            <span className="px-2 py-0.5 rounded-full bg-amber-400 text-neutral-950 text-[10px] font-black uppercase">
              Current Rep: {schoolRepConfig.activeRole}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            School Representative & Live Visitor Desk
          </h2>
          <p className="text-xs text-neutral-300 max-w-2xl leading-relaxed">
            Assign whether the Principal, Bursar, or Admissions Officer is designated to receive landing page inquiries. When the representative is toggled Away, Calvin AI automatically acts on their behalf until the representative resumes.
          </p>
        </div>

        {/* Real-Time Availability Switch */}
        <div className="bg-white/10 p-3.5 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <div className="text-left sm:text-right">
            <div className="text-xs font-black text-white flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full ${schoolRepConfig.isAvailable ? 'bg-emerald-400 animate-ping' : 'bg-purple-400'}`} />
              <span>{schoolRepConfig.isAvailable ? 'Representative Online' : 'Representative Away'}</span>
            </div>
            <p className="text-[10px] text-neutral-300">
              {schoolRepConfig.isAvailable ? 'Live Human Replies Active' : 'Calvin AI Auto-Rep Handling'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => toggleRepAvailability()}
            className={`px-4 py-2 rounded-xl font-black text-xs transition cursor-pointer shadow-md ${
              schoolRepConfig.isAvailable
                ? 'bg-purple-600 hover:bg-purple-700 text-white'
                : 'bg-emerald-500 hover:bg-emerald-600 text-neutral-950'
            }`}
          >
            {schoolRepConfig.isAvailable ? 'Switch to Away (Calvin AI)' : 'Set as Online / Available'}
          </button>
        </div>
      </div>

      {/* 2. Representative Assignment Settings Form */}
      <div className="bg-white rounded-3xl p-6 shadow-xs border border-neutral-200 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-4">
          <div>
            <h3 className="text-base font-black text-neutral-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-700" />
              <span>Assign Representative Receiving Inquiries</span>
            </h3>
            <p className="text-xs text-neutral-500">
              Choose who appears as the active representative on the landing page chat.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {saveSuccessNotice && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Settings Saved</span>
              </span>
            )}
            <button
              type="button"
              onClick={handleSaveConfig}
              className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-black text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Representative Profile</span>
            </button>
          </div>
        </div>

        {/* Quick Role Selection Buttons */}
        <div className="space-y-2">
          <label className="text-xs font-black uppercase text-neutral-600 tracking-wider">
            Quick Representative Presets:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { id: 'principal' as const, label: 'School Principal', sub: 'Mrs. Bello', color: 'border-blue-500' },
              { id: 'bursar' as const, label: 'School Bursar', sub: 'Mr. Olumide Ogunleye', color: 'border-emerald-500' },
              { id: 'admissions' as const, label: 'Admissions Desk', sub: 'Mrs. Folake Adeyemi', color: 'border-purple-500' },
              { id: 'representative' as const, label: 'General Desk', sub: 'Campus Representative', color: 'border-amber-500' },
            ].map(r => (
              <button
                key={r.id}
                type="button"
                onClick={() => handleRoleQuickSelect(r.id)}
                className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                  formRole === r.id
                    ? 'border-blue-700 bg-blue-50/60 shadow-xs'
                    : 'border-neutral-200 hover:bg-neutral-50'
                }`}
              >
                <div className="font-black text-xs text-neutral-900">{r.label}</div>
                <div className="text-[11px] text-neutral-500">{r.sub}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Form fields */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="font-bold text-neutral-700 block mb-1">Representative Name</label>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-neutral-300 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="font-bold text-neutral-700 block mb-1">Official Title</label>
            <input
              type="text"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-neutral-300 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="font-bold text-neutral-700 block mb-1">Assigned Role</label>
            <select
              value={formRole}
              onChange={(e) => setFormRole(e.target.value as SchoolRepRole)}
              className="w-full px-3 py-2 rounded-xl border border-neutral-300 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
            >
              <option value="principal">School Principal</option>
              <option value="bursar">Bursar (Fees & Accounts)</option>
              <option value="admissions">Admissions Desk</option>
              <option value="representative">General School Representative</option>
            </select>
          </div>
        </div>

        <div>
          <label className="font-bold text-neutral-700 text-xs block mb-1">
            Initial Welcome Greeting (Shown to Landing Page Visitors)
          </label>
          <textarea
            rows={2}
            value={formWelcome}
            onChange={(e) => setFormWelcome(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>

      {/* 3. Live Visitor Inquiries & Reply Workspace */}
      <div className="bg-white rounded-3xl shadow-xs border border-neutral-200 overflow-hidden">
        <div className="p-4 border-b border-neutral-200 bg-neutral-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-black text-neutral-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-700" />
              <span>Visitor Inquiries & Live Threads ({visitorConversations.length})</span>
            </h3>
            <p className="text-xs text-neutral-500">
              Review visitor queries, see Calvin AI's responses, and reply live as the human representative.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search visitor query or ID..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-neutral-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        {visitorConversations.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <MessageSquare className="w-10 h-10 text-neutral-300 mx-auto" />
            <h4 className="font-black text-sm text-neutral-700">No Visitor Inquiries Yet</h4>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto">
              When prospective parents, students, or visitors click the chat button on the landing page, their unique threads and inquiries will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 min-h-[480px]">
            {/* Conversations List */}
            <div className="border-r border-neutral-200 overflow-y-auto max-h-[550px] divide-y divide-neutral-100">
              {filteredConversations.map(conv => {
                const isSelected = selectedConversation?.visitorId === conv.visitorId;
                const lastMsg = conv.messages[conv.messages.length - 1];

                return (
                  <div
                    key={conv.visitorId}
                    onClick={() => {
                      setSelectedVisitorId(conv.visitorId);
                      markVisitorConversationRead(conv.visitorId);
                    }}
                    className={`p-3.5 transition cursor-pointer hover:bg-neutral-50 ${
                      isSelected ? 'bg-blue-50/70 border-l-4 border-blue-700' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-black text-xs text-neutral-900 truncate">
                        {conv.visitorName}
                      </span>
                      {conv.unreadByAdmin && (
                        <span className="w-2 h-2 rounded-full bg-rose-600 shrink-0" title="New Message" />
                      )}
                    </div>
                    <p className="text-[11px] text-neutral-600 line-clamp-2 leading-relaxed">
                      {lastMsg ? `${lastMsg.sender === 'visitor' ? 'Visitor: ' : 'Rep: '}${lastMsg.content}` : 'No messages'}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-neutral-400 mt-1.5 font-mono">
                      <span>{new Date(conv.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span className="capitalize">{conv.status.replace('_', ' ')}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Conversation Active Thread View & Reply */}
            <div className="md:col-span-2 flex flex-col h-[550px] bg-neutral-50/40">
              {selectedConversation ? (
                <>
                  {/* Thread Header */}
                  <div className="p-3.5 bg-white border-b border-neutral-200 flex items-center justify-between gap-2 shrink-0">
                    <div>
                      <h4 className="font-black text-sm text-neutral-900">
                        {selectedConversation.visitorName}
                      </h4>
                      <p className="text-[10px] text-neutral-500 font-mono">
                        ID: {selectedConversation.visitorId} • Started: {new Date(selectedConversation.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {selectedConversation.messages.some(m => m.sender === 'representative') ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 font-black text-[10px]">
                          ✓ Resumed by Rep
                        </span>
                      ) : selectedConversation.messages.some(m => m.sender === 'calvin_ai') ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-300 font-black text-[10px]">
                          Calvin AI Virtual Rep Active
                        </span>
                      ) : null}
                      <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-900 font-bold text-[10px]">
                        {selectedConversation.messages.length} Messages
                      </span>
                    </div>
                  </div>

                  {/* Messages Bubble Area */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {selectedConversation.messages.map(m => {
                      const isVisitor = m.sender === 'visitor';
                      const isAi = m.sender === 'calvin_ai';

                      return (
                        <div
                          key={m.id}
                          className={`flex ${isVisitor ? 'justify-start' : 'justify-end'}`}
                        >
                          <div
                            className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed space-y-1 shadow-2xs ${
                              isVisitor
                                ? 'bg-white text-neutral-800 border border-neutral-200 rounded-tl-xs'
                                : isAi
                                ? 'bg-purple-50 text-purple-950 border border-purple-200 rounded-tr-xs'
                                : 'bg-blue-700 text-white rounded-tr-xs'
                            }`}
                          >
                            <div className="flex items-center gap-1.5 font-black text-[10px] opacity-80">
                              <span>{m.senderName}</span>
                              {isAi && <span className="text-[9px] uppercase px-1 rounded bg-purple-200 text-purple-900">Calvin AI</span>}
                              {!isVisitor && !isAi && <span className="text-[9px] uppercase px-1 rounded bg-blue-900 text-amber-300">Live Rep</span>}
                            </div>
                            <div className="whitespace-pre-wrap">{m.content}</div>
                            <div className="text-[9px] opacity-60 text-right font-mono">
                              {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Representative Reply Input */}
                  <form
                    onSubmit={handleSendRepReply}
                    className="p-3 bg-white border-t border-neutral-200 flex items-center gap-2 shrink-0"
                  >
                    <input
                      type="text"
                      value={repReplyText}
                      onChange={(e) => setRepReplyText(e.target.value)}
                      placeholder={`Reply to ${selectedConversation.visitorName} as ${schoolRepConfig.repName}...`}
                      className="flex-1 px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <button
                      type="submit"
                      disabled={!repReplyText.trim()}
                      className="px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-black text-xs transition cursor-pointer shadow-md disabled:opacity-40 flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Official Reply</span>
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center p-8 text-neutral-400 text-xs">
                  Select a visitor conversation on the left to read and reply.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
