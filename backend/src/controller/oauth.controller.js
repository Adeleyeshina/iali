import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import prisma from '../db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const JWT_EXPIRES_IN = '7d';

const getFrontendBaseUrl = (req, stateData = {}) => {
  // 1. If explicit frontend origin was passed in state
  if (stateData.frontendOrigin) {
    return stateData.frontendOrigin.replace(/\/$/, '');
  }
  // 2. Check Referer / Origin header
  const referer = req.headers.referer || req.headers.origin;
  if (referer) {
    try {
      const url = new URL(referer);
      return `${url.protocol}//${url.host}`;
    } catch {
      // fallback
    }
  }
  // 3. Fallback to FRONTEND_URL env var or localhost
  return (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '');
};

const getBackendBaseUrl = (req) => {
  if (process.env.BACKEND_URL) {
    return process.env.BACKEND_URL.replace(/\/$/, '');
  }
  const host = req.get('host') || `localhost:${process.env.PORT || 4000}`;
  const protocol = req.protocol === 'https' || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
  return `${protocol}://${host}`;
};

const setAuthCookies = (res, user, token) => {
  res.cookie('role', user.role, {
    httpOnly: false,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

/**
 * Common handler to process authenticated OAuth profile (Google / LinkedIn)
 */
async function processOAuthUser({ provider, profile, stateData, req, res }) {
  const { id: oauthId, email, name, avatarUrl } = profile;
  const normalizedEmail = email?.toLowerCase().trim();

  if (!normalizedEmail) {
    const frontendUrl = getFrontendBaseUrl(req, stateData);
    return res.redirect(`${frontendUrl}/login?error=${encodeURIComponent('No email associated with this social account.')}`);
  }

  // 1. Check if user already exists by OAuth ID or Email
  const providerIdField = provider === 'google' ? 'googleId' : 'linkedinId';
  let user = await prisma.user.findFirst({
    where: {
      OR: [
        { [providerIdField]: oauthId },
        { email: normalizedEmail },
      ],
    },
    include: {
      profile: true,
      memberships: {
        include: {
          company: true,
        },
      },
    },
  });

  if (user) {
    // Existing user: Link OAuth ID and avatar if not present
    const updateData = {
      isConfirmed: true,
    };
    if (!user[providerIdField]) {
      updateData[providerIdField] = oauthId;
    }
    if (!user.avatarUrl && avatarUrl) {
      updateData.avatarUrl = avatarUrl;
    }
    if (!user.name && name) {
      updateData.name = name;
    }

    user = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
      include: {
        profile: true,
        memberships: {
          include: {
            company: true,
          },
        },
      },
    });

    // If candidate has profile without photoUrl, update it
    if (user.role === 'candidate' && user.profile && !user.profile.photoUrl && avatarUrl) {
      await prisma.profile.update({
        where: { id: user.profile.id },
        data: { photoUrl: avatarUrl },
      }).catch(() => {});
    }
  } else {
    // 2. New user: Role is determined from the signup tab state ('candidate' | 'recruiter')
    const role = stateData.role === 'recruiter' ? 'recruiter' : 'candidate';

    user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        name: name || (provider === 'google' ? 'Google User' : 'LinkedIn Member'),
        role,
        authProvider: provider,
        [providerIdField]: oauthId,
        avatarUrl: avatarUrl || null,
        isConfirmed: true,
      },
    });

    // Create candidate profile
    if (role === 'candidate') {
      await prisma.profile.create({
        data: {
          userId: user.id,
          photoUrl: avatarUrl || null,
          city: 'Nigeria',
          searchable: true,
          availability: 'Actively looking for a job',
        },
      });
    }

    // Create recruiter company and membership
    if (role === 'recruiter') {
      const domain = normalizedEmail.split('@')[1] || 'company.ng';
      const companyBaseName = name ? `${name}'s Organization` : (domain.split('.')[0].toUpperCase() + ' Ltd');

      const company = await prisma.company.create({
        data: {
          name: companyBaseName,
          verificationLevel: 'L2',
        },
      });

      await prisma.membership.create({
        data: {
          userId: user.id,
          companyId: company.id,
          role: 'admin',
          verified: true,
        },
      });
    }
  }

  // 3. Generate JWT
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  setAuthCookies(res, user, token);

  const frontendUrl = getFrontendBaseUrl(req, stateData);
  const destination = stateData.returnUrl || '/dashboard';

  // Redirect to frontend with token parameter for immediate client hydration
  return res.redirect(`${frontendUrl}${destination}${destination.includes('?') ? '&' : '?'}auth_token=${encodeURIComponent(token)}`);
}

// ============================================================================
// GOOGLE OAUTH 2.0
// ============================================================================

export const initiateGoogleAuth = (req, res) => {
  const role = req.query.role === 'recruiter' ? 'recruiter' : 'candidate';
  const returnUrl = req.query.returnUrl || '/dashboard';
  const frontendOrigin = req.query.origin || req.headers.referer || null;

  const stateObj = {
    provider: 'google',
    role,
    returnUrl,
    frontendOrigin,
    nonce: crypto.randomBytes(16).toString('hex'),
  };
  const state = Buffer.from(JSON.stringify(stateObj)).toString('base64url');

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const backendBase = getBackendBaseUrl(req);
  const redirectUri = process.env.GOOGLE_CALLBACK_URL || `${backendBase}/api/auth/google/callback`;

  // Fallback if client ID is not configured (e.g. testing in dev/demo mode)
  if (!clientId || clientId.includes('YOUR_GOOGLE_CLIENT_ID')) {
    // If dev or demo fallback allowed, simulate OAuth callback seamlessly
    if (process.env.NODE_ENV !== 'production' || process.env.ENABLE_MOCK_OAUTH === 'true') {
      return res.redirect(`${backendBase}/api/auth/mock-oauth-callback?provider=google&state=${state}`);
    }
    const frontendUrl = getFrontendBaseUrl(req, stateObj);
    return res.redirect(`${frontendUrl}/login?error=${encodeURIComponent('Google OAuth is not configured yet. Please set GOOGLE_CLIENT_ID in backend .env.')}`);
  }

  const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  googleAuthUrl.searchParams.set('client_id', clientId);
  googleAuthUrl.searchParams.set('redirect_uri', redirectUri);
  googleAuthUrl.searchParams.set('response_type', 'code');
  googleAuthUrl.searchParams.set('scope', 'openid email profile');
  googleAuthUrl.searchParams.set('state', state);
  googleAuthUrl.searchParams.set('prompt', 'select_account');

  return res.redirect(googleAuthUrl.toString());
};

export const handleGoogleCallback = async (req, res) => {
  const { code, state, error } = req.query;

  let stateData = {};
  if (state) {
    try {
      stateData = JSON.parse(Buffer.from(state, 'base64url').toString('utf8'));
    } catch {
      // ignore
    }
  }

  const frontendUrl = getFrontendBaseUrl(req, stateData);

  if (error) {
    return res.redirect(`${frontendUrl}/login?error=${encodeURIComponent(error)}`);
  }

  if (!code) {
    return res.redirect(`${frontendUrl}/login?error=${encodeURIComponent('Authorization code missing from Google callback.')}`);
  }

  try {
    const backendBase = getBackendBaseUrl(req);
    const redirectUri = process.env.GOOGLE_CALLBACK_URL || `${backendBase}/api/auth/google/callback`;

    // 1. Exchange authorization code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      const errBody = await tokenResponse.text();
      console.error('[Google Token Exchange Error]:', errBody);
      return res.redirect(`${frontendUrl}/login?error=${encodeURIComponent('Failed to exchange code with Google.')}`);
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // 2. Fetch userinfo from Google
    const userinfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!userinfoResponse.ok) {
      return res.redirect(`${frontendUrl}/login?error=${encodeURIComponent('Failed to retrieve user info from Google.')}`);
    }

    const googleUser = await userinfoResponse.json();

    return await processOAuthUser({
      provider: 'google',
      profile: {
        id: googleUser.sub,
        email: googleUser.email,
        name: googleUser.name || `${googleUser.given_name || ''} ${googleUser.family_name || ''}`.trim(),
        avatarUrl: googleUser.picture || null,
      },
      stateData,
      req,
      res,
    });
  } catch (err) {
    console.error('[Google OAuth Callback Error]:', err);
    return res.redirect(`${frontendUrl}/login?error=${encodeURIComponent('Google authentication failed.')}`);
  }
};

// ============================================================================
// LINKEDIN OAUTH 2.0 (OpenID Connect)
// ============================================================================

export const initiateLinkedInAuth = (req, res) => {
  const role = req.query.role === 'recruiter' ? 'recruiter' : 'candidate';
  const returnUrl = req.query.returnUrl || '/dashboard';
  const frontendOrigin = req.query.origin || req.headers.referer || null;

  const stateObj = {
    provider: 'linkedin',
    role,
    returnUrl,
    frontendOrigin,
    nonce: crypto.randomBytes(16).toString('hex'),
  };
  const state = Buffer.from(JSON.stringify(stateObj)).toString('base64url');

  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const backendBase = getBackendBaseUrl(req);
  const redirectUri = process.env.LINKEDIN_CALLBACK_URL || `${backendBase}/api/auth/linkedin/callback`;

  // Fallback if client ID is not configured (e.g. testing in dev/demo mode)
  if (!clientId || clientId.includes('YOUR_LINKEDIN_CLIENT_ID')) {
    if (process.env.NODE_ENV !== 'production' || process.env.ENABLE_MOCK_OAUTH === 'true') {
      return res.redirect(`${backendBase}/api/auth/mock-oauth-callback?provider=linkedin&state=${state}`);
    }
    const frontendUrl = getFrontendBaseUrl(req, stateObj);
    return res.redirect(`${frontendUrl}/login?error=${encodeURIComponent('LinkedIn OAuth is not configured yet. Please set LINKEDIN_CLIENT_ID in backend .env.')}`);
  }

  const linkedInAuthUrl = new URL('https://www.linkedin.com/oauth/v2/authorization');
  linkedInAuthUrl.searchParams.set('client_id', clientId);
  linkedInAuthUrl.searchParams.set('redirect_uri', redirectUri);
  linkedInAuthUrl.searchParams.set('response_type', 'code');
  linkedInAuthUrl.searchParams.set('scope', 'openid profile email');
  linkedInAuthUrl.searchParams.set('state', state);

  return res.redirect(linkedInAuthUrl.toString());
};

export const handleLinkedInCallback = async (req, res) => {
  const { code, state, error, error_description } = req.query;

  let stateData = {};
  if (state) {
    try {
      stateData = JSON.parse(Buffer.from(state, 'base64url').toString('utf8'));
    } catch {
      // ignore
    }
  }

  const frontendUrl = getFrontendBaseUrl(req, stateData);

  if (error) {
    return res.redirect(`${frontendUrl}/login?error=${encodeURIComponent(error_description || error)}`);
  }

  if (!code) {
    return res.redirect(`${frontendUrl}/login?error=${encodeURIComponent('Authorization code missing from LinkedIn callback.')}`);
  }

  try {
    const backendBase = getBackendBaseUrl(req);
    const redirectUri = process.env.LINKEDIN_CALLBACK_URL || `${backendBase}/api/auth/linkedin/callback`;

    // 1. Exchange authorization code for token
    const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: process.env.LINKEDIN_CLIENT_ID,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET,
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      const errBody = await tokenResponse.text();
      console.error('[LinkedIn Token Exchange Error]:', errBody);
      return res.redirect(`${frontendUrl}/login?error=${encodeURIComponent('Failed to exchange code with LinkedIn.')}`);
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // 2. Fetch userinfo using OpenID Connect endpoint
    const userinfoResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!userinfoResponse.ok) {
      return res.redirect(`${frontendUrl}/login?error=${encodeURIComponent('Failed to retrieve user profile from LinkedIn.')}`);
    }

    const linkedInUser = await userinfoResponse.json();

    return await processOAuthUser({
      provider: 'linkedin',
      profile: {
        id: linkedInUser.sub,
        email: linkedInUser.email,
        name: linkedInUser.name || `${linkedInUser.given_name || ''} ${linkedInUser.family_name || ''}`.trim(),
        avatarUrl: linkedInUser.picture || null,
      },
      stateData,
      req,
      res,
    });
  } catch (err) {
    console.error('[LinkedIn OAuth Callback Error]:', err);
    return res.redirect(`${frontendUrl}/login?error=${encodeURIComponent('LinkedIn authentication failed.')}`);
  }
};

// ============================================================================
// MOCK / DEMO OAUTH (for zero-config instant dev testing)
// ============================================================================

export const handleMockOAuthCallback = async (req, res) => {
  const { provider = 'google', state } = req.query;

  let stateData = {};
  if (state) {
    try {
      stateData = JSON.parse(Buffer.from(state, 'base64url').toString('utf8'));
    } catch {
      // ignore
    }
  }

  const role = stateData.role === 'recruiter' ? 'recruiter' : 'candidate';
  const mockId = `mock_${provider}_${role}_${Date.now().toString(36)}`;
  const mockName = provider === 'google'
    ? (role === 'recruiter' ? 'Chinedu Okeke (Google Recruiter)' : 'Adaeze Okafor (Google Candidate)')
    : (role === 'recruiter' ? 'Oluwaseun Ade (LinkedIn Recruiter)' : 'Fatima Bello (LinkedIn Candidate)');
  const mockEmail = `${provider}.${role}.${Date.now().toString(36).slice(-4)}@example.org`;

  return await processOAuthUser({
    provider,
    profile: {
      id: mockId,
      email: mockEmail,
      name: mockName,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${mockEmail}`,
    },
    stateData,
    req,
    res,
  });
};
