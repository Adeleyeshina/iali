import {
  DEMO_CANDIDATE_USER,
  DEMO_RECRUITER_USER,
  DEMO_ADMIN_USER,
  DEMO_CANDIDATE_PROFILE,
  INITIAL_DEMO_JOBS,
  DEMO_CANDIDATES,
  INITIAL_DEMO_APPLICATIONS,
  INITIAL_DEMO_JOB_APPLICANTS,
  INITIAL_DEMO_CONVERSATIONS,
  DEMO_ADMIN_QUEUES,
} from '../data/demoData.js';

export function token() {
  return localStorage.getItem('iali_token');
}

// Helper to access persistent demo state in localStorage
function getStoredJson(key, defaultVal) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultVal;
    const parsed = JSON.parse(raw);
    if (Array.isArray(defaultVal) && !Array.isArray(parsed)) {
      return defaultVal;
    }
    return parsed;
  } catch {
    return defaultVal;
  }
}

function setStoredJson(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

// Fallback provider for frontend-only deployments or preview demo mode
function handleMockFallback(path, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const [urlPath, queryString] = path.split('?');
  const params = new URLSearchParams(queryString || '');

  // 1. Current User / Authentication (/api/me)
  if (urlPath === '/api/me' || urlPath === '/api/auth/me') {
    const savedUser = getStoredJson('iali_demo_user', null);
    if (savedUser) return savedUser;
    return DEMO_CANDIDATE_USER;
  }

  // 2. Candidate Profile (/api/profile)
  if (urlPath === '/api/profile') {
    if (method === 'PUT' && options.body) {
      try {
        const bodyObj = typeof options.body === 'string' ? JSON.parse(options.body) : options.body;
        const currentProfile = getStoredJson('iali_demo_profile', DEMO_CANDIDATE_PROFILE);
        const updated = { ...currentProfile, ...bodyObj };
        setStoredJson('iali_demo_profile', updated);
        return updated;
      } catch {
        return DEMO_CANDIDATE_PROFILE;
      }
    }
    return getStoredJson('iali_demo_profile', DEMO_CANDIDATE_PROFILE);
  }

  // 3. Recruiter Specific Jobs (/api/jobs/recruiter/mine or /api/recruiter/jobs)
  if (urlPath === '/api/jobs/recruiter/mine' || urlPath === '/api/recruiter/jobs') {
    const jobs = getStoredJson('iali_demo_jobs', INITIAL_DEMO_JOBS);
    return jobs;
  }

  // 4. Job Applicants Review (/api/jobs/:id/applications)
  const jobApplicantsMatch = urlPath.match(/^\/api\/jobs\/([^/]+)\/applications$/);
  if (jobApplicantsMatch) {
    const jobId = jobApplicantsMatch[1];
    const jobs = getStoredJson('iali_demo_jobs', INITIAL_DEMO_JOBS);
    const job = jobs.find((j) => j.id === jobId) || jobs[0];
    const allApplicants = getStoredJson('iali_demo_job_applicants', INITIAL_DEMO_JOB_APPLICANTS);
    const applications = allApplicants[jobId] || INITIAL_DEMO_JOB_APPLICANTS['62506cc5-bb43-4149-8f9a-c7c21916a8f8'] || [];
    return { job, applications };
  }

  // 5. Update Applicant Status (/api/jobs/applications/:id/status)
  const updateStatusMatch = urlPath.match(/^\/api\/jobs\/applications\/([^/]+)\/status$/);
  if (updateStatusMatch && method === 'PATCH') {
    const appId = updateStatusMatch[1];
    const bodyObj = typeof options.body === 'string' ? JSON.parse(options.body || '{}') : options.body || {};
    const allApplicants = getStoredJson('iali_demo_job_applicants', INITIAL_DEMO_JOB_APPLICANTS);
    for (const jId in allApplicants) {
      allApplicants[jId] = allApplicants[jId].map((app) => {
        if (app.id === appId) {
          return {
            ...app,
            status: bodyObj.status || app.status,
            rejected: bodyObj.rejected !== undefined ? bodyObj.rejected : app.rejected,
            updatedAt: new Date().toISOString(),
          };
        }
        return app;
      });
    }
    setStoredJson('iali_demo_job_applicants', allApplicants);
    return { success: true, message: 'Status updated' };
  }

  // 6. Switch Job to Remote (/api/jobs/:id/to-remote)
  const toRemoteMatch = urlPath.match(/^\/api\/jobs\/([^/]+)\/to-remote$/);
  if (toRemoteMatch && method === 'PATCH') {
    const jobId = toRemoteMatch[1];
    const jobs = getStoredJson('iali_demo_jobs', INITIAL_DEMO_JOBS);
    const updatedJobs = jobs.map((j) => (j.id === jobId ? { ...j, workMode: 'remote', city: null, outsideFlag: false } : j));
    setStoredJson('iali_demo_jobs', updatedJobs);
    return updatedJobs.find((j) => j.id === jobId);
  }

  // 7. Candidate Apply to Job (/api/jobs/:id/apply)
  const applyMatch = urlPath.match(/^\/api\/jobs\/([^/]+)\/apply$/);
  if (applyMatch && method === 'POST') {
    const jobId = applyMatch[1];
    const jobs = getStoredJson('iali_demo_jobs', INITIAL_DEMO_JOBS);
    const job = jobs.find((j) => j.id === jobId) || { id: jobId, title: 'Engineer', company: { name: 'TechLagos Innovations' } };
    
    // Add application to candidate's list
    const myApps = getStoredJson('iali_demo_applications', INITIAL_DEMO_APPLICATIONS);
    const existing = myApps.find((a) => a.jobId === jobId);
    if (existing) {
      return { success: true, alreadyApplied: true, application: existing };
    }

    const newApp = {
      id: 'app-' + Date.now(),
      jobId,
      status: 'Submitted',
      rejected: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      job: {
        id: job.id,
        title: job.title,
        company: job.company || { name: 'Verified Employer' },
        city: job.city,
        workMode: job.workMode,
        salary: job.salary,
      },
      matchScore: { score: 92, label: 'Strong Fit', level: 'high' },
    };
    setStoredJson('iali_demo_applications', [newApp, ...myApps]);

    // Also register on job applicants for recruiter view
    const allApplicants = getStoredJson('iali_demo_job_applicants', INITIAL_DEMO_JOB_APPLICANTS);
    const currentApplicants = allApplicants[jobId] || [];
    allApplicants[jobId] = [
      {
        id: newApp.id,
        jobId,
        candidateId: 'cand_1792935650559',
        status: 'Submitted',
        rejected: false,
        createdAt: newApp.createdAt,
        candidate: {
          id: 'cand_1792935650559',
          name: 'Adaeze Okonkwo',
          email: 'adaeze@example.com',
          profile: getStoredJson('iali_demo_profile', DEMO_CANDIDATE_PROFILE),
        },
        matchScore: newApp.matchScore,
      },
      ...currentApplicants,
    ];
    setStoredJson('iali_demo_job_applicants', allApplicants);

    return { success: true, application: newApp, notice: 'Application received by hiring team' };
  }

  // 8. Single Job Details (/api/jobs/:id)
  const singleJobMatch = urlPath.match(/^\/api\/jobs\/([^/]+)$/);
  if (singleJobMatch && !['recruiter'].includes(singleJobMatch[1])) {
    const jobId = singleJobMatch[1];
    const jobs = getStoredJson('iali_demo_jobs', INITIAL_DEMO_JOBS);
    const foundJob = jobs.find((j) => j.id === jobId) || jobs[0];

    const myApps = getStoredJson('iali_demo_applications', INITIAL_DEMO_APPLICATIONS);
    const applied = myApps.find((a) => a.jobId === jobId);

    return {
      ...foundJob,
      hasApplied: Boolean(applied),
      userApplication: applied || null,
    };
  }

  // 9. Post a New Job (/api/jobs POST)
  if (urlPath === '/api/jobs' && method === 'POST') {
    const bodyObj = typeof options.body === 'string' ? JSON.parse(options.body || '{}') : options.body || {};
    const jobs = getStoredJson('iali_demo_jobs', INITIAL_DEMO_JOBS);
    const newJob = {
      id: 'job-' + Date.now(),
      title: bodyObj.title || 'Software Engineer',
      companyId: 'comp-techlagos',
      company: {
        id: 'comp-techlagos',
        name: 'TechLagos Innovations',
        verificationLevel: 'L2',
      },
      city: bodyObj.workMode === 'remote' ? null : bodyObj.city || 'Lagos',
      workMode: bodyObj.workMode || 'hybrid',
      salary: bodyObj.salary || 'Competitive / Negotiable',
      type: 'Full-time',
      status: 'Live',
      outsideFlag: false,
      requiredSkills: Array.isArray(bodyObj.requiredSkills) ? bodyObj.requiredSkills : ['React', 'TypeScript'],
      tags: Array.isArray(bodyObj.requiredSkills) ? bodyObj.requiredSkills : ['React', 'TypeScript'],
      description: bodyObj.description || 'Exciting engineering role at TechLagos Innovations.',
      createdAt: new Date().toISOString(),
      _count: { applications: 0 },
    };
    setStoredJson('iali_demo_jobs', [newJob, ...jobs]);
    return newJob;
  }

  // 10. Public Jobs List with Filters (/api/jobs)
  if (urlPath === '/api/jobs') {
    let jobs = getStoredJson('iali_demo_jobs', INITIAL_DEMO_JOBS);
    const q = (params.get('q') || '').toLowerCase().trim();
    const city = (params.get('city') || '').toLowerCase().trim();
    const workMode = (params.get('workMode') || '').toLowerCase().trim();

    if (q) {
      jobs = jobs.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          (j.description && j.description.toLowerCase().includes(q)) ||
          (j.company?.name && j.company.name.toLowerCase().includes(q)) ||
          (j.tags && j.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }
    if (city) {
      jobs = jobs.filter((j) => (j.city || '').toLowerCase() === city);
    }
    if (workMode) {
      jobs = jobs.filter((j) => (j.workMode || '').toLowerCase() === workMode);
    }

    return {
      jobs,
      pagination: { total: jobs.length, page: 1, hasMore: false },
    };
  }

  // 11. Recruiter Talent Search (/api/search/candidates)
  if (urlPath === '/api/search/candidates') {
    const q = (params.get('q') || '').toLowerCase().trim();
    let list = DEMO_CANDIDATES;
    if (q) {
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.headline.toLowerCase().includes(q) ||
          (c.skills && c.skills.some((s) => s.toLowerCase().includes(q)))
      );
    }
    return { candidates: list, total: list.length };
  }

  // 12. Candidate Applications Tracker (/api/applications/mine or /api/applications)
  if (urlPath === '/api/applications/mine' || urlPath === '/api/applications') {
    return getStoredJson('iali_demo_applications', INITIAL_DEMO_APPLICATIONS);
  }

  // 13. Withdraw Application (/api/applications/:id/withdraw)
  const withdrawMatch = urlPath.match(/^\/api\/applications\/([^/]+)\/withdraw$/);
  if (withdrawMatch && method === 'PATCH') {
    const appId = withdrawMatch[1];
    const myApps = getStoredJson('iali_demo_applications', INITIAL_DEMO_APPLICATIONS);
    const updated = myApps.map((a) => (a.id === appId ? { ...a, status: 'Withdrawn', updatedAt: new Date().toISOString() } : a));
    setStoredJson('iali_demo_applications', updated);
    return { success: true, message: 'Application withdrawn' };
  }

  // 14. Direct Messaging & Conversations (/api/conversations)
  if (urlPath === '/api/conversations' || urlPath === '/api/conversations/mine' || urlPath === '/api/inbox') {
    if (method === 'POST') {
      const bodyObj = typeof options.body === 'string' ? JSON.parse(options.body || '{}') : options.body || {};
      const convos = getStoredJson('iali_demo_conversations', INITIAL_DEMO_CONVERSATIONS);
      const currentUser = getStoredJson('iali_demo_user', DEMO_CANDIDATE_USER);
      const isCandidate = currentUser.role === 'candidate';

      const targetId = bodyObj.candidateId || bodyObj.recipientId || bodyObj.recruiterId;
      const conversationId = bodyObj.conversationId;
      const messageText = (bodyObj.message || bodyObj.subject || '').trim();

      // Case A: Reply to existing conversation by ID
      if (conversationId) {
        let matched = false;
        const updatedConvos = convos.map((conv) => {
          if (conv.id === conversationId) {
            matched = true;
            const newMsg = {
              id: 'msg-' + Date.now(),
              senderId: currentUser.id,
              senderRole: currentUser.role,
              text: messageText,
              createdAt: new Date().toISOString(),
            };
            const currentMsgs = Array.isArray(conv.messages) ? conv.messages : [];
            return {
              ...conv,
              messages: [...currentMsgs, newMsg],
              updatedAt: new Date().toISOString(),
            };
          }
          return conv;
        });

        if (matched) {
          setStoredJson('iali_demo_conversations', updatedConvos);
          return updatedConvos.find((c) => c.id === conversationId);
        }
      }

      // Case B: Search if existing conversation with target user
      const existingConv = convos.find(
        (c) => c.candidateId === targetId || c.recruiterId === targetId
      );

      if (existingConv) {
        const newMsg = {
          id: 'msg-' + Date.now(),
          senderId: currentUser.id,
          senderRole: currentUser.role,
          text: messageText,
          createdAt: new Date().toISOString(),
        };
        const currentMsgs = Array.isArray(existingConv.messages) ? existingConv.messages : [];
        const updated = {
          ...existingConv,
          messages: [...currentMsgs, newMsg],
          updatedAt: new Date().toISOString(),
        };
        const updatedList = convos.map((c) => (c.id === existingConv.id ? updated : c));
        setStoredJson('iali_demo_conversations', updatedList);
        return updated;
      }

      // Case C: Start new thread
      const targetCandidate = DEMO_CANDIDATES.find((c) => c.id === targetId || c.userId === targetId) || {
        name: isCandidate ? currentUser.name : (bodyObj.candidateName || 'Candidate'),
        email: 'candidate@example.com',
        headline: 'Job Seeker',
      };

      const newConv = {
        id: 'conv-' + Date.now(),
        recruiterId: isCandidate ? 'recruiter_1792935650559' : currentUser.id,
        candidateId: isCandidate ? currentUser.id : targetId,
        subject: messageText.slice(0, 60),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        candidate: {
          id: isCandidate ? currentUser.id : targetId,
          name: isCandidate ? currentUser.name : targetCandidate.name,
          email: isCandidate ? currentUser.email : (targetCandidate.email || 'candidate@example.com'),
          headline: targetCandidate.headline || 'Candidate',
          photoUrl: targetCandidate.photoUrl || null,
        },
        recruiter: {
          id: isCandidate ? 'recruiter_1792935650559' : currentUser.id,
          name: isCandidate ? 'Tunde Bakare' : (currentUser.name || 'Tunde Bakare'),
          email: isCandidate ? 'tunde@techlagos.ng' : currentUser.email,
          companyName: isCandidate ? 'TechLagos Innovations' : (currentUser.companyName || 'TechLagos Innovations'),
          memberships: [
            {
              company: {
                name: isCandidate ? 'TechLagos Innovations' : (currentUser.companyName || 'TechLagos Innovations'),
                verificationLevel: 'L2',
              },
            },
          ],
        },
        messages: [
          {
            id: 'msg-' + Date.now(),
            senderId: currentUser.id,
            senderRole: currentUser.role,
            text: messageText,
            createdAt: new Date().toISOString(),
          },
        ],
      };
      setStoredJson('iali_demo_conversations', [newConv, ...convos]);
      return newConv;
    }
    return getStoredJson('iali_demo_conversations', INITIAL_DEMO_CONVERSATIONS);
  }

  // 15. Admin Trust Centre Queues (/api/admin/queues)
  if (urlPath === '/api/admin/queues') {
    return DEMO_ADMIN_QUEUES;
  }

  // 16. Admin Decide (/api/admin/decide)
  if (urlPath === '/api/admin/decide' && method === 'POST') {
    return { success: true, message: 'Decision applied by admin' };
  }

  // 17. Verification Request (/api/verifications/request or /api/admin/verification-request)
  if (urlPath.includes('/verification')) {
    return { success: true, message: 'Verification request submitted for review' };
  }

  // 18. City Waitlist (/api/waitlist)
  if (urlPath === '/api/waitlist') {
    return { success: true, message: 'Added to launch waitlist' };
  }

  return {};
}

export async function api(path, options = {}) {
  const authToken = token();

  // If in demo preview mode, serve immediately from interactive mock engine
  if (authToken === 'demo-token') {
    return handleMockFallback(path, options);
  }

  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;

  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(path, {
      ...options,
      headers,
      body: isFormData
        ? options.body
        : options.body !== undefined
        ? JSON.stringify(options.body)
        : undefined,
    });

    const contentType = response.headers.get('content-type') || '';

    // If server returned HTML (e.g. SPA index.html fallback for unmatched /api routes)
    if (contentType.includes('text/html')) {
      return handleMockFallback(path, options);
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      // If 404, 502, 503 or backend not responding, fallback gracefully for demo preview
      if (
        response.status === 404 ||
        response.status === 502 ||
        response.status === 503 ||
        response.status === 401 ||
        response.status === 403
      ) {
        return handleMockFallback(path, options);
      }
      throw new Error(data.error || data.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (err) {
    // If network fails (e.g. standalone demo or backend not running)
    if (
      err.message?.includes('Failed to fetch') ||
      err.message?.includes('NetworkError') ||
      err.message?.includes('Load failed') ||
      err.message?.includes('status 404')
    ) {
      return handleMockFallback(path, options);
    }
    throw err;
  }
}
