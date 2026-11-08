export default function SocialAuthButtons({ role = 'candidate', mode = 'signup' }) {
  const handleOAuth = (provider) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const targetRole = role || 'candidate';
    const targetUrl = `/api/auth/${provider}?role=${encodeURIComponent(targetRole)}&returnUrl=/dashboard&origin=${encodeURIComponent(origin)}`;
    window.location.href = targetUrl;
  };

  const actionText = mode === 'signup' ? 'Sign up' : 'Continue';

  return (
    <div className="space-y-3 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={() => handleOAuth('google')}
          className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50/90 text-slate-700 text-xs sm:text-sm font-semibold transition shadow-xs hover:border-slate-300 active:scale-[0.99] cursor-pointer"
        >
          {/* Official Google G Logo */}
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.04h3.88c2.27-2.09 3.665-5.17 3.665-9.14z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.04c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.26 21.36 7.33 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.28c-.25-.72-.38-1.49-.38-2.28s.13-1.56.38-2.28V6.59H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.41l4.03-3.13z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.59l4.03 3.13c.95-2.83 3.6-4.93 6.72-4.93z"
            />
          </svg>
          <span>{actionText} with Google</span>
        </button>

        {/* LinkedIn OAuth Button */}
        <button
          type="button"
          onClick={() => handleOAuth('linkedin')}
          className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50/90 text-slate-700 text-xs sm:text-sm font-semibold transition shadow-xs hover:border-slate-300 active:scale-[0.99] cursor-pointer"
        >
          {/* Official LinkedIn Logo */}
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="#0A66C2">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.53 1.53 0 0 0 0-3.06 1.53 1.53 0 0 0 0 3.06m1.4 9.74V9.93H5.06v8.57h2.8z" />
          </svg>
          <span>{actionText} with LinkedIn</span>
        </button>
      </div>

      {/* Divider */}
      <div className="relative flex items-center justify-center my-4">
        <div className="border-t border-slate-200 w-full" />
        <span className="bg-white px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 absolute">
          or continue with email
        </span>
      </div>
    </div>
  );
}

