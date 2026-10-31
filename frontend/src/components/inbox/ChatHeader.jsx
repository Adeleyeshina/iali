import { ArrowLeft, Copy, Flag, ShieldCheck } from 'lucide-react';
import { copyToClipboard } from '../../lib/clipboard.js';

export default function ChatHeader({
  otherParty,
  activeMessages = [],
  onBack,
  onReport,
}) {
  const handleCopyTranscript = () => {
    copyToClipboard(
      activeMessages.map((m) => m.text).join('\n---\n'),
      'Chat transcript copied to clipboard!'
    );
  };

  return (
    <div className="px-5 py-3.5 bg-white border-b border-slate-200/90 flex items-center justify-between gap-3 shadow-2xs shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile Back Button */}
        <button
          type="button"
          onClick={onBack}
          className="md:hidden p-1.5 -ml-1 text-slate-500 hover:text-slate-800 rounded-lg cursor-pointer"
          aria-label="Back to conversations list"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Avatar */}
        <div className="relative shrink-0">
          {otherParty.photoUrl ? (
            <img
              src={otherParty.photoUrl}
              alt=""
              className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-2xs"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-950 to-indigo-900 text-indigo-100 flex items-center justify-center font-bold text-xs shadow-2xs border border-indigo-800/40">
              {(otherParty.name || 'User').slice(0, 2).toUpperCase()}
            </div>
          )}
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white absolute bottom-0 right-0 animate-pulse" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <b className="text-sm font-bold text-slate-900 truncate">{otherParty.name}</b>
            {otherParty.isRecruiter ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>Verified Employer</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-950 border border-indigo-200/60">
                <span>Candidate</span>
              </span>
            )}
          </div>
          <span className="text-[11px] text-slate-500 block truncate">
            {otherParty.headline}
          </span>
        </div>
      </div>

      {/* Chat Top Actions */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={handleCopyTranscript}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          title="Copy full transcript"
        >
          <Copy className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={onReport}
          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
          title="Report conversation"
        >
          <Flag className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
