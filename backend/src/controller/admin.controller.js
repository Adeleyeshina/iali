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
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            memberships: {
              include: { company: true },
            },
          },
        },
      },
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
      const v = await prisma.verification.update({
        where: { id: targetId },
        data: { status: ok ? 'Approved' : 'Rejected' },
        include: {
          user: {
            include: {
              memberships: true,
            },
          },
        },
      });

      // Elevate company to L2 upon CAC approval
      if (ok && v.type?.includes('CAC') && v.user?.memberships?.[0]?.companyId) {
        await prisma.company.update({
          where: { id: v.user.memberships[0].companyId },
          data: { verificationLevel: 'L2' },
        });
      }
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

// Submit verification request: POST /api/admin/verification-request
export const submitVerificationRequest = async (req, res) => {
  try {
    const { type, cacNumber, website, membershipNumber, notes } = req.body;

    const requestType = type === 'CIPM'
      ? `CIPM: ${membershipNumber || 'Member'} ${notes ? `- ${notes}` : ''}`
      : `CAC: ${cacNumber || 'RC-Pending'} | Web: ${website || 'None'} ${notes ? `- ${notes}` : ''}`;

    const verification = await prisma.verification.create({
      data: {
        userId: req.user.id,
        type: requestType,
        status: 'Pending',
      },
    });

    return res.status(201).json({
      ok: true,
      message: 'Verification request submitted for admin review.',
      verification,
    });
  } catch (error) {
    console.error('[SubmitVerification Error]:', error);
    return res.status(500).json({ error: 'Failed to submit verification request' });
  }
};

// Report scam, fake recruiter, or fee request: POST /api/admin/report
export const submitReport = async (req, res) => {
  try {
    const { targetType, targetId, reason, details } = req.body;

    const reportType = `REPORT [${String(targetType || 'job').toUpperCase()}]: ${reason || 'Suspicious activity'} - ${details || ''} (Target: ${targetId || 'N/A'})`;

    const reportEntry = await prisma.verification.create({
      data: {
        userId: req.user.id,
        type: reportType,
        status: 'Pending',
      },
    });

    return res.status(201).json({
      ok: true,
      message: 'Report submitted. Our trust and safety team will review this shortly.',
      report: reportEntry,
    });
  } catch (error) {
    console.error('[SubmitReport Error]:', error);
    return res.status(500).json({ error: 'Failed to submit report' });
  }
};

// Join city waitlist: POST /api/admin/waitlist
export const submitWaitlist = async (req, res) => {
  try {
    const { city, roleInterest } = req.body;
    if (!city) {
      return res.status(400).json({ error: 'City is required for waitlist' });
    }

    // Record waitlist in user's profile if authenticated
    if (req.user?.id) {
      await prisma.profile.upsert({
        where: { userId: req.user.id },
        update: { city },
        create: { userId: req.user.id, city },
      });
    }

    return res.status(200).json({
      ok: true,
      message: `You're on the waitlist for ${city}! We'll notify you as soon as onsite hiring opens here.`,
      city,
    });
  } catch (error) {
    console.error('[SubmitWaitlist Error]:', error);
    return res.status(500).json({ error: 'Failed to join waitlist' });
  }
};
