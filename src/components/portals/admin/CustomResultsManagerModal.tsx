import React, { useState } from 'react';
import { useSchool } from '../../../context/SchoolContext';
import { StudentProfile, CustomResult } from '../../../types';
import { 
  X, 
  Upload, 
  FileText, 
  Trash2, 
  Plus, 
  CheckCircle2, 
  Award, 
  GraduationCap, 
  AlertCircle,
  Eye,
  Printer,
  ChevronDown,
  ChevronUp,
  Download
} from '../../RealIcons';

interface CustomResultsManagerModalProps {
  initialStudent?: StudentProfile | null;
  onClose: () => void;
}

export const CustomResultsManagerModal: React.FC<CustomResultsManagerModalProps> = ({
  initialStudent = null,
  onClose
}) => {
  const { 
    students, 
    customResults, 
    uploadCustomResult, 
    deleteCustomResult, 
    schoolInfo 
  } = useSchool();

  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    initialStudent?.id || students[0]?.id || ''
  );

  const selectedStudent = students.find(s => s.id === selectedStudentId);

  // Form state
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [title, setTitle] = useState('');
  const [examType, setExamType] = useState<'WAEC' | 'NECO' | 'BECE' | 'Cambridge' | 'JAMB' | 'Terminal' | 'Custom'>('WAEC');
  const [session, setSession] = useState(schoolInfo.activeSession || '2025/2026 Academic Session');
  const [term, setTerm] = useState('3rd Term (Trinity Term)');
  const [overallScore, setOverallScore] = useState('');
  const [remarks, setRemarks] = useState('Certified and authenticated by Central Academic Registry.');
  const [fileAttachment, setFileAttachment] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  
  // Subject rows for breakdown
  const [subjectRows, setSubjectRows] = useState<Array<{ subject: string; score: string; grade: string; remark: string }>>([
    { subject: 'English Language', score: '82', grade: 'A1', remark: 'Distinction' },
    { subject: 'Mathematics', score: '88', grade: 'A1', remark: 'Distinction' },
    { subject: 'Civic Education', score: '76', grade: 'B2', remark: 'Very Good' }
  ]);

  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [viewingResult, setViewingResult] = useState<CustomResult | null>(null);

  // Results for current student
  const studentResults = customResults.filter(r => {
    if (!selectedStudent) return false;
    const rStudId = (r as any).studentId;
    const rReg = (r as any).studentRegNumber;
    return rStudId === selectedStudent.id || 
           (rReg && rReg.toLowerCase() === selectedStudent.regNumber.toLowerCase()) ||
           (selectedStudent.customResults || []).some(tc => tc.id === r.id);
  });

  const handleAddSubjectRow = () => {
    setSubjectRows(prev => [...prev, { subject: '', score: '', grade: '', remark: '' }]);
  };

  const handleRemoveSubjectRow = (idx: number) => {
    setSubjectRows(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubjectRowChange = (idx: number, field: string, value: string) => {
    setSubjectRows(prev => prev.map((row, i) => i === idx ? { ...row, [field]: value } : row));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setNotice({ type: 'error', text: 'Document attachment must be under 5MB.' });
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const dataUrl = evt.target?.result as string;
      if (dataUrl) setFileAttachment(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) {
      setNotice({ type: 'error', text: 'Please select an enrolled student or alumni.' });
      return;
    }
    if (!title.trim()) {
      setNotice({ type: 'error', text: 'Please provide a descriptive title for this result.' });
      return;
    }

    const cleanSubjects = subjectRows
      .filter(r => r.subject.trim())
      .map(r => ({
        subject: r.subject.trim(),
        score: r.score.trim() || undefined,
        grade: r.grade.trim() || undefined,
        remark: r.remark.trim() || undefined
      }));

    uploadCustomResult({
      studentId: selectedStudent.id,
      studentRegNumber: selectedStudent.regNumber,
      title: title.trim(),
      examType,
      session: session.trim(),
      term: term.trim(),
      overallScore: overallScore.trim() || undefined,
      remarks: remarks.trim() || undefined,
      fileAttachment: fileAttachment || undefined,
      fileName: fileName || undefined,
      subjectBreakdown: cleanSubjects.length > 0 ? cleanSubjects : undefined
    });

    setNotice({ 
      type: 'success', 
      text: `Custom result "${title}" successfully attached to ${selectedStudent.name}'s permanent academic records.` 
    });

    // Reset form
    setTitle('');
    setOverallScore('');
    setFileAttachment(null);
    setFileName('');
    setShowUploadForm(false);
    setTimeout(() => setNotice(null), 4500);
  };

  const handleDelete = (resultId: string, resultTitle: string) => {
    if (confirm(`Are you sure you want to delete the result "${resultTitle}"? This will remove it from the scholar's transcripts.`)) {
      deleteCustomResult(resultId);
      setNotice({ type: 'success', text: `Result "${resultTitle}" was deleted successfully.` });
      setTimeout(() => setNotice(null), 3000);
    }
  };

  const handlePrintResult = (res: CustomResult) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${res.title} - ${selectedStudent?.name}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, sans-serif; padding: 40px; color: #1e293b; max-width: 800px; margin: 0 auto; }
          .header { text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 16px; margin-bottom: 24px; }
          .logo { font-size: 24px; font-weight: 900; color: #1e3a8a; }
          .subtitle { font-size: 12px; color: #64748b; margin-top: 4px; }
          .badge { display: inline-block; background: #e0e7ff; color: #3730a3; padding: 4px 12px; border-radius: 9999px; font-weight: bold; font-size: 11px; margin-top: 8px; }
          .student-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 24px; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 13px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 13px; }
          th, td { border: 1px solid #cbd5e1; padding: 10px 12px; text-align: left; }
          th { background: #f1f5f9; font-weight: bold; }
          .remarks-box { background: #fffbeb; border: 1px solid #fef3c7; border-radius: 8px; padding: 12px; font-style: italic; font-size: 12px; margin-bottom: 30px; }
          .signatures { display: flex; justify-content: space-between; margin-top: 40px; border-top: 1px solid #cbd5e1; padding-top: 16px; }
          .sig-line { width: 220px; text-align: center; font-size: 12px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">${schoolInfo.name}</div>
          <div class="subtitle">${schoolInfo.location} • Phone: ${schoolInfo.phone}</div>
          <div class="badge">OFFICIAL CERTIFIED RESULT DOSSIER</div>
          <h2 style="margin: 12px 0 0 0; font-size: 18px;">${res.title}</h2>
        </div>

        <div class="student-card">
          <div><strong>Candidate Name:</strong> ${selectedStudent?.name}</div>
          <div><strong>Admission / Reg No:</strong> ${selectedStudent?.regNumber}</div>
          <div><strong>Academic Set / Class:</strong> ${selectedStudent?.grade}</div>
          <div><strong>Examination Category:</strong> ${res.examType || 'Official Terminal'}</div>
          <div><strong>Session & Term:</strong> ${res.session || 'Active'} • ${res.term || 'Official'}</div>
          <div><strong>Overall Evaluation:</strong> ${res.overallScore || 'Authenticated'}</div>
        </div>

        ${res.subjectBreakdown && res.subjectBreakdown.length > 0 ? `
          <table>
            <thead>
              <tr>
                <th>Subject</th>
                <th>Score</th>
                <th>Grade</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              ${res.subjectBreakdown.map((s: any) => `
                <tr>
                  <td><strong>${s.subject}</strong></td>
                  <td>${s.score || '—'}</td>
                  <td><strong style="color: #1e3a8a;">${s.grade || '—'}</strong></td>
                  <td>${s.remark || '—'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        ` : ''}

        <div class="remarks-box">
          <strong>Official Dean's Endorsement:</strong> "${res.remarks || 'Result verified and cleared by Academic Registry.'}"
        </div>

        <div class="signatures">
          <div class="sig-line">
            <div style="border-bottom: 1px solid #94a3b8; height: 35px; margin-bottom: 6px;"></div>
            Academic Registrar / Delegate
          </div>
          <div class="sig-line">
            <div style="border-bottom: 1px solid #94a3b8; height: 35px; margin-bottom: 6px;"></div>
            Principal & Examination Controller
          </div>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto font-['Nunito',sans-serif]">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-fade-in flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 text-white flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-neutral-950 flex items-center justify-center font-black shadow-md">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white">
                Custom Results & Transcript Management
              </h3>
              <p className="text-xs text-blue-200">
                Upload or delete external exam slips, WAEC, NECO, BECE, Cambridge, or custom transcripts for students and alumni.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {notice && (
            <div className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2.5 animate-fade-in ${
              notice.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-rose-50 border border-rose-200 text-rose-800'
            }`}>
              {notice.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
              <span>{notice.text}</span>
            </div>
          )}

          {/* Student Selector Card */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Select Scholar or Alumni Record:
              </label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-900 outline-none"
              >
                {students.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.regNumber}) — {s.isAlumni ? `Alumni (${s.graduationSession || 'Graduated'})` : s.grade} {s.isUpgradedTutor ? '• Elevated Tutor' : ''}
                  </option>
                ))}
              </select>
            </div>

            {selectedStudent && (
              <div className="flex items-center gap-2 shrink-0">
                <span className={`px-2.5 py-1 rounded-xl text-xs font-bold border ${
                  selectedStudent.isAlumni 
                    ? 'bg-amber-100 text-amber-900 border-amber-300' 
                    : 'bg-blue-100 text-blue-900 border-blue-200'
                }`}>
                  {selectedStudent.isAlumni ? 'Graduated Alumni' : 'Active Enrolled Scholar'}
                </span>
                {selectedStudent.isUpgradedTutor && (
                  <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                    Faculty Tutor
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Action Row: Toggle Upload Form */}
          <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2 text-slate-900 font-black text-sm">
              <FileText className="w-5 h-5 text-blue-900" />
              <span>
                Existing Uploaded Results ({studentResults.length})
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowUploadForm(!showUploadForm)}
              className="px-4 py-2 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              {showUploadForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              <span>{showUploadForm ? 'Cancel Upload' : 'Upload New Custom Result'}</span>
            </button>
          </div>

          {/* Upload Form (Expandable) */}
          {showUploadForm && (
            <form onSubmit={handleSubmitUpload} className="p-5 rounded-2xl bg-blue-50/50 border border-blue-200 space-y-4 animate-fade-in">
              <div className="flex items-center justify-between border-b border-blue-200/80 pb-2">
                <span className="text-xs font-black uppercase tracking-wider text-blue-950">
                  New Result Slip / External Transcript Entry
                </span>
                <span className="text-[11px] text-blue-800">
                  Candidate: <strong>{selectedStudent?.name}</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Result Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. 2024 WAEC Senior School Certificate"
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-900 outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Exam Category *</label>
                  <select
                    value={examType}
                    onChange={(e) => setExamType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-900 outline-none"
                  >
                    <option value="WAEC">WAEC WASSCE (Senior)</option>
                    <option value="NECO">NECO SSCE (Senior)</option>
                    <option value="BECE">BECE / Junior WAEC (Basic)</option>
                    <option value="Cambridge">Cambridge IGCSE / Checkpoint</option>
                    <option value="JAMB">JAMB UTME</option>
                    <option value="Terminal">Custom Terminal Result</option>
                    <option value="Custom">External Assessment</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Overall Standing / Grade</label>
                  <input
                    type="text"
                    value={overallScore}
                    onChange={(e) => setOverallScore(e.target.value)}
                    placeholder="e.g. Distinction (8 As, 1 B) or 310 / 400"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-900 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Academic Session</label>
                  <input
                    type="text"
                    value={session}
                    onChange={(e) => setSession(e.target.value)}
                    placeholder="e.g. 2023/2024 Academic Session"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-900 outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Academic Term / Exam Diet</label>
                  <input
                    type="text"
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    placeholder="e.g. May/June Diet or 3rd Term"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-900 outline-none"
                  />
                </div>
              </div>

              {/* Subject Breakdown Table */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    Subject Score Breakdown (Optional):
                  </span>
                  <button
                    type="button"
                    onClick={handleAddSubjectRow}
                    className="text-[11px] font-bold text-blue-900 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Subject Line</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {subjectRows.map((row, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-5">
                        <input
                          type="text"
                          value={row.subject}
                          onChange={(e) => handleSubjectRowChange(idx, 'subject', e.target.value)}
                          placeholder="Subject Name"
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:ring-1 focus:ring-blue-900 outline-none"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="text"
                          value={row.score}
                          onChange={(e) => handleSubjectRowChange(idx, 'score', e.target.value)}
                          placeholder="Score (%)"
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:ring-1 focus:ring-blue-900 outline-none text-center"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="text"
                          value={row.grade}
                          onChange={(e) => handleSubjectRowChange(idx, 'grade', e.target.value)}
                          placeholder="Grade"
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:ring-1 focus:ring-blue-900 outline-none text-center font-bold"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="text"
                          value={row.remark}
                          onChange={(e) => handleSubjectRowChange(idx, 'remark', e.target.value)}
                          placeholder="Remark"
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:ring-1 focus:ring-blue-900 outline-none"
                        />
                      </div>
                      <div className="col-span-1 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveSubjectRow(idx)}
                          className="text-rose-500 hover:text-rose-700 cursor-pointer p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Remarks & Attachment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Official Registry Remarks</label>
                  <input
                    type="text"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-900 outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Document Slip Attachment (Image / PDF scan)
                  </label>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileUpload}
                    className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-900 file:text-white cursor-pointer"
                  />
                  {fileName && (
                    <span className="text-[10px] text-emerald-700 font-bold block mt-1">
                      Attached: {fileName}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-blue-200/80">
                <button
                  type="button"
                  onClick={() => setShowUploadForm(false)}
                  className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 font-bold text-xs cursor-pointer hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Upload & Save Result</span>
                </button>
              </div>
            </form>
          )}

          {/* Results List */}
          <div className="space-y-3">
            {studentResults.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs space-y-2">
                <Award className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="font-bold">No custom or external results uploaded for this scholar yet.</p>
                <p className="text-[11px] text-slate-400">
                  Click "Upload New Custom Result" above to attach WAEC, NECO, BECE, Cambridge, or custom transcripts.
                </p>
              </div>
            ) : (
              studentResults.map((res) => (
                <div 
                  key={res.id}
                  className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-black text-sm text-slate-900">{res.title}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-900 border border-blue-200">
                        {res.examType || 'Official Exam'}
                      </span>
                      {res.overallScore && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
                          {res.overallScore}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>{res.session || 'Academic Session'}</span>
                      <span>•</span>
                      <span>{res.term || 'Diet'}</span>
                      <span>•</span>
                      <span>Uploaded {new Date(res.uploadedAt).toLocaleDateString()}</span>
                    </div>

                    {res.subjectBreakdown && res.subjectBreakdown.length > 0 && (
                      <div className="text-[11px] text-slate-600 font-medium">
                        Subjects Breakdown: <span className="font-bold text-slate-800">{res.subjectBreakdown.map((s: any) => `${s.subject} (${s.grade || s.score})`).join(', ')}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handlePrintResult(res)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
                      title="Print official result transcript"
                    >
                      <Printer className="w-3.5 h-3.5 text-blue-900" />
                      <span>Print Slip</span>
                    </button>

                    {res.fileAttachment && (
                      <a
                        href={res.fileAttachment}
                        download={res.fileName || `${res.title}_attachment`}
                        className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold text-xs transition flex items-center gap-1.5"
                        title="Download attachment"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Attachment</span>
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDelete(res.id, res.title)}
                      className="p-1.5 rounded-xl text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                      title="Delete this custom result"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>
            Certified results remain permanently attached to the candidate even after promotion or alumni elevation.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-bold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
