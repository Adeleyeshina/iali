import { useEffect, useState, useMemo, useRef } from 'react';
import { toast } from '../../context/ToastContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { api } from '../../lib/api.js';
import CompletenessMeter from '../../components/CompletenessMeter.jsx';
import { calculateProfileCompleteness } from '../../lib/completeness.js';
import ProfileHeader from '../../components/candidate/profile/ProfileHeader.jsx';
import BasicInfoSection from '../../components/candidate/profile/BasicInfoSection.jsx';
import SkillsSection from '../../components/candidate/profile/SkillsSection.jsx';
import ExperienceSection from '../../components/candidate/profile/ExperienceSection.jsx';
import CvSection from '../../components/candidate/profile/CvSection.jsx';
import EducationSection from '../../components/candidate/profile/EducationSection.jsx';
import BioSection from '../../components/candidate/profile/BioSection.jsx';
import PhotoSection from '../../components/candidate/profile/PhotoSection.jsx';
import PreferencesSection from '../../components/candidate/profile/PreferencesSection.jsx';

// Candidate settings and talent pool profile management
export default function Profile() {
  const { updateUser, refreshUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const sectionsRef = useRef({});

  useEffect(() => {
    api('/api/profile')
      .then((data) => setProfile(data))
      .catch(() => setProfile({}));
  }, []);

  // Compute live completeness whenever profile fields change
  const liveCompleteness = useMemo(() => {
    if (!profile) return null;
    return calculateProfileCompleteness(profile, { name: profile.name });
  }, [profile]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await api('/api/profile', { method: 'PUT', body: profile });
      setProfile((prev) => ({ ...prev, ...res }));
      updateUser({ profile: res });
      refreshUser();
      const msg = 'Saved at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setStatusMessage(msg);
      toast.success('Profile saved successfully!');
    } catch (err) {
      setStatusMessage(err.message || 'Failed to save profile');
      toast.error(err.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleActionClick = (actionKey) => {
    const el = sectionsRef.current[actionKey];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.focus?.();
    }
  };

  if (!profile) {
    return <div className="h-48 bg-zinc-100 rounded-3xl animate-pulse" />;
  }

  // Work experience helpers
  const experiences = Array.isArray(profile.experience) ? profile.experience : [];
  const addExperience = () => {
    setProfile({ ...profile, experience: [...experiences, { title: '', company: '', period: '', description: '' }] });
  };
  const updateExperience = (idx, field, val) => {
    const next = experiences.map((exp, i) => (i === idx ? { ...exp, [field]: val } : exp));
    setProfile({ ...profile, experience: next });
  };
  const removeExperience = (idx) => {
    setProfile({ ...profile, experience: experiences.filter((_, i) => i !== idx) });
  };

  // Education helpers
  const educations = Array.isArray(profile.education) ? profile.education : [];
  const addEducation = () => {
    setProfile({ ...profile, education: [...educations, { school: '', degree: '', year: '' }] });
  };
  const updateEducation = (idx, field, val) => {
    const next = educations.map((edu, i) => (i === idx ? { ...edu, [field]: val } : edu));
    setProfile({ ...profile, education: next });
  };
  const removeEducation = (idx) => {
    setProfile({ ...profile, education: educations.filter((_, i) => i !== idx) });
  };

  return (
    <div className="max-w-[1120px] mx-auto my-4 space-y-5">
      <ProfileHeader profile={profile} />

      <CompletenessMeter
        completeness={liveCompleteness}
        onActionClick={handleActionClick}
      />

      <div className="bg-white border border-zinc-200 rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
        <BasicInfoSection
          profile={profile}
          setProfile={setProfile}
          breakdown={liveCompleteness?.breakdown}
          sectionRef={(el) => (sectionsRef.current.basicInfo = el)}
        />

        <SkillsSection
          profile={profile}
          setProfile={setProfile}
          breakdown={liveCompleteness?.breakdown}
          sectionRef={(el) => (sectionsRef.current.skills = el)}
        />

        <ExperienceSection
          experiences={experiences}
          addExperience={addExperience}
          updateExperience={updateExperience}
          removeExperience={removeExperience}
          breakdown={liveCompleteness?.breakdown}
          sectionRef={(el) => (sectionsRef.current.experience = el)}
        />

        <CvSection
          profile={profile}
          breakdown={liveCompleteness?.breakdown}
          sectionRef={(el) => (sectionsRef.current.cv = el)}
        />

        <EducationSection
          educations={educations}
          addEducation={addEducation}
          updateEducation={updateEducation}
          removeEducation={removeEducation}
          breakdown={liveCompleteness?.breakdown}
          sectionRef={(el) => (sectionsRef.current.education = el)}
        />

        <BioSection
          profile={profile}
          setProfile={setProfile}
          breakdown={liveCompleteness?.breakdown}
          sectionRef={(el) => (sectionsRef.current.bio = el)}
        />

        <PhotoSection
          profile={profile}
          setProfile={setProfile}
          breakdown={liveCompleteness?.breakdown}
          sectionRef={(el) => (sectionsRef.current.photo = el)}
        />

        <PreferencesSection
          profile={profile}
          setProfile={setProfile}
          saving={saving}
          onSave={handleSave}
          statusMessage={statusMessage}
        />
      </div>
    </div>
  );
}
