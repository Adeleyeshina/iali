import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api.js';

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
      // Store draft profile in sessionStorage so signup/onboarding can immediately consume it
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          ✕
        </button>

        {!parsedResult ? (
          <>
            <h2 style={{ margin: '0 0 6px' }}>Drop your CV 📄</h2>
            <p className="mut" style={{ margin: '0 0 16px' }}>
              Auto-extract skills, experience, and title. Done in under 30 seconds.
            </p>

            <div className="tab-nav">
              <button
                type="button"
                className={`tab-btn ${mode === 'upload' ? 'active' : ''}`}
                onClick={() => setMode('upload')}
              >
                📁 Drop File (.pdf, .txt)
              </button>
              <button
                type="button"
                className={`tab-btn ${mode === 'paste' ? 'active' : ''}`}
                onClick={() => setMode('paste')}
              >
                ✍️ Paste Text
              </button>
            </div>

            {mode === 'upload' ? (
              <div
                className={`dropzone ${isDragOver ? 'dragover' : ''}`}
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
                />
                <div style={{ fontSize: 32, marginBottom: 8 }}>📄</div>
                {file ? (
                  <div>
                    <b>{file.name}</b>
                    <p className="mut" style={{ margin: '4px 0 0', fontSize: 12 }}>
                      {(file.size / 1024).toFixed(1)} KB · Click to choose different file
                    </p>
                  </div>
                ) : (
                  <div>
                    <b>Drag & drop your resume file here</b>
                    <p className="mut" style={{ margin: '6px 0 0', fontSize: 13 }}>
                      Supports PDF, TXT · Or click to browse
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <textarea
                  rows="6"
                  placeholder="Paste your CV text here (e.g. Adaeze Okafor, Frontend Engineer with 4 years experience in React, JavaScript, Node.js, Lagos...)"
                  value={cvText}
                  onChange={(e) => setCvText(e.target.value)}
                  disabled={parsing}
                  style={{ width: '100%', marginBottom: 12 }}
                />
              </div>
            )}

            {errorMessage && <p className="flag" style={{ marginBottom: 14 }}>{errorMessage}</p>}

            <button
              className="btn block"
              onClick={handleExtract}
              disabled={
                parsing ||
                (mode === 'upload' && !file) ||
                (mode === 'paste' && cvText.trim().length < 10)
              }
            >
              {parsing ? 'Extracting your details… ✨' : 'Extract my profile →'}
            </button>
          </>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span className="badge">✓ Auto-Extracted</span>
              <span className="mut" style={{ fontSize: 12 }}>Review before saving</span>
            </div>

            <h3 style={{ margin: '4px 0 8px' }}>{parsedResult.headline}</h3>
            <p className="mut" style={{ margin: '0 0 14px' }}>
              {parsedResult.summary}
            </p>

            <div style={{ marginBottom: 14 }}>
              <label className="lbl">Detected Skills ({parsedResult.skills?.length || 0})</label>
              <div className="tagrow" style={{ marginTop: 4 }}>
                {(parsedResult.skills || []).map((skill) => (
                  <span key={skill} className="badge">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid2" style={{ marginBottom: 16 }}>
              <div className="card" style={{ margin: 0, padding: 12, background: 'var(--g50)' }}>
                <span className="mut" style={{ fontSize: 12 }}>Experience</span>
                <b style={{ display: 'block', fontSize: 15 }}>{parsedResult.experienceYears} Years</b>
              </div>
              <div className="card" style={{ margin: 0, padding: 12, background: 'var(--g50)' }}>
                <span className="mut" style={{ fontSize: 12 }}>Location</span>
                <b style={{ display: 'block', fontSize: 15 }}>{parsedResult.city || 'Lagos'}</b>
              </div>
            </div>

            {errorMessage && <p className="flag" style={{ marginBottom: 14 }}>{errorMessage}</p>}

            <div className="grid2">
              <button className="btn ghost" onClick={reset} disabled={saving}>
                ← Try another CV
              </button>
              <button className="btn" onClick={handleSaveAndContinue} disabled={saving}>
                {saving
                  ? 'Saving…'
                  : user?.role === 'candidate'
                  ? 'Save to My Profile ✓'
                  : 'Claim Profile & Sign up →'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

