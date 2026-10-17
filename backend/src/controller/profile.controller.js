import prisma from '../db.js';

// Get candidate profile: GET /api/profile
export const getProfile = async (req, res) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: req.user.id },
    });

    if (!profile) {
      return res.status(200).json({
        headline: '',
        skills: [],
        city: '',
        workModePref: 'remote',
        availability: 'Actively looking',
        contactPref: 'any',
        willingRelocate: false,
        searchable: true,
      });
    }

    return res.status(200).json(profile);
  } catch (error) {
    console.error('[GetProfile Error]:', error);
    return res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

// Update candidate profile: PUT /api/profile
export const updateProfile = async (req, res) => {
  try {
    const {
      headline,
      summary,
      skills = [],
      city,
      workModePref,
      availability,
      contactPref,
      willingRelocate,
      searchable,
    } = req.body;

    const profile = await prisma.profile.upsert({
      where: { userId: req.user.id },
      create: {
        userId: req.user.id,
        headline,
        summary,
        skills,
        city,
        workModePref,
        availability,
        contactPref,
        willingRelocate: Boolean(willingRelocate),
        searchable: searchable !== false,
      },
      update: {
        headline,
        summary,
        skills,
        city,
        workModePref,
        availability,
        contactPref,
        willingRelocate: Boolean(willingRelocate),
        searchable: searchable !== false,
      },
    });

    return res.status(200).json(profile);
  } catch (error) {
    console.error('[UpdateProfile Error]:', error);
    return res.status(500).json({ error: 'Failed to update profile' });
  }
};

// CV extraction helper: POST /api/profile/parse
export const parseCv = async (req, res) => {
  try {
    const { text = '' } = req.body;

    const knownSkills = [
      'React', 'JavaScript', 'TypeScript', 'Node.js', 'Express', 'Python', 'Django',
      'HTML', 'CSS', 'PostgreSQL', 'MySQL', 'MongoDB', 'AWS', 'Docker', 'Git',
      'Figma', 'UI/UX', 'Product Management', 'Sales', 'Customer Support',
    ];

    const matchedSkills = knownSkills.filter((skill) =>
      new RegExp(`\\b${skill}\\b`, 'i').test(text)
    );

    // Extract experience years (e.g. "4 years", "3 yrs")
    const expMatch = text.match(/(\d+)\s*(?:years?|yrs?)/i);
    const experienceYears = expMatch ? parseInt(expMatch[1], 10) : null;

    // Use first line as headline
    const firstLine = text.split('\n').map((line) => line.trim()).filter(Boolean)[0] || '';
    const headline = firstLine.length > 80 ? firstLine.slice(0, 80) + '…' : firstLine;

    const parsed = {
      headline: headline || 'Software Professional',
      summary: text.slice(0, 240) + (text.length > 240 ? '…' : ''),
      skills: matchedSkills.length > 0 ? matchedSkills : ['JavaScript', 'React'],
      experienceYears: experienceYears || 3,
    };

    return res.status(200).json({ parsed });
  } catch (error) {
    console.error('[ParseCv Error]:', error);
    return res.status(500).json({ error: 'Failed to parse CV' });
  }
};

// Get candidate applications: GET /api/applications/mine
export const getMyApplications = async (req, res) => {
  try {
    const applications = await prisma.application.findMany({
      where: { candidateId: req.user.id },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json(applications);
  } catch (error) {
    console.error('[GetMyApplications Error]:', error);
    return res.status(500).json({ error: 'Failed to fetch applications' });
  }
};
