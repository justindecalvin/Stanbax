import React, { useState, useRef, useEffect } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { 
  FileText, 
  Upload, 
  Trash2, 
  Check, 
  CheckCircle2, 
  RotateCcw, 
  ShieldCheck, 
  Award, 
  Edit3, 
  Sparkles,
  School as SchoolIcon,
  AlertCircle
} from '../RealIcons';

interface OfficialSignaturesDeskProps {
  roleFilter?: 'all' | 'headmistress' | 'secondary';
  title?: string;
  description?: string;
}

export const OfficialSignaturesDesk: React.FC<OfficialSignaturesDeskProps> = ({
  roleFilter = 'all',
  title = 'Official Institutional Signatures & Document Endorsement Desk',
  description = 'Authorize and configure official signatures displayed on student report cards, alumni transcripts, bursary receipts, and certified school credentials.'
}) => {
  const { officialSignatures, updateOfficialSignatures, schoolInfo } = useSchool();

  // Active role selector for the desk
  const [selectedRole, setSelectedRole] = useState<'headmistress' | 'principal_admin' | 'principal_academics'>(
    roleFilter === 'headmistress' ? 'headmistress' : 'headmistress'
  );

  useEffect(() => {
    if (roleFilter === 'headmistress') {
      setSelectedRole('headmistress');
    } else if (roleFilter === 'secondary') {
      setSelectedRole('principal_admin');
    }
  }, [roleFilter]);

  // Form states per role
  const [headmistressName, setHeadmistressName] = useState(
    officialSignatures.headmistressName || schoolInfo.headmistressName || 'Mrs. Adediran O. (Headmistress)'
  );
  const [headmistressTitle, setHeadmistressTitle] = useState(
    officialSignatures.headmistressTitle || schoolInfo.headmistressTitle || 'Headmistress, Primary & Early Childhood'
  );
  const [headmistressSig, setHeadmistressSig] = useState(
    officialSignatures.headmistressSignature || schoolInfo.headmistressSignature || ''
  );

  const [principalAdminName, setPrincipalAdminName] = useState(
    officialSignatures.principalAdminName || schoolInfo.principalName || 'Dr. Babatunde Ogunlesi (Principal)'
  );
  const [principalAdminTitle, setPrincipalAdminTitle] = useState(
    officialSignatures.principalAdminTitle || schoolInfo.principalTitle || 'Principal & Executive Director'
  );
  const [principalAdminSig, setPrincipalAdminSig] = useState(
    officialSignatures.principalAdminSignature || schoolInfo.principalSignature || ''
  );

  const [principalAcademicsName, setPrincipalAcademicsName] = useState(
    officialSignatures.principalAcademicsName || schoolInfo.academicsName || 'Engr. Olumide Ogunleye (Dean of Academics)'
  );
  const [principalAcademicsTitle, setPrincipalAcademicsTitle] = useState(
    officialSignatures.principalAcademicsTitle || schoolInfo.academicsTitle || 'Dean of Academics & Examination Controller'
  );
  const [principalAcademicsSig, setPrincipalAcademicsSig] = useState(
    officialSignatures.principalAcademicsSignature || schoolInfo.academicsSignature || ''
  );

  // Sync state if officialSignatures context updates
  useEffect(() => {
    if (officialSignatures.headmistressName) setHeadmistressName(officialSignatures.headmistressName);
    if (officialSignatures.headmistressTitle) setHeadmistressTitle(officialSignatures.headmistressTitle);
    if (officialSignatures.headmistressSignature) setHeadmistressSig(officialSignatures.headmistressSignature);

    if (officialSignatures.principalAdminName) setPrincipalAdminName(officialSignatures.principalAdminName);
    if (officialSignatures.principalAdminTitle) setPrincipalAdminTitle(officialSignatures.principalAdminTitle);
    if (officialSignatures.principalAdminSignature) setPrincipalAdminSig(officialSignatures.principalAdminSignature);

    if (officialSignatures.principalAcademicsName) setPrincipalAcademicsName(officialSignatures.principalAcademicsName);
    if (officialSignatures.principalAcademicsTitle) setPrincipalAcademicsTitle(officialSignatures.principalAcademicsTitle);
    if (officialSignatures.principalAcademicsSignature) setPrincipalAcademicsSig(officialSignatures.principalAcademicsSignature);
  }, [officialSignatures]);

  // Input & Canvas refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [inputMode, setInputMode] = useState<'upload' | 'draw'>('draw');
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Canvas drawing handlers
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#1e3a8a'; // Deep official blue ink
  }, [inputMode, selectedRole]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const applyDrawnSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasDrawn) {
      setFeedbackMsg({ type: 'error', text: 'Please sign on the signature pad first before saving.' });
      return;
    }
    const dataUrl = canvas.toDataURL('image/png');
    applySignatureDataUrl(dataUrl);
    clearCanvas();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFeedbackMsg({ type: 'error', text: 'Please upload an image file (PNG with transparency recommended).' });
      return;
    }

    if (file.size > 2.5 * 1024 * 1024) {
      setFeedbackMsg({ type: 'error', text: 'Signature image must be under 2.5MB.' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      const dataUrl = evt.target?.result as string;
      if (dataUrl) {
        applySignatureDataUrl(dataUrl);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const applySignatureDataUrl = (dataUrl: string) => {
    if (selectedRole === 'headmistress') {
      setHeadmistressSig(dataUrl);
      updateOfficialSignatures({
        headmistressSignature: dataUrl,
        headmistressName: headmistressName.trim(),
        headmistressTitle: headmistressTitle.trim()
      });
      setFeedbackMsg({ type: 'success', text: 'Headmistress official signature updated and deployed to Primary & Early Years documents!' });
    } else if (selectedRole === 'principal_admin') {
      setPrincipalAdminSig(dataUrl);
      updateOfficialSignatures({
        principalAdminSignature: dataUrl,
        principalAdminName: principalAdminName.trim(),
        principalAdminTitle: principalAdminTitle.trim()
      });
      setFeedbackMsg({ type: 'success', text: 'Principal Executive Administrator signature updated and deployed to Secondary documents!' });
    } else if (selectedRole === 'principal_academics') {
      setPrincipalAcademicsSig(dataUrl);
      updateOfficialSignatures({
        principalAcademicsSignature: dataUrl,
        principalAcademicsName: principalAcademicsName.trim(),
        principalAcademicsTitle: principalAcademicsTitle.trim()
      });
      setFeedbackMsg({ type: 'success', text: 'Principal Academics / Dean signature updated and deployed to Examinations & Results!' });
    }
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const handleRemoveSignature = () => {
    if (confirm('Are you sure you want to remove this digital signature? Documents will revert to a plain formal line placeholder.')) {
      if (selectedRole === 'headmistress') {
        setHeadmistressSig('');
        updateOfficialSignatures({ headmistressSignature: '' });
      } else if (selectedRole === 'principal_admin') {
        setPrincipalAdminSig('');
        updateOfficialSignatures({ principalAdminSignature: '' });
      } else if (selectedRole === 'principal_academics') {
        setPrincipalAcademicsSig('');
        updateOfficialSignatures({ principalAcademicsSignature: '' });
      }
      setFeedbackMsg({ type: 'success', text: 'Digital signature removed.' });
      setTimeout(() => setFeedbackMsg(null), 3000);
    }
  };

  const handleSaveTextDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole === 'headmistress') {
      updateOfficialSignatures({
        headmistressName: headmistressName.trim(),
        headmistressTitle: headmistressTitle.trim(),
        headmistressSignature: headmistressSig
      });
      setFeedbackMsg({ type: 'success', text: 'Headmistress name and designation saved.' });
    } else if (selectedRole === 'principal_admin') {
      updateOfficialSignatures({
        principalAdminName: principalAdminName.trim(),
        principalAdminTitle: principalAdminTitle.trim(),
        principalAdminSignature: principalAdminSig
      });
      setFeedbackMsg({ type: 'success', text: 'Principal Administrator name and designation saved.' });
    } else if (selectedRole === 'principal_academics') {
      updateOfficialSignatures({
        principalAcademicsName: principalAcademicsName.trim(),
        principalAcademicsTitle: principalAcademicsTitle.trim(),
        principalAcademicsSignature: principalAcademicsSig
      });
      setFeedbackMsg({ type: 'success', text: 'Principal Academics name and designation saved.' });
    }
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  // Active role variables
  const currentSig = 
    selectedRole === 'headmistress' ? headmistressSig :
    selectedRole === 'principal_admin' ? principalAdminSig : principalAcademicsSig;

  const currentName = 
    selectedRole === 'headmistress' ? headmistressName :
    selectedRole === 'principal_admin' ? principalAdminName : principalAcademicsName;

  const currentTitle = 
    selectedRole === 'headmistress' ? headmistressTitle :
    selectedRole === 'principal_admin' ? principalAdminTitle : principalAcademicsTitle;

  const targetLevelLabel = 
    selectedRole === 'headmistress' ? 'Primary & Early Years (Nursery, Reception, Basic 1–6)' :
    selectedRole === 'principal_admin' ? 'Secondary & Executive (JSS 1–3, SSS 1–3, General)' : 
    'Academics & Examination Controller (JSS 1–3, SSS 1–3 Results)';

  return (
    <div className="space-y-6 font-['Nunito',sans-serif]">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-950">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            <h2 className="text-lg sm:text-xl font-black">{title}</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            {description}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-900 font-extrabold text-xs flex items-center gap-1.5 border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Official Endorsement Active</span>
          </span>
        </div>
      </div>

      {feedbackMsg && (
        <div className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2.5 animate-fade-in ${
          feedbackMsg.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-rose-50 border border-rose-200 text-rose-800'
        }`}>
          {feedbackMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* Role Tabs Selector */}
      {roleFilter === 'all' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setSelectedRole('headmistress')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              selectedRole === 'headmistress'
                ? 'bg-blue-900 text-white border-blue-900 shadow-md ring-2 ring-blue-700/30'
                : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider opacity-80">Primary & Early Years</span>
              {headmistressSig ? (
                <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-[9px] font-extrabold">Signed</span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[9px] font-extrabold">Needs Sig</span>
              )}
            </div>
            <div className="font-black text-sm mt-1">Head Mistress</div>
            <div className="text-[11px] opacity-80 truncate mt-0.5">{headmistressName}</div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole('principal_admin')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              selectedRole === 'principal_admin'
                ? 'bg-blue-900 text-white border-blue-900 shadow-md ring-2 ring-blue-700/30'
                : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider opacity-80">Secondary Admin</span>
              {principalAdminSig ? (
                <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-[9px] font-extrabold">Signed</span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[9px] font-extrabold">Needs Sig</span>
              )}
            </div>
            <div className="font-black text-sm mt-1">Principal Administrator</div>
            <div className="text-[11px] opacity-80 truncate mt-0.5">{principalAdminName}</div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole('principal_academics')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              selectedRole === 'principal_academics'
                ? 'bg-blue-900 text-white border-blue-900 shadow-md ring-2 ring-blue-700/30'
                : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider opacity-80">Secondary Academics</span>
              {principalAcademicsSig ? (
                <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-[9px] font-extrabold">Signed</span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[9px] font-extrabold">Needs Sig</span>
              )}
            </div>
            <div className="font-black text-sm mt-1">Principal Academics / Dean</div>
            <div className="text-[11px] opacity-80 truncate mt-0.5">{principalAcademicsName}</div>
          </button>
        </div>
      )}

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Signature Upload & Drawing Pad */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-blue-900" />
                <span>
                  {selectedRole === 'headmistress' ? 'Headmistress Digital Signature' :
                   selectedRole === 'principal_admin' ? 'Principal Administrator Digital Signature' :
                   'Principal Academics Digital Signature'}
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Target Documents: <strong className="text-blue-900">{targetLevelLabel}</strong>
              </p>
            </div>

            {/* Input Mode Toggle */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs shrink-0">
              <button
                type="button"
                onClick={() => setInputMode('draw')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  inputMode === 'draw' ? 'bg-blue-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sign on Canvas
              </button>
              <button
                type="button"
                onClick={() => setInputMode('upload')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  inputMode === 'upload' ? 'bg-blue-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Upload File
              </button>
            </div>
          </div>

          {/* Draw Mode */}
          {inputMode === 'draw' ? (
            <div className="space-y-3">
              <div className="p-3 bg-blue-50/60 rounded-2xl border border-blue-200/80 text-xs text-blue-950 flex items-center justify-between">
                <span>Sign using your mouse, touchpad, or stylus touchscreen below:</span>
                <span className="text-[10px] font-mono font-bold text-blue-800 bg-white px-2 py-0.5 rounded border border-blue-200">
                  Blue Official Ink
                </span>
              </div>

              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-2 bg-[#FBFDFF] relative overflow-hidden">
                <canvas
                  ref={canvasRef}
                  width={520}
                  height={170}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full h-40 bg-white rounded-xl shadow-inner cursor-crosshair touch-none"
                />
                {!hasDrawn && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-slate-400 text-xs font-semibold">
                    Touch or click to sign here...
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between gap-3 pt-1">
                <button
                  type="button"
                  onClick={clearCanvas}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear Pad</span>
                </button>

                <button
                  type="button"
                  onClick={applyDrawnSignature}
                  disabled={!hasDrawn}
                  className="px-4 py-2 rounded-xl bg-blue-900 hover:bg-blue-950 disabled:bg-slate-300 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-sm cursor-pointer disabled:cursor-not-allowed"
                >
                  <Check className="w-3.5 h-3.5 text-amber-400" />
                  <span>Deploy Drawn Signature</span>
                </button>
              </div>
            </div>
          ) : (
            /* Upload Mode */
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              <div 
                onClick={() => fileInputRef.current?.click()}
                className="p-8 border-2 border-dashed border-slate-300 hover:border-blue-900 rounded-2xl bg-slate-50/50 hover:bg-blue-50/30 text-center transition cursor-pointer space-y-3"
              >
                <div className="w-12 h-12 rounded-2xl bg-white shadow-xs text-blue-900 flex items-center justify-center mx-auto border border-slate-200 font-black">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <span className="font-bold text-xs text-slate-800 block">
                    Click to select digital signature image
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Supports PNG with transparent background, JPG, or WEBP (Max 2.5MB)
                  </span>
                </div>
                <button
                  type="button"
                  className="px-3.5 py-1.5 rounded-xl bg-blue-900 text-white text-xs font-bold shadow-xs pointer-events-none inline-flex items-center gap-1.5"
                >
                  <span>Select Image File</span>
                </button>
              </div>
            </div>
          )}

          {/* Designation & Name Inputs */}
          <form onSubmit={handleSaveTextDetails} className="space-y-3 pt-3 border-t border-slate-100">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
              Official Signatory Credentials & Designation
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Signatory Full Name:</label>
                <input
                  type="text"
                  value={selectedRole === 'headmistress' ? headmistressName : selectedRole === 'principal_admin' ? principalAdminName : principalAcademicsName}
                  onChange={(e) => {
                    if (selectedRole === 'headmistress') setHeadmistressName(e.target.value);
                    else if (selectedRole === 'principal_admin') setPrincipalAdminName(e.target.value);
                    else setPrincipalAcademicsName(e.target.value);
                  }}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-900 outline-none font-medium"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Official Designation Title:</label>
                <input
                  type="text"
                  value={selectedRole === 'headmistress' ? headmistressTitle : selectedRole === 'principal_admin' ? principalAdminTitle : principalAcademicsTitle}
                  onChange={(e) => {
                    if (selectedRole === 'headmistress') setHeadmistressTitle(e.target.value);
                    else if (selectedRole === 'principal_admin') setPrincipalAdminTitle(e.target.value);
                    else setPrincipalAcademicsTitle(e.target.value);
                  }}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-900 outline-none font-medium"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Save Signatory Titles</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right: Live Document Preview */}
        <div className="lg:col-span-5 bg-gradient-to-b from-slate-50 to-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <span className="text-xs font-black uppercase tracking-wider text-blue-950 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" />
                <span>Certified Document Live Preview</span>
              </span>
              <span className="text-[10px] bg-blue-100 text-blue-900 font-extrabold px-2 py-0.5 rounded-full">
                Report Card Seal
              </span>
            </div>

            <p className="text-[11px] text-slate-500">
              This preview illustrates how the official endorsement seal, signature, and stamp appear on printed terminal report sheets and official student dossiers:
            </p>

            {/* Official Endorsement Card Box */}
            <div className="p-5 rounded-2xl bg-white border-2 border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  STANBAX SCHOOLS IBADAN
                </span>
                <span className="text-[10px] font-mono text-emerald-700 font-bold">
                  {currentSig ? 'AUTHENTICATED' : 'UNENDORSED'}
                </span>
              </div>

              {/* Signature Display Container */}
              <div className="h-24 bg-[#FCFDFE] rounded-xl border border-slate-200/80 flex items-center justify-center p-2 relative overflow-hidden">
                {currentSig ? (
                  <img
                    src={currentSig}
                    alt={`${currentName} signature`}
                    className="max-h-20 max-w-full object-contain filter drop-shadow-xs"
                  />
                ) : (
                  <div className="text-center space-y-1">
                    <span className="text-[11px] text-slate-400 italic block">
                      No digital signature uploaded yet
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono">
                      [Signature placeholder line will be shown]
                    </span>
                  </div>
                )}
              </div>

              {/* Signatory Text Footer */}
              <div className="border-t-2 border-slate-900 pt-2 text-center space-y-0.5">
                <div className="text-xs font-black text-slate-900">
                  {currentName}
                </div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  {currentTitle}
                </div>
                <div className="text-[9px] text-slate-400 font-medium">
                  {selectedRole === 'headmistress' ? 'Primary & Early Years School Directorate' : 'Executive Directorate of Academics & Registry'}
                </div>
              </div>
            </div>
          </div>

          {/* Remove / Reset Actions */}
          {currentSig && (
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>Deployed on all official transcripts</span>
              </span>

              <button
                type="button"
                onClick={handleRemoveSignature}
                className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Signature</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
