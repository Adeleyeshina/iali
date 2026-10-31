import { Link } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';

export default function InboxEmptyState({ isRecruiter }) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-xs">
      <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-4">
        <MessageSquare className="w-7 h-7" />
      </div>
      <h2 className="text-lg font-bold text-slate-900 mb-1.5">No conversations yet</h2>
      <p className="text-xs md:text-sm text-slate-500 max-w-md mx-auto mb-6">
        {isRecruiter
          ? 'Find verified candidates through Talent Search and send your first direct outreach message.'
          : 'When employers review your application and invite you for an interview, your messages will appear here.'}
      </p>
      {isRecruiter ? (
        <Link
          to="/search"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-brand text-white text-xs font-bold shadow-md shadow-indigo-500/20"
        >
          <span>Explore Candidate Talent</span>
        </Link>
      ) : (
        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-brand text-white text-xs font-bold shadow-md shadow-indigo-500/20"
        >
          <span>Explore Open Roles</span>
        </Link>
      )}
    </div>
  );
}
