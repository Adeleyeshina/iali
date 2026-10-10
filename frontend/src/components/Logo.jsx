import { Link } from 'react-router-dom';
export default function Logo() {
  return (
    <Link to="/" className="brand" aria-label="Iali home">
      <span className="mark">i</span><span>iali</span>
    </Link>
  );
}
