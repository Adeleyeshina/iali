const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
  'from', 'as', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has',
  'had', 'do', 'does', 'did', 'but', 'if', 'then', 'else', 'when', 'up', 'down',
  'senior', 'junior', 'lead', 'mid', 'intern', 'specialist', 'associate', 'officer',
]);

function extractKeywords(text) {
  if (!text || typeof text !== 'string') return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#]/g, ' ')
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 1 && !STOP_WORDS.has(w));
}

function normalizeSkill(skill) {
  return String(skill || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, '');
}

// Calculate rule-based match score between job and candidate profile
export function calculateMatchScore(job = {}, candidateProfile = {}) {
  const candidateSkills = Array.isArray(candidateProfile.skills) ? candidateProfile.skills : [];
  const requiredSkills = Array.isArray(job.requiredSkills) ? job.requiredSkills : [];

  if (candidateSkills.length === 0) {
    return {
      hasScore: false,
      score: null,
      label: null,
      message: 'Add skills to see your match',
      reason: 'no_candidate_skills',
    };
  }

  if (requiredSkills.length === 0) {
    return {
      hasScore: false,
      score: null,
      label: null,
      message: null,
      reason: 'no_job_skills',
    };
  }

  // 1. Skills overlap (60% weight)
  const normalizedCandidateSkills = candidateSkills.map(normalizeSkill);
  const matchedRequiredSkills = [];
  const missingRequiredSkills = [];

  for (const reqSkill of requiredSkills) {
    const norm = normalizeSkill(reqSkill);
    const hasMatch = normalizedCandidateSkills.some((candSkill) => {
      return candSkill === norm || candSkill.includes(norm) || norm.includes(candSkill);
    });

    if (hasMatch) {
      matchedRequiredSkills.push(reqSkill);
    } else {
      missingRequiredSkills.push(reqSkill);
    }
  }

  const skillsOverlapRatio = requiredSkills.length > 0 ? matchedRequiredSkills.length / requiredSkills.length : 0;
  const skillsScore = Math.round(skillsOverlapRatio * 60);

  // 2. Role similarity (25% weight)
  const candidateHeadline = candidateProfile.headline || candidateProfile.targetRole || '';
  const jobTitle = job.title || '';

  const candKeywords = extractKeywords(candidateHeadline);
  const jobKeywords = extractKeywords(jobTitle);

  let roleScore = 0;
  if (jobKeywords.length > 0 && candKeywords.length > 0) {
    const matchedKeywords = jobKeywords.filter((word) => candKeywords.includes(word));
    const overlapRatio = matchedKeywords.length / jobKeywords.length;
    roleScore = Math.round(overlapRatio * 25);
  } else if (candKeywords.length > 0 && jobKeywords.length === 0) {
    roleScore = 15;
  }

  // 3. Location and work type (15% weight)
  let locationScore = 0;
  const jobWorkMode = (job.workMode || '').toLowerCase();
  const jobCity = (job.city || '').toLowerCase().trim();
  const candCity = (candidateProfile.city || '').toLowerCase().trim();
  const willingRelocate = Boolean(candidateProfile.willingRelocate);

  if (jobWorkMode === 'remote') {
    locationScore = 15;
  } else if (jobCity && candCity && (jobCity === candCity || jobCity.includes(candCity) || candCity.includes(jobCity))) {
    locationScore = 15;
  } else if (willingRelocate) {
    locationScore = 8;
  } else {
    locationScore = 0;
  }

  const totalScore = Math.min(100, Math.max(0, skillsScore + roleScore + locationScore));

  let label = 'Low';
  let badgeColor = 'zinc';
  if (totalScore >= 75) {
    label = 'Strong';
    badgeColor = 'emerald';
  } else if (totalScore >= 50) {
    label = 'Good';
    badgeColor = 'amber';
  }

  return {
    hasScore: true,
    score: totalScore,
    label,
    badgeColor,
    message: `${label} Match (${totalScore}%)`,
    matchedSkills: matchedRequiredSkills,
    missingSkills: missingRequiredSkills,
    breakdown: {
      skillsScore,
      roleScore,
      locationScore,
      skillsOverlapRatio: Math.round(skillsOverlapRatio * 100),
    },
  };
}
