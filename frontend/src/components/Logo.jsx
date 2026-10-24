import { Link } from 'react-router-dom';

export default function Logo() {
  return (
    <Link to="/" className="inline-flex items-center gap-2.5 font-extrabold text-xl tracking-tight text-zinc-950 no-underline" aria-label="Iali home">
      <span className="w-8 h-8 rounded-lg bg-zinc-950 text-white flex items-center justify-center font-extrabold text-base shadow-sm">
        i
      </span>
      <span>iali</span>
    </Link>
  );
}
