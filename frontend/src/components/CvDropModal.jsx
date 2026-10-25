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
import { useAuth } from '../context/AuthContext.jsx';

// CV drop and extraction modal component
export default function CvDropModal({ isOpen, onClose, user: propUser }) {
  const auth = useAuth();
  const user = propUser !== undefined ? propUser : auth.user;
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
        await auth.refreshUser();
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
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4" onClick={onClose}>
      <div className="relative w-full max-w-lg bg-white border border-slate-200/90 rounded-3xl p-6 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <button
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {!parsedResult ? (
          <>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl md:text-2xl font-black tracking-tight text-slate-900">Drop your CV</h2>
              <FileText className="w-5 h-5 text-indigo-600" />
            </div>
            <p className="text-xs md:text-sm text-slate-500 mb-4">
              Auto-extract skills, experience, and title in under 30 seconds.
            </p>

            {/* Mode Tabs */}
            <div className="flex gap-2 mb-4 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  mode === 'upload' ? 'bg-white text-indigo-950 font-bold shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
                onClick={() => setMode('upload')}
              >
                <UploadCloud className="w-3.5 h-3.5 text-indigo-600" />
                <span>Drop File (.pdf, .txt)</span>
              </button>
              <button
                type="button"
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  mode === 'paste' ? 'bg-white text-indigo-950 font-bold shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
                onClick={() => setMode('paste')}
              >
                <FileEdit className="w-3.5 h-3.5 text-coral-500" />
                <span>Paste Text</span>
              </button>
            </div>

            {mode === 'upload' ? (
              <div
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition mb-4 ${
                  isDragOver ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20' : 'border-slate-300 hover:border-indigo-400 bg-slate-50/50'
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
                <UploadCloud className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
                {file ? (
                  <div>
                    <b className="text-sm text-slate-900 block">{file.name}</b>
                    <p className="text-xs text-slate-500 mt-1">
                      {(file.size / 1024).toFixed(1)} KB · Click to choose different file
                    </p>
                  </div>
                ) : (
                  <div>
                    <b className="text-sm text-slate-900 block">Drag & drop your resume file here</b>
                    <p className="text-xs text-slate-500 mt-1">
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15 transition resize-none"
                />
              </div>
            )}

            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
                {errorMessage}
              </div>
            )}

            <button
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-coral hover:opacity-95 text-white text-sm font-bold transition shadow-md shadow-coral-500/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
              onClick={handleExtract}
              disabled={
                parsing ||
                (mode === 'upload' && !file) ||
                (mode === 'paste' && cvText.trim().length < 10)
              }
            >
              <Sparkles className="w-4 h-4 text-white" />
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
              <span className="text-xs text-slate-500">Review before saving</span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-1">{parsedResult.headline}</h3>
            <p className="text-xs text-slate-500 mb-4">{parsedResult.summary}</p>

            <div className="mb-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Detected Skills ({parsedResult.skills?.length || 0})
              </label>
              <div className="flex gap-1.5 flex-wrap">
                {(parsedResult.skills || []).map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-950 border border-indigo-200/60"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Experience</span>
                <b className="text-sm text-slate-900">{parsedResult.experienceYears} Years</b>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Location</span>
                <b className="text-sm text-slate-900">{parsedResult.city || 'Lagos'}</b>
              </div>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
                {errorMessage}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                className="py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-800 transition cursor-pointer flex items-center justify-center gap-1.5"
                onClick={reset}
                disabled={saving}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Try another CV</span>
              </button>
              <button
                className="py-2.5 px-4 rounded-xl bg-gradient-brand hover:opacity-95 text-white text-xs font-bold transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-md shadow-indigo-500/20"
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
