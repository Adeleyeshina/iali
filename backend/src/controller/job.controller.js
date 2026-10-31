import prisma from '../db.js';
import { calculateMatchScore } from '../service/matchScore.service.js';
import { sendApplicationStatusNotification } from '../service/notification.service.js';

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

    // Optional: Candidate profile for match score calculation
    let candidateProfile = null;
    if (req.user?.id && req.user?.role === 'candidate') {
      candidateProfile = await prisma.profile.findUnique({
        where: { userId: req.user.id },
      });
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

    // Attach match score if candidate profile is available
    const enrichedJobs = jobs.map((job) => {
      const matchScore = candidateProfile ? calculateMatchScore(job, candidateProfile) : null;
      return {
        ...job,
        matchScore,
      };
    });

    const totalPages = Math.ceil(total / limit);
    const hasMore = page < totalPages;

    return res.status(200).json({
      jobs: enrichedJobs,
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

    // Check if authenticated candidate already applied and compute match score
    let hasApplied = false;
    let userApplication = null;
    let matchScore = null;

    if (userId) {
      const [application, candidateProfile] = await Promise.all([
        prisma.application.findFirst({
          where: { jobId: id, candidateId: userId },
          select: { id: true, status: true, rejected: true, createdAt: true },
        }),
        prisma.profile.findUnique({
          where: { userId },
        }),
      ]);

      userApplication = application;
      hasApplied = Boolean(application);

      if (candidateProfile) {
        matchScore = calculateMatchScore(job, candidateProfile);
      }
    }

    return res.status(200).json({
      ...job,
      hasApplied,
      userApplication,
      matchScore,
    });
  } catch (error) {
    console.error('[GetJobById Error]:', error);
    if (error.code === 'P1001' || error.message?.includes("Can't reach database server")) {
      return res.status(503).json({ error: 'Database connection warming up. Please refresh in a few seconds.' });
    }
    return res.status(500).json({ error: 'Failed to fetch job details' });
  }
};

// Post a new job: POST /api/jobs
export const createJob = async (req, res) => {
  try {
    const { title, description, workMode, city, clientName, requiredSkills = [] } = req.body;

    // Find recruiter's company
    const membership = await prisma.membership.findFirst({
      where: { userId: req.user.id },
      include: { company: true },
    });

    let companyId = membership?.companyId;

    if (!companyId) {
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

    // Sanitize and deduplicate required skills tags
    const formattedSkills = Array.isArray(requiredSkills)
      ? Array.from(new Set(requiredSkills.map((s) => String(s).trim()).filter(Boolean)))
      : [];

    const job = await prisma.job.create({
      data: {
        companyId,
        title,
        description,
        workMode,
        city: workMode === 'remote' ? null : city || null,
        outsideFlag: false,
        clientName: clientName || null,
        requiredSkills: formattedSkills,
        status: 'Live',
      },
      include: {
        company: true,
      },
    });

    return res.status(201).json({
      ...job,
      notice: null,
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

// Update a job post: PATCH /api/jobs/:id
export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, workMode, city, clientName, requiredSkills, status } = req.body;

    const existingJob = await prisma.job.findUnique({
      where: { id },
    });

    if (!existingJob) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (req.user.role !== 'admin') {
      const membership = await prisma.membership.findFirst({
        where: { userId: req.user.id },
      });

      if (!membership || membership.companyId !== existingJob.companyId) {
        return res.status(403).json({ error: 'You are not authorized to update this job listing' });
      }
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (workMode !== undefined) {
      updateData.workMode = workMode;
      if (workMode === 'remote') {
        updateData.city = null;
        updateData.outsideFlag = false;
      }
    }
    if (city !== undefined && (workMode ? workMode !== 'remote' : existingJob.workMode !== 'remote')) {
      updateData.city = city || null;
    }
    if (clientName !== undefined) updateData.clientName = clientName || null;
    if (status !== undefined) updateData.status = status;
    if (requiredSkills !== undefined) {
      updateData.requiredSkills = Array.isArray(requiredSkills)
        ? Array.from(new Set(requiredSkills.map((s) => String(s).trim()).filter(Boolean)))
        : [];
    }

    const job = await prisma.job.update({
      where: { id },
      data: updateData,
      include: {
        company: {
          select: { name: true, verificationLevel: true },
        },
        _count: {
          select: { applications: true },
        },
      },
    });

    return res.status(200).json(job);
  } catch (error) {
    console.error('[UpdateJob Error]:', error);
    return res.status(500).json({ error: 'Failed to update job' });
  }
};

// Delete a job post: DELETE /api/jobs/:id
export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    const existingJob = await prisma.job.findUnique({
      where: { id },
    });

    if (!existingJob) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (req.user.role !== 'admin') {
      const membership = await prisma.membership.findFirst({
        where: { userId: req.user.id },
      });

      if (!membership || membership.companyId !== existingJob.companyId) {
        return res.status(403).json({ error: 'You are not authorized to delete this job listing' });
      }
    }

    await prisma.job.delete({
      where: { id },
    });

    return res.status(200).json({ success: true, message: 'Job deleted successfully', id });
  } catch (error) {
    console.error('[DeleteJob Error]:', error);
    return res.status(500).json({ error: 'Failed to delete job' });
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

    if (job.status !== 'Live') {
      return res.status(400).json({ error: 'This job posting is closed and no longer accepting applications' });
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

    const application = await prisma.application.create({
      data: {
        jobId,
        candidateId,
        status: 'Submitted',
      },
    });

    // Create initial timeline entry for application tracker (Feature 1)
    await prisma.applicationStatusHistory.create({
      data: {
        applicationId: application.id,
        status: 'Submitted',
        changedById: candidateId,
        changedByRole: 'candidate',
        note: 'Application submitted by candidate',
      },
    });

    return res.status(201).json({
      ok: true,
      notice: 'Recruiter will review your profile shortly',
      applicationId: application.id,
    });
  } catch (error) {
    console.error('[ApplyToJob Error]:', error);
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
    const { sortBy } = req.query; // 'match' | 'date'

    const membership = await prisma.membership.findFirst({
      where: { userId: req.user.id },
    });

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: { id: true, title: true, companyId: true, requiredSkills: true, workMode: true, city: true },
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
        history: {
          orderBy: { changedAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Feature 3: Calculate match score for each applicant
    let enrichedApplications = applications.map((app) => {
      const candidateProfile = app.candidate?.profile || {};
      const matchScore = calculateMatchScore(job, candidateProfile);

      return {
        ...app,
        matchScore,
      };
    });

    // If recruiter requests sorting by best match:
    if (sortBy === 'match') {
      enrichedApplications.sort((a, b) => {
        const scoreA = a.matchScore?.score ?? -1;
        const scoreB = b.matchScore?.score ?? -1;
        return scoreB - scoreA;
      });
    }

    return res.status(200).json({
      job,
      applications: enrichedApplications,
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
      include: {
        job: {
          include: {
            company: {
              select: { name: true },
            },
          },
        },
        candidate: {
          select: { id: true, email: true, name: true },
        },
      },
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

    const newEffectiveStatus = rejected ? 'Rejected' : (status || application.status);

    // Feature 1: Create application status timeline history
    await prisma.applicationStatusHistory.create({
      data: {
        applicationId,
        status: newEffectiveStatus,
        changedById: req.user.id,
        changedByRole: req.user.role,
        note: `Status updated to ${newEffectiveStatus} by recruiter`,
      },
    });

    // Feature 1: Trigger email notification to candidate
    if (application.candidate?.email) {
      await sendApplicationStatusNotification({
        candidateEmail: application.candidate.email,
        candidateName: application.candidate.name,
        jobTitle: application.job.title,
        companyName: application.job.company?.name,
        oldStatus: application.status,
        newStatus: newEffectiveStatus,
        changedByRole: 'Recruiter',
      });
    }

    return res.status(200).json(updated);
  } catch (error) {
    console.error('[UpdateApplicationStatus Error]:', error);
    return res.status(500).json({ error: 'Failed to update application status' });
  }
};
