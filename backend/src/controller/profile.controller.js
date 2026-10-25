import prisma from '../db.js';
import { createRequire } from 'module';
import { calculateProfileCompleteness } from '../service/completeness.service.js';
import { calculateMatchScore } from '../service/matchScore.service.js';

const require = createRequire(import.meta.url);
const { PDFParse } = require('pdf-parse');

// Get candidate profile: GET /api/profile
export const getProfile = async (req, res) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: req.user.id },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!profile) {
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: { id: true, name: true, email: true },
      });

      const defaultProfile = {
        userId: req.user.id,
        headline: '',
        summary: '',
        skills: [],
        city: '',
        workModePref: 'remote',
        availability: 'Actively looking',
        contactPref: 'any',
        willingRelocate: false,
        searchable: true,
        experience: [],
        education: [],
        photoUrl: null,
        cvUrl: null,
        cvFileName: null,
      };

      const completeness = calculateProfileCompleteness(defaultProfile, user || {});
      return res.status(200).json({
        ...defaultProfile,
        name: user?.name || '',
        email: user?.email || '',
        completeness,
      });
    }

    const completeness = calculateProfileCompleteness(profile, profile.user || {});

    return res.status(200).json({
      ...profile,
      name: profile.user?.name || '',
      email: profile.user?.email || '',
      completeness,
    });
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
      experience,
      education,
      photoUrl,
      cvUrl,
      cvFileName,
      name,
    } = req.body;

    // Optional user name update
    if (typeof name === 'string') {
      await prisma.user.update({
        where: { id: req.user.id },
        data: { name: name.trim() },
      });
    }

    // Format skills cleanly (ensure unique strings, trim)
    const formattedSkills = Array.isArray(skills)
      ? Array.from(new Set(skills.map((s) => String(s).trim()).filter(Boolean)))
      : [];

    const profileData = {
      headline: headline !== undefined ? headline : undefined,
      summary: summary !== undefined ? summary : undefined,
      skills: formattedSkills,
      city: city !== undefined ? city : undefined,
      workModePref: workModePref !== undefined ? workModePref : 'remote',
      availability: availability !== undefined ? availability : 'Actively looking',
      contactPref: contactPref !== undefined ? contactPref : 'any',
      willingRelocate: Boolean(willingRelocate),
      searchable: searchable !== false,
      experience: experience !== undefined ? experience : undefined,
      education: education !== undefined ? education : undefined,
      photoUrl: photoUrl !== undefined ? photoUrl : undefined,
      cvUrl: cvUrl !== undefined ? cvUrl : undefined,
      cvFileName: cvFileName !== undefined ? cvFileName : undefined,
    };

    const profile = await prisma.profile.upsert({
      where: { userId: req.user.id },
      create: {
        userId: req.user.id,
        ...profileData,
      },
      update: profileData,
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    const completeness = calculateProfileCompleteness(profile, profile.user || {});

    return res.status(200).json({
      ...profile,
      name: profile.user?.name || '',
      email: profile.user?.email || '',
      completeness,
    });
  } catch (error) {
    console.error('[UpdateProfile Error]:', error);
    return res.status(500).json({ error: 'Failed to update profile' });
  }
};

// CV extraction helper: POST /api/profile/parse
export const parseCv = async (req, res) => {
  try {
    const uploadedFile =
      req.file ||
      req.files?.file?.[0] ||
      req.files?.cv?.[0] ||
      req.files?.resume?.[0];

    let text = req.body?.text || '';
    let originalFileName = uploadedFile?.originalname || null;

    if (uploadedFile) {
      const mime = (uploadedFile.mimetype || '').toLowerCase();
      const name = (uploadedFile.originalname || '').toLowerCase();

      if (mime === 'application/pdf' || name.endsWith('.pdf')) {
        try {
          const parser = new PDFParse({ data: uploadedFile.buffer });
          const result = await parser.getText();
          text = result?.text || '';
          await parser.destroy();
        } catch (pdfErr) {
          console.error('[PDF Parse Error]:', pdfErr);
          return res.status(400).json({
            error: 'Could not extract text from this PDF. Please ensure it is not password-protected, or paste the text directly.',
          });
        }
      } else {
        // Plain text, markdown, or other text streams
        text = uploadedFile.buffer.toString('utf-8');
      }
    }

    if (!text || text.trim().length < 10) {
      return res.status(400).json({
        error: 'Please paste your CV text or drop a valid PDF/text resume.',
      });
    }

    const knownSkills = [
      'React', 'JavaScript', 'TypeScript', 'Node.js', 'Express', 'Python', 'Django',
      'HTML', 'CSS', 'Tailwind', 'Next.js', 'Vue', 'Angular', 'PHP', 'Laravel',
      'Java', 'Spring', 'Kotlin', 'Swift', 'Flutter', 'React Native', 'PostgreSQL',
      'MySQL', 'MongoDB', 'SQL', 'GraphQL', 'AWS', 'Docker', 'Kubernetes', 'Git',
      'Figma', 'UI/UX', 'Product Management', 'Sales', 'Customer Support',
      'Digital Marketing', 'Content Writing', 'SEO', 'Data Analysis', 'Excel',
      'Accounting', 'DevOps', 'Mobile Development'
    ];

    const matchedSkills = knownSkills.filter((skill) =>
      new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(text)
    );

    // Extract experience years (e.g. "4 years", "3 yrs", "5+ years")
    const expMatch = text.match(/(\d+)\s*(?:\+?\s*years?|\+?\s*yrs?)/i);
    const experienceYears = expMatch ? parseInt(expMatch[1], 10) : null;

    // Detect Nigerian cities and regions
    const knownCities = [
      'Lagos', 'Abuja', 'Port Harcourt', 'Ibadan', 'Enugu',
      'Kano', 'Benin City', 'Asaba', 'Calabar', 'Owerri',
      'Abeokuta', 'Kaduna', 'Jos', 'Remote',
    ];
    const matchedCity = knownCities.find((city) =>
      new RegExp(`\\b${city}\\b`, 'i').test(text)
    ) || 'Nigeria';

    // Extract potential contact info
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const phoneMatch = text.match(/(?:\+234|0)[789][01]\d{8}/);

    // Headline: find the first descriptive non-empty line
    const nonBlankLines = text
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 2 && !line.startsWith('http') && !line.includes('@'));
    const firstLine = nonBlankLines[0] || '';
    const headline = firstLine.length > 80 ? firstLine.slice(0, 80) + '…' : firstLine;

    const parsed = {
      headline: headline || (matchedSkills.length > 0 ? `${matchedSkills[0]} Professional` : 'Software Professional'),
      summary: text.replace(/\s+/g, ' ').slice(0, 260).trim() + (text.length > 260 ? '…' : ''),
      skills: matchedSkills.length > 0 ? matchedSkills.slice(0, 8) : ['JavaScript', 'React'],
      experienceYears: experienceYears || 2,
      city: matchedCity,
      email: emailMatch ? emailMatch[0] : null,
      phone: phoneMatch ? phoneMatch[0] : null,
      cvFileName: originalFileName || 'Uploaded_Resume.pdf',
      rawText: text.slice(0, 3000),
    };

    return res.status(200).json({ parsed });
  } catch (error) {
    console.error('[ParseCv Error]:', error);
    return res.status(500).json({ error: 'Failed to parse CV' });
  }
};

// Feature 1: Get candidate applications: GET /api/applications/mine
export const getMyApplications = async (req, res) => {
  try {
    const candidateId = req.user.id;

    // Fetch candidate's profile for match score calculation
    const candidateProfile = await prisma.profile.findUnique({
      where: { userId: candidateId },
    });

    // Fetch candidate's active conversations to link directly to chat
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [{ candidateId }, { recruiterId: candidateId }],
      },
      select: {
        id: true,
        recruiterId: true,
        candidateId: true,
      },
    });

    const applications = await prisma.application.findMany({
      where: { candidateId },
      include: {
        job: {
          include: {
            company: {
              select: {
                id: true,
                name: true,
                verificationLevel: true,
                memberships: {
                  select: { userId: true },
                },
              },
            },
          },
        },
        history: {
          orderBy: { changedAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Enrich each application with conversation link and match score
    const enrichedApplications = applications.map((app) => {
      const companyRecruiterIds = (app.job?.company?.memberships || []).map((m) => m.userId);
      
      // Match conversation if candidate chatted with any recruiter of this company
      const matchingConv = conversations.find(
        (c) => companyRecruiterIds.includes(c.recruiterId) || companyRecruiterIds.includes(c.candidateId)
      );

      // Feature 3: Calculate fit match score
      const matchScore = calculateMatchScore(app.job || {}, candidateProfile || {});

      // Synthesize timeline entry if history is empty (backwards compatibility)
      let historyTimeline = app.history || [];
      if (historyTimeline.length === 0) {
        historyTimeline = [
          {
            id: 'init-' + app.id,
            applicationId: app.id,
            status: 'Submitted',
            changedAt: app.createdAt,
            changedByRole: 'candidate',
            note: 'Application submitted',
          },
        ];
        if (app.status !== 'Submitted') {
          historyTimeline.push({
            id: 'current-' + app.id,
            applicationId: app.id,
            status: app.status,
            changedAt: app.updatedAt,
            changedByRole: 'recruiter',
            note: `Status updated to ${app.status}`,
          });
        }
      }

      return {
        ...app,
        conversationId: matchingConv ? matchingConv.id : null,
        matchScore,
        history: historyTimeline,
      };
    });

    return res.status(200).json(enrichedApplications);
  } catch (error) {
    console.error('[GetMyApplications Error]:', error);
    return res.status(500).json({ error: 'Failed to fetch applications' });
  }
};

// Candidate application withdrawal: PATCH /api/applications/:id/withdraw
export const withdrawApplication = async (req, res) => {
  try {
    const { id: applicationId } = req.params;
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
    });

    if (!application || application.candidateId !== req.user.id) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const updated = await prisma.application.update({
      where: { id: applicationId },
      data: { status: 'Withdrawn' },
    });

    // Record timeline history entry
    await prisma.applicationStatusHistory.create({
      data: {
        applicationId,
        status: 'Withdrawn',
        changedById: req.user.id,
        changedByRole: 'candidate',
        note: 'Application withdrawn by candidate',
      },
    });

    return res.status(200).json(updated);
  } catch (error) {
    console.error('[WithdrawApplication Error]:', error);
    return res.status(500).json({ error: 'Failed to withdraw application' });
  }
};
