import { Search } from 'lucide-react';

export default function ConversationSidebar({
  conversations = [],
  activeConvId,
  onSelectConv,
  filterQuery,
  setFilterQuery,
  isRecruiter,
}) {
  return (
    <div
      className={`border-r border-slate-200/80 flex flex-col h-full min-h-0 overflow-hidden bg-slate-50/50 ${
        activeConvId ? 'hidden md:flex' : 'flex'
      }`}
    >
      {/* Search conversations header */}
      <div className="p-3.5 border-b border-slate-200/80 bg-white shrink-0">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search messages…"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-100/80 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 transition"
          />
        </div>
      </div>

      {/* Scrollable Conversation Cards */}
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain divide-y divide-slate-100">
        {conversations.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400">
            No matching conversations found
          </div>
        ) : (
          conversations.map((conv) => {
            const isActive = conv.id === activeConvId;
            const party = isRecruiter ? conv.candidate : conv.recruiter;
            const name = isRecruiter
              ? party?.name || party?.email || 'Candidate'
              : party?.memberships?.[0]?.company?.name || party?.name || 'Employer';
            const sub = isRecruiter
              ? party?.profile?.headline || party?.headline || 'Job Seeker'
              : party?.name || 'Recruiter';
            const latestMsg =
              Array.isArray(conv.messages) && conv.messages.length > 0
                ? conv.messages[conv.messages.length - 1].text
                : conv.subject || 'Direct conversation';

            return (
              <button
                key={conv.id}
                type="button"
                onClick={() => onSelectConv(conv.id)}
                className={`w-full text-left p-4 transition-all flex items-start gap-3 cursor-pointer ${
                  isActive
                    ? 'bg-indigo-50/90 border-l-4 border-indigo-600 shadow-2xs'
                    : 'hover:bg-slate-100/60 bg-white'
                }`}
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  {party?.profile?.photoUrl || party?.photoUrl ? (
                    <img
                      src={party?.profile?.photoUrl || party?.photoUrl}
                      alt=""
                      className="w-11 h-11 rounded-full object-cover border border-slate-200 shadow-2xs"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-950 to-indigo-900 text-indigo-100 flex items-center justify-center font-bold text-xs shadow-2xs border border-indigo-800/40">
                      {name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <span className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white absolute bottom-0 right-0" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="text-xs font-bold text-slate-900 truncate">{name}</span>
                    <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                      {new Date(conv.updatedAt || conv.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate mb-1">{sub}</p>
                  <p
                    className={`text-xs truncate ${
                      isActive ? 'text-indigo-950 font-semibold' : 'text-slate-600'
                    }`}
                  >
                    {latestMsg}
                  </p>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
