// Profile completeness calculation (0-100%) and next action
export function calculateProfileCompleteness(profile = {}, user = {}) {
  const breakdown = {
    basicInfo: 0,
    skills: 0,
    experience: 0,
    cv: 0,
    education: 0,
    bio: 0,
    photo: 0,
  };

  const nameVal = user?.name || profile?.name;
  const hasName = Boolean(nameVal && nameVal.trim().length > 0);
  const hasCity = Boolean(profile.city && profile.city.trim().length > 0);
  const hasRole = Boolean(profile.headline && profile.headline.trim().length > 0);
  const basicInfoCount = (hasName ? 1 : 0) + (hasCity ? 1 : 0) + (hasRole ? 1 : 0);
  breakdown.basicInfo = Math.round((basicInfoCount / 3) * 15);

  const skillsCount = Array.isArray(profile.skills) ? profile.skills.length : 0;
  breakdown.skills = skillsCount >= 5 ? 20 : Math.round((skillsCount / 5) * 20);

  let hasExperience = false;
  if (Array.isArray(profile.experience)) {
    hasExperience = profile.experience.length > 0;
  } else if (typeof profile.experience === 'string') {
    hasExperience = profile.experience.trim().length > 5;
  }
  breakdown.experience = hasExperience ? 20 : 0;

  const hasCv = Boolean(profile.cvUrl || profile.cvFileName);
  breakdown.cv = hasCv ? 20 : 0;

  let hasEducation = false;
  if (Array.isArray(profile.education)) {
    hasEducation = profile.education.length > 0;
  } else if (typeof profile.education === 'string') {
    hasEducation = profile.education.trim().length > 5;
  }
  breakdown.education = hasEducation ? 10 : 0;

  const hasBio = Boolean(profile.summary && profile.summary.trim().length >= 10);
  breakdown.bio = hasBio ? 10 : 0;

  const hasPhoto = Boolean(profile.photoUrl && profile.photoUrl.trim().length > 0);
  breakdown.photo = hasPhoto ? 5 : 0;

  const score = Math.min(
    100,
    breakdown.basicInfo +
      breakdown.skills +
      breakdown.experience +
      breakdown.cv +
      breakdown.education +
      breakdown.bio +
      breakdown.photo
  );

  const nextAction = getNextBestAction(score, breakdown, skillsCount, hasName, hasCity, hasRole);

  return {
    score,
    isComplete: score >= 80,
    breakdown,
    nextAction,
    details: {
      hasName,
      hasCity,
      hasRole,
      skillsCount,
      hasExperience,
      hasCv,
      hasEducation,
      hasBio,
      hasPhoto,
    },
  };
}

function getNextBestAction(currentScore, breakdown, skillsCount, hasName, hasCity, hasRole) {
  if (currentScore >= 100) {
    return {
      text: 'Profile 100% complete — verified recruiters will prioritize you!',
      gain: 0,
      targetScore: 100,
      actionKey: 'complete',
    };
  }

  if (breakdown.skills < 20) {
    const gain = 20 - breakdown.skills;
    const targetScore = Math.min(100, currentScore + gain);
    return {
      text: `Add your skills (${Math.max(0, 5 - skillsCount)} more) to reach ${targetScore}%`,
      gain,
      targetScore,
      actionKey: 'skills',
    };
  }

  if (breakdown.experience < 20) {
    const gain = 20;
    const targetScore = Math.min(100, currentScore + gain);
    return {
      text: `Add your work experience to reach ${targetScore}%`,
      gain,
      targetScore,
      actionKey: 'experience',
    };
  }

  if (breakdown.cv < 20) {
    const gain = 20;
    const targetScore = Math.min(100, currentScore + gain);
    return {
      text: `Upload your CV to reach ${targetScore}%`,
      gain,
      targetScore,
      actionKey: 'cv',
    };
  }

  if (breakdown.basicInfo < 15) {
    const gain = 15 - breakdown.basicInfo;
    const targetScore = Math.min(100, currentScore + gain);
    const missingPart = !hasRole ? 'target role' : !hasCity ? 'city' : 'full name';
    return {
      text: `Add your ${missingPart} to reach ${targetScore}%`,
      gain,
      targetScore,
      actionKey: 'basicInfo',
    };
  }

  if (breakdown.education < 10) {
    const gain = 10;
    const targetScore = Math.min(100, currentScore + gain);
    return {
      text: `Add your education to reach ${targetScore}%`,
      gain,
      targetScore,
      actionKey: 'education',
    };
  }

  if (breakdown.bio < 10) {
    const gain = 10;
    const targetScore = Math.min(100, currentScore + gain);
    return {
      text: `Add a short bio to reach ${targetScore}%`,
      gain,
      targetScore,
      actionKey: 'bio',
    };
  }

  if (breakdown.photo < 5) {
    return {
      text: `Upload a profile photo to reach 100%`,
      gain: 5,
      targetScore: 100,
      actionKey: 'photo',
    };
  }

  return {
    text: 'Keep your profile updated for verified recruiters.',
    gain: 0,
    targetScore: currentScore,
    actionKey: 'complete',
  };
}
