// Subdomain detection and navigation helper for app.domain.com vs domain.com

// Cloud preview platform domains that DO NOT support multi-level wildcard SSL
// e.g. Netlify wildcard certificate is *.netlify.app, which does NOT cover app.site.netlify.app
const NESTED_SUBDOMAIN_BLOCKED = [
  'netlify.app',
  'vercel.app',
  'pages.dev',
  'github.io',
  'onrender.com',
  'railway.app',
  'fly.dev',
  'render.com',
  'surge.sh',
];

export function canUseSubdomains() {
  if (typeof window === 'undefined') return false;
  const hostname = window.location.hostname.toLowerCase();

  // Localhost development: do not use subdomains
  if (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname.includes('localhost')
  ) {
    return false;
  }

  // Previews or deployment platforms with fixed shared wildcard certificates
  if (NESTED_SUBDOMAIN_BLOCKED.some((d) => hostname.endsWith(d))) {
    return false;
  }

  // Only real custom domains (e.g. iali.ng -> app.iali.ng)
  return true;
}

export function isAppSubdomain() {
  if (typeof window === 'undefined') return false;
  if (!canUseSubdomains()) return false;

  const hostname = window.location.hostname.toLowerCase();
  return (
    hostname.startsWith('app.') ||
    hostname.startsWith('app-') ||
    hostname.startsWith('workspace.')
  );
}

export function getAppUrl(path = '') {
  if (typeof window === 'undefined') return path;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  // If on a deployment platform (Netlify, Vercel), localhost, or already on app subdomain,
  // stay on the same domain with clean path routing!
  if (!canUseSubdomains() || isAppSubdomain()) {
    return cleanPath;
  }

  // Custom production domain: iali.ng -> app.iali.ng
  const { protocol, host } = window.location;
  const hostWithoutApp = host.replace(/^app\./, '');
  return `${protocol}//app.${hostWithoutApp}${cleanPath}`;
}

export function getMainUrl(path = '') {
  if (typeof window === 'undefined') return path;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  if (!canUseSubdomains() || !isAppSubdomain()) {
    return cleanPath;
  }

  // Custom production domain: app.iali.ng -> iali.ng
  const { protocol, host } = window.location;
  const mainHost = host.replace(/^app\./, '');
  return `${protocol}//${mainHost}${cleanPath}`;
}
