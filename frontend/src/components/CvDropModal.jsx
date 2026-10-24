import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  FileText,
  UploadCloud,
  FileEdit,
  Sparkles,
  Check,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { api } from '../lib/api.js';

// CV drop and extraction modal component
export default function CvDropModal({ isOpen, onClose, user }) {
  const [mode, setMode] = useState('upload'); // 'upload' | 'paste'
  const [file, setFile] = useState(null);
  const [cvText, setCvText] = useState('');
  const [parsing, setParsing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [parsedResult, setParsedResult] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setErrorMessage('');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
      setErrorMessage('');
    }
  };

  const handleExtract = async () => {
    setErrorMessage('');
    setParsing(true);

    try {
      let data;
      if (mode === 'upload') {
        if (!file) {
          throw new Error('Please select or drop a CV file first.');
        }
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

      setParsedResult(data.parsed);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to extract CV details.');
    } finally {
      setParsing(false);
    }
  };

  const handleSaveAndContinue = async () => {
    if (!parsedResult) return;

    if (user?.role === 'candidate') {
      setSaving(true);
      try {
        await api('/api/profile', {
          method: 'PUT',
          body: {
            headline: parsedResult.headline,
            skills: parsedResult.skills,
            summary: parsedResult.summary,
            city: parsedResult.city || 'Lagos',
            searchable: true,
            availability: 'Actively looking',
          },
        });
        onClose();
        navigate('/profile');
      } catch (err) {
        setErrorMessage(err.message || 'Failed to save profile.');
      } finally {
        setSaving(false);
      }
    } else {
      // Store draft profile in sessionStorage for signup
      sessionStorage.setItem('iali_draft_profile', JSON.stringify(parsedResult));
      onClose();
      navigate('/signup');
    }
  };

  const reset = () => {
    setParsedResult(null);
    setFile(null);
    setCvText('');
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/60 backdrop-blur-xs flex items-center justify-center p-4" onClick={onClose}>
      <div className="relative w-full max-w-lg bg-white border border-zinc-200 rounded-3xl p-6 md:p-8 shadow-xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <button
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 flex items-center justify-center transition cursor-pointer"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {!parsedResult ? (
          <>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-zinc-900">Drop your CV</h2>
              <FileText className="w-5 h-5 text-zinc-700" />
            </div>
            <p className="text-xs md:text-sm text-zinc-500 mb-4">
              Auto-extract skills, experience, and title in under 30 seconds.
            </p>

            {/* Mode Tabs */}
            <div className="flex gap-2 mb-4 p-1 bg-zinc-100 rounded-xl">
              <button
                type="button"
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  mode === 'upload' ? 'bg-white text-zinc-950 shadow-xs' : 'text-zinc-500 hover:text-zinc-900'
                }`}
                onClick={() => setMode('upload')}
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Drop File (.pdf, .txt)</span>
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
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition mb-4 ${
                  isDragOver ? 'border-zinc-950 bg-zinc-50' : 'border-zinc-300 hover:border-zinc-500 bg-zinc-50/50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
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
                <textarea
                  rows="6"
                  placeholder="Paste your CV text here (e.g. Adaeze Okafor, Frontend Engineer with 4 years experience in React, JavaScript, Node.js, Lagos...)"
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
              onClick={handleExtract}
              disabled={
                parsing ||
                (mode === 'upload' && !file) ||
                (mode === 'paste' && cvText.trim().length < 10)
              }
            >
              <Sparkles className="w-4 h-4" />
              <span>{parsing ? 'Extracting your details…' : 'Extract my profile'}</span>
              {!parsing && <ArrowRight className="w-4 h-4" />}
            </button>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Auto-Extracted</span>
              </span>
              <span className="text-xs text-zinc-500">Review before saving</span>
            </div>

            <h3 className="text-lg font-bold text-zinc-900 mb-1">{parsedResult.headline}</h3>
            <p className="text-xs text-zinc-500 mb-4">{parsedResult.summary}</p>

            <div className="mb-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                Detected Skills ({parsedResult.skills?.length || 0})
              </label>
              <div className="flex gap-1.5 flex-wrap">
                {(parsedResult.skills || []).map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-800 border border-zinc-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                <span className="text-[11px] text-zinc-500 block">Experience</span>
                <b className="text-sm text-zinc-900">{parsedResult.experienceYears} Years</b>
              </div>
              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                <span className="text-[11px] text-zinc-500 block">Location</span>
                <b className="text-sm text-zinc-900">{parsedResult.city || 'Lagos'}</b>
              </div>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium">
                {errorMessage}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                className="py-2.5 px-4 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-900 transition cursor-pointer flex items-center justify-center gap-1.5"
                onClick={reset}
                disabled={saving}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Try another CV</span>
              </button>
              <button
                className="py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-semibold transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
                onClick={handleSaveAndContinue}
                disabled={saving}
              >
                <Check className="w-3.5 h-3.5" />
                <span>
                  {saving
                    ? 'Saving…'
                    : user?.role === 'candidate'
                    ? 'Save to My Profile'
                    : 'Claim Profile & Sign up'}
                </span>
                {!saving && user?.role !== 'candidate' && <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
