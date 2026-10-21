import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api.js';

export default function Onboarding() {
  const [mode, setMode] = useState('upload'); // 'upload' | 'paste'
  const [file, setFile] = useState(null);
  const [cvText, setCvText] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

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
    } catch (err) {
      alert(err.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card">
      <h2 style={{ margin: '0 0 4px' }}>Build your profile 📄</h2>
      <p className="mut">Upload or paste your CV → review what we pick up → save. Nothing saves without your OK.</p>

      <div className="steps">
        <span className={`step ${currentStep >= 1 ? 'on' : ''}`} />
        <span className={`step ${currentStep >= 2 ? 'on' : ''}`} />
        <span className={`step ${parsedResult?.saved ? 'on' : ''}`} />
      </div>

      {!parsedResult && (
        <>
          <div className="tab-nav">
            <button
              type="button"
              className={`tab-btn ${mode === 'upload' ? 'active' : ''}`}
              onClick={() => setMode('upload')}
            >
              📁 Upload File (.pdf, .txt)
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
              <label className="lbl">Paste CV text</label>
              <textarea
                rows="7"
                placeholder="e.g. Adaeze O. — Frontend developer, 4 years React, JavaScript, CSS, Lagos…"
                value={cvText}
                onChange={(e) => setCvText(e.target.value)}
                disabled={parsing}
                style={{ width: '100%', marginBottom: 12 }}
              />
            </div>
          )}

          {errorMessage && <p className="flag">{errorMessage}</p>}

          <button
            className="btn block"
            onClick={handleExtractDetails}
            disabled={
              parsing ||
              (mode === 'upload' && !file) ||
              (mode === 'paste' && cvText.trim().length < 10)
            }
          >
            {parsing ? 'Extracting details… ✨' : 'Extract my details →'}
          </button>

          <p className="mut" style={{ marginTop: 12, fontSize: 13 }}>
            💡 Tip: We auto-detect your skills, years of experience, and city. You'll be able to review and edit everything before saving.
          </p>
        </>
      )}

      {parsedResult && !parsedResult.saved && (
        <div>
          <label className="lbl">Step 2 — review before saving</label>

          <div className="card" style={{ background: 'var(--g50)' }}>
            <b>{parsedResult.parsed.headline || 'Your headline'}</b>
            <p className="mut">{parsedResult.parsed.summary}</p>

            <div className="tagrow">
              {(parsedResult.parsed.skills || []).map((skill) => (
                <span key={skill} className="badge">
                  {skill}
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
              {parsedResult.parsed.experienceYears && (
                <p className="mut" style={{ margin: 0 }}>
                  Detected: <b>{parsedResult.parsed.experienceYears} yrs</b> experience
                </p>
              )}
              {parsedResult.parsed.city && (
                <p className="mut" style={{ margin: 0 }}>
                  City: <b>{parsedResult.parsed.city}</b>
                </p>
              )}
            </div>
          </div>

          <div className="grid2">
            <button
              className="btn ghost"
              onClick={() => {
                sessionStorage.removeItem('iali_draft_profile');
                setParsedResult(null);
              }}
              disabled={saving}
            >
              ← Re-upload / Edit
            </button>

            <button className="btn" onClick={handleSaveProfile} disabled={saving}>
              {saving ? 'Saving profile…' : 'Looks good — save ✓'}
            </button>
          </div>
        </div>
      )}

      {parsedResult?.saved && (
        <div className="card empty">
          <div className="big">🎉</div>
          <h3>Profile live!</h3>
          <p className="mut">Verified recruiters can now find and message you.</p>
          <Link className="btn" to="/profile">
            Polish my profile →
          </Link>
        </div>
      )}
    </div>
  );
}
