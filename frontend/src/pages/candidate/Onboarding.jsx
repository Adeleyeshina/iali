import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api.js';
import { useToast } from '../../context/ToastContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import OnboardingHeader from '../../components/candidate/onboarding/OnboardingHeader.jsx';
import OnboardingUploadStep from '../../components/candidate/onboarding/OnboardingUploadStep.jsx';
import OnboardingReviewStep from '../../components/candidate/onboarding/OnboardingReviewStep.jsx';

// Candidate profile auto-setup screen from uploaded or pasted CV
export default function Onboarding() {
  const { refreshUser } = useAuth();
  const [mode, setMode] = useState('upload');
  const [file, setFile] = useState(null);
  const [cvText, setCvText] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

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
      toast.success('CV extracted successfully!');
    } catch (err) {
      setErrorMessage(err.message || 'Failed to extract CV details');
      toast.error(err.message || 'Failed to extract CV');
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
          cvFileName: parsedResult.parsed.cvFileName || (file ? file.name : 'Parsed_Resume.pdf'),
        },
      });

      await refreshUser();
      toast.success('Profile created successfully from CV!');
      navigate('/profile');
    } catch (err) {
      toast.error(err.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-[1120px] mx-auto my-4">
      <OnboardingHeader currentStep={currentStep} />

      {currentStep === 1 ? (
        <OnboardingUploadStep
          mode={mode}
          setMode={setMode}
          file={file}
          setFile={setFile}
          cvText={cvText}
          setCvText={setCvText}
          isDragOver={isDragOver}
          setIsDragOver={setIsDragOver}
          parsing={parsing}
          onExtract={handleExtractDetails}
          errorMessage={errorMessage}
        />
      ) : (
        <OnboardingReviewStep
          parsedResult={parsedResult}
          setParsedResult={setParsedResult}
          onBack={() => setParsedResult(null)}
          onSave={handleSaveProfile}
          saving={saving}
        />
      )}
    </div>
  );
}
