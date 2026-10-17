import prisma from '../db.js';

// Search candidates: GET /api/search/candidates
export const searchCandidates = async (req, res) => {
  try {
    const { q = '' } = req.query;
    const search = q.trim().toLowerCase();

    const profiles = await prisma.profile.findMany({
      where: {
        searchable: true,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    // Match candidate headline, city or skills
    const filteredProfiles = profiles.filter((profileItem) => {
      if (!search) return true;
      const matchHeadline = profileItem.headline?.toLowerCase().includes(search);
      const matchCity = profileItem.city?.toLowerCase().includes(search);
      const matchSkills = (profileItem.skills || []).some((skillName) =>
        skillName.toLowerCase().includes(search)
      );
      return matchHeadline || matchCity || matchSkills;
    });

    const candidates = filteredProfiles.map((profileItem) => ({
      userId: profileItem.userId,
      headline: profileItem.headline || 'Candidate',
      skills: profileItem.skills || [],
      city: profileItem.city || 'Nigeria',
      availability: profileItem.availability || 'Actively looking',
      workModePref: profileItem.workModePref || 'remote',
      willingRelocate: profileItem.willingRelocate || false,
    }));

    return res.status(200).json(candidates);
  } catch (error) {
    console.error('[SearchCandidates Error]:', error);
    return res.status(500).json({ error: 'Failed to search candidates' });
  }
};

// Start a conversation or send outreach message: POST /api/conversations
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
