import { useRef } from 'react';
import { UploadCloud, FileEdit, Sparkles, Lightbulb } from 'lucide-react';

// Step 1: CV file drag drop or text input parsing
export default function OnboardingUploadStep({
  mode,
  setMode,
  file,
  setFile,
  cvText,
  setCvText,
  isDragOver,
  setIsDragOver,
  parsing,
  onExtract,
  errorMessage,
}) {
  const fileInputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
      <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl w-fit">
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
            mode === 'upload'
              ? 'bg-white text-indigo-950 font-bold shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <UploadCloud className="w-3.5 h-3.5 text-indigo-600" />
          <span>Upload File (PDF, TXT, DOCX)</span>
        </button>

        <button
          type="button"
          onClick={() => setMode('paste')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
            mode === 'paste'
              ? 'bg-white text-indigo-950 font-bold shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileEdit className="w-3.5 h-3.5 text-coral-500" />
          <span>Paste Resume Text</span>
        </button>
      </div>

      {mode === 'upload' ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-3xl p-8 md:p-12 text-center cursor-pointer transition ${
            isDragOver
              ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20'
              : 'border-slate-300 hover:border-indigo-400 bg-slate-50/50'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
            accept=".pdf,.txt,.docx"
            className="hidden"
          />
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3 shadow-xs">
            <UploadCloud className="w-7 h-7" />
          </div>
          <b className="text-sm md:text-base font-bold text-slate-900 block mb-1">
            {file ? file.name : 'Click to upload or drag & drop resume'}
          </b>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Supported formats: PDF, DOCX, TXT. File is safely parsed on local server.
          </p>
        </div>
      ) : (
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Paste CV Raw Text
          </label>
          <textarea
            rows="8"
            placeholder="Paste your CV or LinkedIn summary here…"
            value={cvText}
            onChange={(e) => setCvText(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs md:text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15 transition shadow-xs"
          />
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
          {errorMessage}
        </div>
      )}

      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Lightbulb className="w-4 h-4 text-coral-500" />
          <span>Parses Nigerian and international resume formats</span>
        </div>

        <button
          type="button"
          onClick={onExtract}
          disabled={parsing || (mode === 'upload' && !file) || (mode === 'paste' && !cvText.trim())}
          className="px-6 py-3 rounded-xl bg-gradient-coral hover:opacity-95 text-white text-xs md:text-sm font-bold transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-white" />
          <span>{parsing ? 'Extracting details…' : 'Extract & Preview'}</span>
        </button>
      </div>
    </div>
  );
}
