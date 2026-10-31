// Subdomain detection and navigation helper for app.domain.com vs domain.com
export function isAppSubdomain() {
  if (typeof window === 'undefined') return false;
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
  if (isAppSubdomain()) {
    return cleanPath;
  }
  const { protocol, host, port } = window.location;
  if (host.includes('localhost')) {
    const portPart = port ? `:${port}` : '';
    return `${protocol}//app.localhost${portPart}${cleanPath}`;
  }
  // Production: domain.com -> app.domain.com
  return `${protocol}//app.${host}${cleanPath}`;
}

export function getMainUrl(path = '') {
  if (typeof window === 'undefined') return path;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (!isAppSubdomain()) {
    return cleanPath;
  }
  const { protocol, host, port } = window.location;
  if (host.includes('localhost')) {
    const portPart = port ? `:${port}` : '';
    return `${protocol}//localhost${portPart}${cleanPath}`;
  }
  // Production: app.domain.com -> domain.com
  const mainHost = host.replace(/^app\./, '');
  return `${protocol}//${mainHost}${cleanPath}`;
}
