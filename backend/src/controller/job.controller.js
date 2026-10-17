import prisma from '../db.js';

const LAUNCH_CITIES = ['lagos', 'ibadan'];

// Get all matching jobs with pagination: GET /api/jobs
export const getJobs = async (req, res) => {
  try {
    const { city, workMode, q } = req.query;
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const skip = (page - 1) * limit;

    const where = {
      status: 'Live',
    };

    if (workMode) {
      where.workMode = workMode;
    }

    if (city) {
      where.city = { contains: city, mode: 'insensitive' };
    }

    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { company: { name: { contains: q, mode: 'insensitive' } } },
      ];
    }

    const [total, jobs] = await Promise.all([
      prisma.job.count({ where }),
      prisma.job.findMany({
        where,
        skip,
        take: limit,
        include: {
          company: {
            select: {
              id: true,
              name: true,
              verificationLevel: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);
    const hasMore = page < totalPages;

    return res.status(200).json({
      jobs,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore,
      },
    });
  } catch (error) {
    console.error('[GetJobs Error]:', error);
    return res.status(500).json({ error: 'Failed to fetch jobs' });
  }
};

// Get job by ID: GET /api/jobs/:id
export const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            verificationLevel: true,
          },
        },
      },
    });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    return res.status(200).json(job);
  } catch (error) {
    console.error('[GetJobById Error]:', error);
    return res.status(500).json({ error: 'Failed to fetch job details' });
  }
};

// Post a new job: POST /api/jobs
export const createJob = async (req, res) => {
  try {
    const { title, description, workMode, city, clientName } = req.body;

    // Find recruiter's company
    const membership = await prisma.membership.findFirst({
      where: { userId: req.user.id },
      include: { company: true },
    });

    let companyId = membership?.companyId;

    if (!companyId) {
      // Create a default company for the recruiter if not linked
      const company = await prisma.company.create({
        data: {
          name: 'TechStartup Ltd',
          verificationLevel: 'L2',
        },
      });
      await prisma.membership.create({
        data: {
          userId: req.user.id,
          companyId: company.id,
          role: 'admin',
        },
      });
      companyId = company.id;
    }

    // Check launch area rules
    const isLaunchArea = city ? LAUNCH_CITIES.includes(city.toLowerCase().trim()) : false;
    const outsideFlag = workMode !== 'remote' && !isLaunchArea;
    const notice = outsideFlag
      ? 'Outside launch area (Lagos & Ibadan only for MVP) — fewer local matches.'
      : null;

    const job = await prisma.job.create({
      data: {
        companyId,
        title,
        description,
        workMode,
        city: workMode === 'remote' ? null : city || null,
        outsideFlag,
        clientName: clientName || null,
        status: 'Live',
      },
      include: {
        company: true,
      },
    });

    return res.status(201).json({
      ...job,
      notice,
    });
  } catch (error) {
    console.error('[CreateJob Error]:', error);
    return res.status(500).json({ error: 'Failed to create job' });
  }
};

// Switch job to remote: PATCH /api/jobs/:id/to-remote
export const switchJobToRemote = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await prisma.job.update({
      where: { id },
      data: {
        workMode: 'remote',
        city: null,
        outsideFlag: false,
      },
      include: {
        company: true,
      },
    });

    return res.status(200).json(job);
  } catch (error) {
    console.error('[SwitchJobToRemote Error]:', error);
    return res.status(500).json({ error: 'Failed to update job' });
  }
};

// Apply to a job: POST /api/jobs/:id/apply
export const applyToJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const candidateId = req.user.id;

    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const existingApp = await prisma.application.findUnique({
      where: {
        jobId_candidateId: {
          jobId,
          candidateId,
        },
      },
    });

    if (existingApp) {
      return res.status(409).json({ error: 'You have already applied to this job' });
    }

    await prisma.application.create({
      data: {
        jobId,
        candidateId,
        status: 'Submitted',
      },
    });

    return res.status(201).json({
      ok: true,
      notice: 'Recruiter will review your profile shortly',
    });
  } catch (error) {
    console.error('[ApplyToJob Error]:', error);
    return res.status(500).json({ error: 'Failed to submit application' });
  }
};
