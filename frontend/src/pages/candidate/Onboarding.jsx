import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  UploadCloud,
  FileEdit,
  Sparkles,
  Lightbulb,
  Check,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { api } from '../../lib/api.js';
import { useToast } from '../../context/ToastContext.jsx';

// Candidate profile onboarding screen
export default function Onboarding() {
  const [mode, setMode] = useState('upload'); // 'upload' | 'paste'
  const [file, setFile] = useState(null);
  const [cvText, setCvText] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const toast = useToast();

  const [parsedResult, setParsedResult] = useState(() => {
    try {
      const draft = sessionStorage.getItem('iali_draft_profile');
      if (draft) {
        return { parsed: JSON.parse(draft) };
      }
    } catch {
      // ignore
    }
    return null;
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [parsing, setParsing] = useState(false);
  const [saving, setSaving] = useState(false);

  const currentStep = !parsedResult ? 1 : 2;

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setErrorMessage('');
    }
  };

  const handleExtractDetails = async () => {
    if (parsing) return;
    setParsing(true);
    setErrorMessage('');

    try {
      let data;
      if (mode === 'upload') {
        if (!file) throw new Error('Please select or drop a CV file first.');
        const formData = new FormData();
        formData.append('file', file);
        data = await api('/api/profile/parse', {
          method: 'POST',
          body: formData,
        });
      } else {
        if (!cvText.trim() || cvText.trim().length < 10) {
          throw new Error('Please enter at least 10 characters of CV text.');
        }
        data = await api('/api/profile/parse', {
          method: 'POST',
          body: { text: cvText },
        });
      }

      setParsedResult(data);
      sessionStorage.removeItem('iali_draft_profile');
    } catch (err) {
      setErrorMessage(err.message || 'Failed to extract CV details');
    } finally {
      setParsing(false);
    }
  };

  const handleSaveProfile = async () => {
    if (saving || !parsedResult?.parsed) return;
    setSaving(true);

    try {
      await api('/api/profile', {
        method: 'PUT',
        body: {
          headline: parsedResult.parsed.headline,
          skills: parsedResult.parsed.skills,
          summary: parsedResult.parsed.summary,
          city: parsedResult.parsed.city || 'Lagos',
          searchable: true,
          availability: 'Actively looking',
        },
      });
      sessionStorage.removeItem('iali_draft_profile');
      setParsedResult({ ...parsedResult, saved: true });
      toast.success('Profile created successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white border border-zinc-200 rounded-3xl p-6 md:p-8 shadow-xs my-4">
      <div className="flex items-center gap-2 mb-1">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Build your profile</h1>
        <FileText className="w-5 h-5 text-zinc-700" />
      </div>
      <p className="text-xs md:text-sm text-zinc-500 mb-4">
        Upload or paste your CV, review what we extract, then save. Nothing saves without your OK.
      </p>

      {/* Progress Steps */}
      <div className="flex gap-2 mb-6">
        <span className={`h-1.5 flex-1 rounded-full transition ${currentStep >= 1 ? 'bg-zinc-950' : 'bg-zinc-200'}`} />
        <span className={`h-1.5 flex-1 rounded-full transition ${currentStep >= 2 ? 'bg-zinc-950' : 'bg-zinc-200'}`} />
        <span className={`h-1.5 flex-1 rounded-full transition ${parsedResult?.saved ? 'bg-zinc-950' : 'bg-zinc-200'}`} />
      </div>

      {!parsedResult && (
        <>
          {/* Tab Selector */}
          <div className="flex gap-2 mb-4 p-1 bg-zinc-100 rounded-xl">
            <button
              type="button"
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
                mode === 'upload' ? 'bg-white text-zinc-950 shadow-xs' : 'text-zinc-500 hover:text-zinc-900'
              }`}
              onClick={() => setMode('upload')}
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Upload File (.pdf, .txt)</span>
            </button>
            <button
              type="button"
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
                mode === 'paste' ? 'bg-white text-zinc-950 shadow-xs' : 'text-zinc-500 hover:text-zinc-900'
              }`}
              onClick={() => setMode('paste')}
            >
              <FileEdit className="w-3.5 h-3.5" />
              <span>Paste Text</span>
            </button>
          </div>

          {mode === 'upload' ? (
            <div
              className={`border-2 border-dashed rounded-2xl p-7 text-center cursor-pointer transition mb-4 ${
                isDragOver ? 'border-zinc-950 bg-zinc-50' : 'border-zinc-300 hover:border-zinc-500 bg-zinc-50/50'
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragOver(false);
                const f = e.dataTransfer.files?.[0];
                if (f) {
                  setFile(f);
                  setErrorMessage('');
                }
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                accept=".pdf,.txt,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
              <UploadCloud className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
              {file ? (
                <div>
                  <b className="text-sm text-zinc-900 block">{file.name}</b>
                  <p className="text-xs text-zinc-500 mt-1">
                    {(file.size / 1024).toFixed(1)} KB · Click to choose different file
                  </p>
                </div>
              ) : (
                <div>
                  <b className="text-sm text-zinc-900 block">Drag & drop your resume file here</b>
                  <p className="text-xs text-zinc-500 mt-1">
                    Supports PDF, TXT · Or click to browse
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="mb-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                Paste CV text
              </label>
              <textarea
                rows="7"
                placeholder="e.g. Adaeze O. — Frontend developer, 4 years React, JavaScript, CSS, Lagos…"
                value={cvText}
                onChange={(e) => setCvText(e.target.value)}
                disabled={parsing}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm text-zinc-900 bg-white placeholder-zinc-400 focus:outline-none focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10 transition resize-none"
              />
            </div>
          )}

          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium">
              {errorMessage}
            </div>
          )}

          <button
            className="w-full py-3 px-4 rounded-xl bg-zinc-900 hover:bg-black text-white text-sm font-semibold transition shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-1.5"
            onClick={handleExtractDetails}
            disabled={
              parsing ||
              (mode === 'upload' && !file) ||
              (mode === 'paste' && cvText.trim().length < 10)
            }
          >
            <Sparkles className="w-4 h-4" />
            <span>{parsing ? 'Extracting details…' : 'Extract my details'}</span>
            {!parsing && <ArrowRight className="w-4 h-4" />}
          </button>

          <p className="text-xs text-zinc-400 text-center mt-3 flex items-center justify-center gap-1">
            <Lightbulb className="w-3.5 h-3.5 text-zinc-400" />
            <span>Tip: We auto-detect your skills, years of experience, and city. You can edit before saving.</span>
          </p>
        </>
      )}

      {parsedResult && !parsedResult.saved && (
        <div className="space-y-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700">
            Step 2 — review before saving
          </label>

          <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200">
            <b className="text-base font-bold text-zinc-900 block">{parsedResult.parsed.headline || 'Your headline'}</b>
            <p className="text-xs text-zinc-600 mt-1 mb-3">{parsedResult.parsed.summary}</p>

            <div className="flex gap-1.5 flex-wrap mb-3">
              {(parsedResult.parsed.skills || []).map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-800 border border-zinc-200"
                >
                  {skill}
                </span>
              ))}
            </div>

            <div className="flex gap-4 text-xs text-zinc-600 pt-2 border-t border-zinc-200">
              {parsedResult.parsed.experienceYears && (
                <span>
                  Detected: <b>{parsedResult.parsed.experienceYears} yrs</b> experience
                </span>
              )}
              {parsedResult.parsed.city && (
                <span>
                  City: <b>{parsedResult.parsed.city}</b>
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              className="py-2.5 px-4 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-900 transition cursor-pointer flex items-center justify-center gap-1.5"
              onClick={() => {
                sessionStorage.removeItem('iali_draft_profile');
                setParsedResult(null);
              }}
              disabled={saving}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Re-upload / Edit</span>
            </button>

            <button
              className="py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-semibold transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
              onClick={handleSaveProfile}
              disabled={saving}
            >
              <Check className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving profile…' : 'Looks good — save'}</span>
            </button>
          </div>
        </div>
      )}

      {parsedResult?.saved && (
        <div className="text-center py-6">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
          <h3 className="text-xl font-bold text-zinc-900 mb-1">Profile live!</h3>
          <p className="text-xs md:text-sm text-zinc-500 mb-5">
            Verified recruiters can now find and message you.
          </p>
          <Link
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs md:text-sm font-semibold transition shadow-xs"
            to="/profile"
          >
            <span>Polish my profile</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
