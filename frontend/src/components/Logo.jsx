import { Link } from 'react-router-dom';

// ialihub brand logo in Electric Indigo & Warm Coral
export default function Logo({ size = 'md', to = '/' }) {
  const heightClass =
    size === 'lg'
      ? 'h-12 md:h-14'
      : size === 'sm'
      ? 'h-8 md:h-9'
      : 'h-10 md:h-11';

  return (
    <Link
      to={to}
      className="inline-flex items-center no-underline group py-1 shrink-0"
      aria-label="ialihub home"
    >
      <img
        src="/ialihub-logo.svg"
        alt="ialihub"
        className={`${heightClass} w-auto object-contain transition-transform duration-200 group-hover:scale-105`}
      />
    </Link>
  );
}
