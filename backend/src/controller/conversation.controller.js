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

// Start a conversation or send outreach / chat message
export const createConversation = async (req, res) => {
  try {
    const { candidateId, recipientId, recruiterId: bodyRecruiterId, subject, message } = req.body;
    const targetUserId = candidateId || recipientId || bodyRecruiterId;
    const senderId = req.user.id;
    const senderRole = req.user.role;
    const messageText = (message || subject || '').trim();

    if (!targetUserId) {
      return res.status(400).json({ error: 'Recipient is required' });
    }

    if (targetUserId === senderId) {
      return res.status(400).json({ error: 'Cannot message yourself' });
    }

    if (!messageText) {
      return res.status(400).json({ error: 'Message text is required' });
    }

    // Assign recruiterId and candidateId based on roles
    const recruiterId = senderRole === 'recruiter' ? senderId : targetUserId;
    const candidateIdFinal = senderRole === 'candidate' ? senderId : targetUserId;

    const conversation = await prisma.conversation.create({
      data: {
        recruiterId,
        candidateId: candidateIdFinal,
        senderId,
        subject: messageText,
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
              select: { headline: true, city: true, skills: true, photoUrl: true },
            },
          },
        },
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

// Get all conversations grouped by thread for current user
export const getMyConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    const rawMessages = await prisma.conversation.findMany({
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
              select: { headline: true, city: true, skills: true, photoUrl: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    // Group into threads by (recruiterId, candidateId)
    const threadMap = new Map();

    for (const msg of rawMessages) {
      const threadKey = `${msg.recruiterId}_${msg.candidateId}`;
      if (!threadMap.has(threadKey)) {
        threadMap.set(threadKey, {
          id: msg.id,
          threadKey,
          recruiterId: msg.recruiterId,
          candidateId: msg.candidateId,
          recruiter: msg.recruiter,
          candidate: msg.candidate,
          createdAt: msg.createdAt,
          updatedAt: msg.createdAt,
          subject: msg.subject,
          messages: [],
        });
      }

      const thread = threadMap.get(threadKey);
      thread.updatedAt = msg.createdAt;
      thread.subject = msg.subject;
      thread.messages.push({
        id: msg.id,
        senderId: msg.senderId || (msg.recruiterId === userId ? msg.recruiterId : msg.candidateId),
        senderRole: msg.senderId === msg.recruiterId ? 'recruiter' : 'candidate',
        text: msg.subject,
        createdAt: msg.createdAt,
      });
    }

    // Return threads sorted by most recent message
    const threads = Array.from(threadMap.values()).sort(
      (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
    );

    return res.status(200).json(threads);
  } catch (error) {
    console.error('[GetMyConversations Error]:', error);
    if (error.code === 'P1001' || error.message?.includes("Can't reach database server")) {
      return res.status(503).json({ error: 'Database connection warming up. Please refresh in a few seconds.' });
    }
    return res.status(500).json({ error: 'Failed to fetch conversations' });
  }
};
