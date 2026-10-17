import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api.js';

export default function Onboarding() {
  const [cvText, setCvText] = useState('');
  const [parsedResult, setParsedResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [parsing, setParsing] = useState(false);
  const [saving, setSaving] = useState(false);

  const currentStep = !parsedResult ? 1 : 2;

  const handleExtractDetails = async () => {
    if (parsing) return;
    setParsing(true);
    setErrorMessage('');

    try {
      const data = await api('/api/profile/parse', {
        method: 'POST',
        body: { text: cvText },
      });
      setParsedResult(data);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setParsing(false);
    }
  };

  const handleSaveProfile = async () => {
    if (saving) return;
    setSaving(true);

    try {
      await api('/api/profile', {
        method: 'PUT',
        body: {
          headline: parsedResult.parsed.headline,
          skills: parsedResult.parsed.skills,
          summary: parsedResult.parsed.summary,
          city: 'Lagos',
          searchable: true,
          availability: 'Actively looking',
        },
      });
      setParsedResult({ ...parsedResult, saved: true });
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card">
      <h2 style={{ margin: '0 0 4px' }}>Build your profile 📄</h2>
      <p className="mut">Paste your CV → review what we pick up → save. Nothing saves without your OK.</p>

      <div className="steps">
        <span className={`step ${currentStep >= 1 ? 'on' : ''}`} />
        <span className={`step ${currentStep >= 2 ? 'on' : ''}`} />
        <span className={`step ${parsedResult?.saved ? 'on' : ''}`} />
      </div>

      {!parsedResult && (
        <>
          <label className="lbl">Step 1 — paste CV text</label>
          <textarea
            rows="7"
            placeholder="e.g. Adaeze O. — Frontend developer, 4 years React, JavaScript, CSS, Lagos…"
            value={cvText}
            onChange={(e) => setCvText(e.target.value)}
            disabled={parsing}
          />

          {errorMessage && <p className="flag">{errorMessage}</p>}

          <button
            className="btn block"
            onClick={handleExtractDetails}
            disabled={parsing || cvText.trim().length < 20}
          >
            {parsing ? 'Extracting details…' : 'Extract my details →'}
          </button>

          <p className="mut">Tip: include skills + years + city. File upload lands in the next release.</p>
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

            {parsedResult.parsed.experienceYears && (
              <p className="mut">Detected: {parsedResult.parsed.experienceYears} yrs experience</p>
            )}
          </div>

          <div className="grid2">
            <button
              className="btn ghost"
              onClick={() => setParsedResult(null)}
              disabled={saving}
            >
              ← Edit text
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
