import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, FileText, Image as ImageIcon, Code2, Film, Music, Check, Plus, AlertCircle } from 'lucide-react';
import { WorkItem, WorkCategory } from '../types/work';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWork: (work: WorkItem) => void;
  initialFiles?: File[] | null;
  mode?: 'file' | 'clipboard' | 'editor';
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onAddWork,
  initialFiles,
  mode = 'file',
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'text' | 'clipboard'>(
    mode === 'editor' ? 'text' : mode === 'clipboard' ? 'clipboard' : 'upload'
  );

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<WorkCategory>('Design & Art');
  const [tagsInput, setTagsInput] = useState('');
  const [clientOrContext, setClientOrContext] = useState('');
  const [externalUrl, setExternalUrl] = useState('');

  // File state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const [fileContentText, setFileContentText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Manual editor state
  const [manualCodeContent, setManualCodeContent] = useState('');
  const [manualCodeFilename, setManualCodeFilename] = useState('algorithm_v1.ts');

  // Clipboard paste capture
  const [clipboardData, setClipboardData] = useState<string | null>(null);
  const [clipboardType, setClipboardType] = useState<'image' | 'text' | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialFiles && initialFiles.length > 0) {
      processFile(initialFiles[0]);
    }
  }, [initialFiles]);

  if (!isOpen) return null;

  function guessCategory(mimeType: string, filename: string): WorkCategory {
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    if (mimeType.startsWith('image/')) return 'Design & Art';
    if (
      ['ts', 'tsx', 'js', 'jsx', 'py', 'rs', 'go', 'cpp', 'c', 'html', 'css', 'json', 'sql', 'sh'].includes(ext) ||
      mimeType.includes('json') || mimeType.includes('javascript')
    ) {
      return 'Code & Engineering';
    }
    if (['pdf', 'doc', 'docx', 'md', 'txt', 'rtf'].includes(ext) || mimeType.includes('pdf')) {
      return 'Writing & Research';
    }
    if (mimeType.startsWith('audio/') || mimeType.startsWith('video/') || ['mp3', 'wav', 'mp4', 'mov', 'webm'].includes(ext)) {
      return 'Media & Audio';
    }
    return 'Design & Art';
  }

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setErrorMessage(null);
    setSelectedFile(file);

    // Auto title
    const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    const formattedTitle = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
    setTitle(formattedTitle);

    // Auto category
    const cat = guessCategory(file.type, file.name);
    setCategory(cat);

    // Read content based on type
    try {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviewDataUrl(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else if (
        file.type.startsWith('text/') ||
        file.type.includes('json') ||
        file.name.match(/\.(ts|tsx|js|jsx|py|rs|go|cpp|c|html|css|json|md|txt|sql|yaml|yml)$/i)
      ) {
        const text = await file.text();
        setFileContentText(text);
      } else if (file.type.startsWith('audio/') || file.type.startsWith('video/') || file.type.includes('pdf')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviewDataUrl(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    } catch (err: any) {
      setErrorMessage('Failed to read file: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePasteCapture = async () => {
    try {
      if (!navigator.clipboard) {
        setErrorMessage('Clipboard API not supported in this browser');
        return;
      }
      const items = await navigator.clipboard.read();
      for (const item of items) {
        // Image in clipboard?
        const imageType = item.types.find(t => t.startsWith('image/'));
        if (imageType) {
          const blob = await item.getType(imageType);
          const file = new File([blob], `pasted_capture_${Date.now()}.png`, { type: imageType });
          processFile(file);
          setActiveTab('upload');
          return;
        }
      }
      // Text in clipboard?
      const text = await navigator.clipboard.readText();
      if (text) {
        setClipboardData(text);
        setClipboardType('text');
        setManualCodeContent(text);
        setActiveTab('text');
        setTitle('Clipboard Note / Script');
      } else {
        setErrorMessage('No image or text found in clipboard.');
      }
    } catch (err: any) {
      setErrorMessage('Clipboard access error: ' + (err.message || 'Please paste directly into the box'));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === 'upload') {
      if (!selectedFile && !previewDataUrl && !fileContentText) {
        setErrorMessage('Please select or drop a file to upload.');
        return;
      }

      const tags = tagsInput
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);

      const newWork: WorkItem = {
        id: 'work-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
        title: title.trim() || selectedFile?.name || 'Untitled Work',
        description: description.trim() || 'Uploaded work item.',
        category,
        tags: tags.length > 0 ? tags : [category],
        fileType: selectedFile?.type || 'application/octet-stream',
        fileName: selectedFile?.name || 'uploaded_file',
        fileSize: selectedFile?.size || 0,
        fileDataUrl: previewDataUrl || undefined,
        fileContentText: fileContentText || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        clientOrContext: clientOrContext.trim() || undefined,
        externalUrl: externalUrl.trim() || undefined,
        isSample: false,
      };

      onAddWork(newWork);
      onClose();
    } else if (activeTab === 'text') {
      if (!manualCodeContent.trim()) {
        setErrorMessage('Please enter your code, essay, or text content.');
        return;
      }

      const tags = tagsInput
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);

      const fileName = manualCodeFilename.trim() || 'document.txt';
      const cat = guessCategory('text/plain', fileName);

      const newWork: WorkItem = {
        id: 'work-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
        title: title.trim() || fileName,
        description: description.trim() || 'Written work / document.',
        category: category || cat,
        tags: tags.length > 0 ? tags : ['Written Work'],
        fileType: 'text/plain',
        fileName,
        fileSize: new Blob([manualCodeContent]).size,
        fileContentText: manualCodeContent,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        clientOrContext: clientOrContext.trim() || undefined,
        externalUrl: externalUrl.trim() || undefined,
        isSample: false,
      };

      onAddWork(newWork);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200">
          <div>
            <h2 className="text-lg font-bold text-zinc-950">Upload Your Work</h2>
            <p className="text-xs text-zinc-500">Store and present your projects, documents, code, and media</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-zinc-200 bg-zinc-50/70 px-6 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`pb-2.5 px-3 text-xs font-medium transition-colors border-b-2 ${
              activeTab === 'upload'
                ? 'border-zinc-900 text-zinc-950 font-semibold'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            Drop / Select File
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('text')}
            className={`pb-2.5 px-3 text-xs font-medium transition-colors border-b-2 ${
              activeTab === 'text'
                ? 'border-zinc-900 text-zinc-950 font-semibold'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            Write / Paste Code & Text
          </button>
          <button
            type="button"
            onClick={handlePasteCapture}
            className="ml-auto pb-2.5 px-3 text-xs font-medium text-zinc-600 hover:text-zinc-950 flex items-center gap-1"
          >
            <span>Paste from Clipboard</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {errorMessage && (
            <div className="p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {activeTab === 'upload' ? (
            <div>
              {/* File Drop Area */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`cursor-pointer border-2 border-dashed rounded-xl p-5 text-center transition-all ${
                  selectedFile
                    ? 'border-emerald-500/80 bg-emerald-50/30'
                    : 'border-zinc-300 hover:border-zinc-800 bg-zinc-50'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
                  className="hidden"
                />

                {selectedFile ? (
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 truncate">
                      <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                        <Check className="w-5 h-5" />
                      </div>
                      <div className="text-left truncate">
                        <p className="text-xs font-semibold text-zinc-900 truncate">{selectedFile.name}</p>
                        <p className="text-xs text-zinc-500 font-mono tabular-nums">
                          {(selectedFile.size / 1024).toFixed(1)} KB · {selectedFile.type || 'file'}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(null);
                        setPreviewDataUrl(null);
                        setFileContentText('');
                      }}
                      className="text-xs text-zinc-500 hover:text-zinc-900 underline shrink-0"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-6 h-6 text-zinc-400 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-zinc-900">Click to choose a file or drag here</p>
                    <p className="text-xs text-zinc-500 mt-1">Images, PDFs, documents, audio, video, or source code</p>
                  </div>
                )}
              </div>

              {/* Preview Thumbnail if image */}
              {previewDataUrl && selectedFile?.type.startsWith('image/') && (
                <div className="mt-3 relative w-full h-36 bg-zinc-100 rounded-lg overflow-hidden border border-zinc-200 flex items-center justify-center">
                  <img
                    src={previewDataUrl}
                    alt="Preview"
                    referrerPolicy="no-referrer"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              )}

              {/* Text Preview if code / text */}
              {fileContentText && (
                <div className="mt-3 p-3 bg-zinc-950 text-zinc-100 rounded-lg font-mono text-xs max-h-32 overflow-y-auto">
                  <div className="text-zinc-500 text-[10px] mb-1">Preview of first lines:</div>
                  <pre className="whitespace-pre-wrap">{fileContentText.slice(0, 400)}</pre>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  File / Artifact Name
                </label>
                <input
                  type="text"
                  value={manualCodeFilename}
                  onChange={(e) => setManualCodeFilename(e.target.value)}
                  placeholder="e.g. distributed_router.ts, essay_draft.md"
                  className="w-full px-3 py-1.5 text-xs font-mono bg-white border border-zinc-200 rounded-lg focus:ring-1 focus:ring-zinc-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Content (Source Code, Markdown, Research Notes)
                </label>
                <textarea
                  rows={6}
                  value={manualCodeContent}
                  onChange={(e) => setManualCodeContent(e.target.value)}
                  placeholder="// Paste your code, markdown manuscript, or project text here..."
                  className="w-full px-3 py-2 text-xs font-mono bg-zinc-950 text-zinc-100 border border-zinc-800 rounded-lg focus:ring-1 focus:ring-zinc-600 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Details Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                Work Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Modernist Brand System"
                className="w-full px-3 py-1.5 text-xs bg-white border border-zinc-200 rounded-lg focus:ring-1 focus:ring-zinc-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                Discipline / Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as WorkCategory)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-zinc-200 rounded-lg focus:ring-1 focus:ring-zinc-900 focus:outline-none"
              >
                <option value="Design & Art">Design & Art</option>
                <option value="Code & Engineering">Code & Engineering</option>
                <option value="Writing & Research">Writing & Research</option>
                <option value="Media & Audio">Media & Audio</option>
                <option value="Strategy & Slides">Strategy & Slides</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">
              Description / Abstract
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief context, design rationale, or problem solved by this work..."
              className="w-full px-3 py-1.5 text-xs bg-white border border-zinc-200 rounded-lg focus:ring-1 focus:ring-zinc-900 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g. UI/UX, Rust, Typography"
                className="w-full px-3 py-1.5 text-xs bg-white border border-zinc-200 rounded-lg focus:ring-1 focus:ring-zinc-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                Client, Course or Context (Optional)
              </label>
              <input
                type="text"
                value={clientOrContext}
                onChange={(e) => setClientOrContext(e.target.value)}
                placeholder="e.g. MIT, Freelance, Acme Inc"
                className="w-full px-3 py-1.5 text-xs bg-white border border-zinc-200 rounded-lg focus:ring-1 focus:ring-zinc-900 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">
              External Link / Repository (Optional)
            </label>
            <input
              type="url"
              value={externalUrl}
              onChange={(e) => setExternalUrl(e.target.value)}
              placeholder="https://github.com/... or https://figma.com/..."
              className="w-full px-3 py-1.5 text-xs bg-white border border-zinc-200 rounded-lg focus:ring-1 focus:ring-zinc-900 focus:outline-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-zinc-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="px-5 py-2 text-xs font-semibold text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <Plus className="w-3.5 h-3.5" />
              Save Work to Vault
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
