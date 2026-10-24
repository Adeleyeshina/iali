import prisma from '../db.js';

const LAUNCH_CITIES = ['lagos', 'ibadan'];

// Get all matching jobs with pagination: GET /api/jobs
export const getJobs = async (req, res) => {
  try {
    const { city, workMode, q, ids } = req.query;
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const skip = (page - 1) * limit;

    const where = {
      status: 'Live',
    };

    if (ids) {
      const idList = ids.split(',').map((id) => id.trim()).filter(Boolean);
      if (idList.length > 0) {
        where.id = { in: idList };
      }
    }

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
    // Graceful Neon PostgreSQL cold start / connection recovery
    if (error.code === 'P1001' || error.message?.includes("Can't reach database server")) {
      return res.status(503).json({ error: 'Database service is warming up. Please retry shortly.' });
    }
    return res.status(500).json({ error: 'Failed to fetch jobs' });
  }
};

// Get job by ID: GET /api/jobs/:id
export const getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

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

    // Check if authenticated candidate already applied
    let hasApplied = false;
    let userApplication = null;

    if (userId) {
      userApplication = await prisma.application.findFirst({
        where: { jobId: id, candidateId: userId },
        select: { id: true, status: true, rejected: true, createdAt: true },
      });
      hasApplied = Boolean(userApplication);
    }

    return res.status(200).json({
      ...job,
      hasApplied,
      userApplication,
    });
  } catch (error) {
    console.error('[GetJobById Error]:', error);
    // Graceful Neon PostgreSQL cold start / connection recovery
    if (error.code === 'P1001' || error.message?.includes("Can't reach database server")) {
      return res.status(503).json({ error: 'Database connection warming up. Please refresh in a few seconds.' });
    }
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

    const existingApp = await prisma.application.findFirst({
      where: {
        jobId,
        candidateId,
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
    // Graceful Neon PostgreSQL cold start / connection recovery
    if (error.code === 'P1001' || error.message?.includes("Can't reach database server")) {
      return res.status(503).json({ error: 'Database connection warming up. Please refresh in a few seconds.' });
    }
    return res.status(500).json({ error: error.message || 'Failed to submit application' });
  }
};

// Get all jobs posted by the recruiter's company: GET /api/jobs/recruiter/mine
export const getRecruiterJobs = async (req, res) => {
  try {
    const membership = await prisma.membership.findFirst({
      where: { userId: req.user.id },
    });

    if (!membership) {
      return res.status(200).json([]);
    }

    const jobs = await prisma.job.findMany({
      where: { companyId: membership.companyId },
      include: {
        company: {
          select: { name: true, verificationLevel: true },
        },
        _count: {
          select: { applications: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json(jobs);
  } catch (error) {
    console.error('[GetRecruiterJobs Error]:', error);
    return res.status(500).json({ error: 'Failed to fetch recruiter jobs' });
  }
};

// Get applicants for a specific job: GET /api/jobs/:id/applications
export const getJobApplications = async (req, res) => {
  try {
    const { id: jobId } = req.params;

    const membership = await prisma.membership.findFirst({
      where: { userId: req.user.id },
    });

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: { id: true, title: true, companyId: true },
    });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (req.user.role !== 'admin' && job.companyId !== membership?.companyId) {
      return res.status(403).json({ error: 'Access denied to this job applications' });
    }

    const applications = await prisma.application.findMany({
      where: { jobId },
      include: {
        candidate: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            profile: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({
      job,
      applications,
    });
  } catch (error) {
    console.error('[GetJobApplications Error]:', error);
    return res.status(500).json({ error: 'Failed to fetch applications' });
  }
};

// Update application review status: PATCH /api/jobs/applications/:id/status
export const updateApplicationStatus = async (req, res) => {
  try {
    const { id: applicationId } = req.params;
    const { status, rejected } = req.body;

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { job: true },
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const membership = await prisma.membership.findFirst({
      where: { userId: req.user.id },
    });

    if (req.user.role !== 'admin' && application.job.companyId !== membership?.companyId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const dataToUpdate = {};
    if (status) dataToUpdate.status = status;
    if (typeof rejected === 'boolean') dataToUpdate.rejected = rejected;

    const updated = await prisma.application.update({
      where: { id: applicationId },
      data: dataToUpdate,
    });

    return res.status(200).json(updated);
  } catch (error) {
    console.error('[UpdateApplicationStatus Error]:', error);
    return res.status(500).json({ error: 'Failed to update application status' });
  }
};
