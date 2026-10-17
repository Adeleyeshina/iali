import prisma from '../db.js';

// Get admin trust centre queues: GET /api/admin/queues
export const getQueues = async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      where: {
        OR: [
          { status: 'Pending Review' },
          { outsideFlag: true },
        ],
      },
      include: {
        company: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const verifications = await prisma.verification.findMany({
      where: { status: 'Pending' },
      orderBy: { createdAt: 'desc' },
    });

    // Aggregate demand by city
    const profiles = await prisma.profile.findMany({
      select: { city: true },
    });

    const waitlist = {};
    for (const profile of profiles) {
      if (profile.city) {
        waitlist[profile.city] = (waitlist[profile.city] || 0) + 1;
      }
    }

    return res.status(200).json({
      jobs,
      verifications,
      waitlist,
    });
  } catch (error) {
    console.error('[GetQueues Error]:', error);
    return res.status(500).json({ error: 'Failed to fetch admin queues' });
  }
};

// Handle admin queue review decisions: POST /api/admin/decide
export const decideQueue = async (req, res) => {
  try {
    const { kind, targetId, ok } = req.body;

    if (kind === 'job') {
      if (ok) {
        await prisma.job.update({
          where: { id: targetId },
          data: { status: 'Live', outsideFlag: false },
        });
      } else {
        await prisma.job.delete({
          where: { id: targetId },
        });
      }
    } else if (kind === 'verification') {
      await prisma.verification.update({
        where: { id: targetId },
        data: { status: ok ? 'Approved' : 'Rejected' },
      });
    }

    return res.status(200).json({
      ok: true,
      message: `Decision applied (${ok ? 'Approved' : 'Removed'})`,
    });
  } catch (error) {
    console.error('[DecideQueue Error]:', error);
    return res.status(500).json({ error: 'Failed to process decision' });
  }
};
