import prisma from '../db.js';
import { calculateProfileCompleteness } from '../service/completeness.service.js';

// Search candidates with optional completeness filter
export const searchCandidates = async (req, res) => {
  try {
    const { q = '', completeOnly } = req.query;
    const search = q.trim().toLowerCase();
    const filterComplete = completeOnly === 'true' || completeOnly === true;

    const profiles = await prisma.profile.findMany({
      where: { searchable: true },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    const candidates = [];

    for (const profileItem of profiles) {
      if (search) {
        const matchName = profileItem.user?.name?.toLowerCase().includes(search);
        const matchHeadline = profileItem.headline?.toLowerCase().includes(search);
        const matchCity = profileItem.city?.toLowerCase().includes(search);
        const matchSkills = (profileItem.skills || []).some((skillName) =>
          skillName.toLowerCase().includes(search)
        );
        if (!matchName && !matchHeadline && !matchCity && !matchSkills) continue;
      }

      const completeness = calculateProfileCompleteness(profileItem, profileItem.user || {});

      // Filter for 80% and above if completeOnly requested
      if (filterComplete && completeness.score < 80) continue;

      candidates.push({
        userId: profileItem.userId,
        name: profileItem.user?.name || null,
        headline: profileItem.headline || 'Candidate',
        photoUrl: profileItem.photoUrl || null,
        skills: profileItem.skills || [],
        city: profileItem.city || 'Nigeria',
        availability: profileItem.availability || 'Actively looking',
        workModePref: profileItem.workModePref || 'remote',
        willingRelocate: profileItem.willingRelocate || false,
        completeness,
      });
    }

    return res.status(200).json(candidates);
  } catch (error) {
    console.error('[SearchCandidates Error]:', error);
    if (error.code === 'P1001' || error.message?.includes("Can't reach database server")) {
      return res.status(503).json({ error: 'Database connection warming up. Please refresh in a few seconds.' });
    }
    return res.status(500).json({ error: 'Failed to search candidates' });
  }
};

// Start a conversation or send outreach message
export const createConversation = async (req, res) => {
  try {
    const { candidateId, subject } = req.body;
    const recruiterId = req.user.id;

    if (candidateId === recruiterId) {
      return res.status(400).json({ error: 'Cannot message yourself' });
    }

    const conversation = await prisma.conversation.create({
      data: {
        recruiterId,
        candidateId,
        subject,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      conversation,
    });
  } catch (error) {
    console.error('[CreateConversation Error]:', error);
    return res.status(500).json({ error: 'Failed to send message' });
  }
};

// Get all conversations for current user
export const getMyConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [{ recruiterId: userId }, { candidateId: userId }],
      },
      include: {
        recruiter: {
          select: {
            id: true,
            name: true,
            email: true,
            memberships: {
              include: {
                company: { select: { name: true, verificationLevel: true } },
              },
            },
          },
        },
        candidate: {
          select: {
            id: true,
            name: true,
            email: true,
            profile: {
              select: { headline: true, city: true, skills: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json(conversations);
  } catch (error) {
    console.error('[GetMyConversations Error]:', error);
    if (error.code === 'P1001' || error.message?.includes("Can't reach database server")) {
      return res.status(503).json({ error: 'Database connection warming up. Please refresh in a few seconds.' });
    }
    return res.status(500).json({ error: 'Failed to fetch conversations' });
  }
};
