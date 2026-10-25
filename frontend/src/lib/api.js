import {
  DEMO_CANDIDATE_USER,
  DEMO_CANDIDATE_PROFILE,
  DEMO_JOBS,
  DEMO_CANDIDATES,
  DEMO_APPLICATIONS,
} from '../data/demoData.js';

export function token() {
  return localStorage.getItem('iali_token');
}

// Fallback provider for frontend-only deployments or preview demo mode
function handleMockFallback(path, options = {}) {
  const method = (options.method || 'GET').toUpperCase();

  if (path.startsWith('/api/profile')) {
    if (method === 'PUT' && options.body) {
      try {
        const bodyObj = typeof options.body === 'string' ? JSON.parse(options.body) : options.body;
        localStorage.setItem('iali_demo_profile', JSON.stringify(bodyObj));
        return { ...DEMO_CANDIDATE_PROFILE, ...bodyObj };
      } catch {
        return DEMO_CANDIDATE_PROFILE;
      }
    }
    const saved = localStorage.getItem('iali_demo_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEMO_CANDIDATE_PROFILE;
      }
    }
    return DEMO_CANDIDATE_PROFILE;
  }

  if (path.startsWith('/api/jobs')) {
    const jobList = DEMO_JOBS;
    // Check if query is searching for saved or particular city
    return {
      jobs: jobList,
      pagination: { total: jobList.length, page: 1, hasMore: false },
    };
  }

  if (path.startsWith('/api/search/candidates')) {
    return { candidates: DEMO_CANDIDATES, total: DEMO_CANDIDATES.length };
  }

  if (path.startsWith('/api/applications')) {
    return DEMO_APPLICATIONS;
  }

  if (path.startsWith('/api/me')) {
    const savedUser = localStorage.getItem('iali_demo_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        return DEMO_CANDIDATE_USER;
      }
    }
    return DEMO_CANDIDATE_USER;
  }

  if (path.startsWith('/api/recruiter/jobs')) {
    return DEMO_JOBS.slice(0, 3);
  }

  if (path.startsWith('/api/inbox') || path.startsWith('/api/conversations')) {
    return [
      {
        id: 'conv-1',
        name: 'Tunde Bakare · Apex Innovations',
        role: 'recruiter',
        lastMessage: 'Hi Adaeze, we reviewed your Paystack frontend background and want to schedule a brief chat.',
        timestamp: '10:45 AM',
        unread: 1,
      },
    ];
  }

  return {};
}

export async function api(path, options = {}) {
  const authToken = token();
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

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      // If 404 or backend not running, fallback gracefully for demo preview
      if (response.status === 404 || response.status === 502 || response.status === 503) {
        return handleMockFallback(path, options);
      }
      throw new Error(data.error || data.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (err) {
    // If network fails (e.g. frontend deployed standalone without backend API)
    if (
      err.message?.includes('Failed to fetch') ||
      err.message?.includes('NetworkError') ||
      err.message?.includes('Load failed')
    ) {
      return handleMockFallback(path, options);
    }
    throw err;
  }
}
