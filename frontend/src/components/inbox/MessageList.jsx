import { CheckCheck } from 'lucide-react';

export default function MessageList({
  activeMessages = [],
  otherParty,
  currentUserId,
  isRecruiter,
  containerRef,
}) {
  return (
    <div
      ref={containerRef}
      className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-4"
    >
      {/* Channel banner pill */}
      <div className="flex justify-center">
        <span className="px-3 py-1 rounded-full bg-slate-200/80 text-[10px] font-bold uppercase tracking-wider text-slate-600 shadow-2xs">
          Direct Outreach Channel · End-to-End Logged
        </span>
      </div>

      {activeMessages.length === 0 && (
        <div className="py-12 text-center text-xs text-slate-400">
          No messages yet. Send your first message below!
        </div>
      )}

      {activeMessages.map((msg) => {
        const isSender =
          msg.senderId === currentUserId ||
          (isRecruiter && msg.senderRole === 'recruiter') ||
          (!isRecruiter && msg.senderRole === 'candidate');

        return (
          <div
            key={msg.id}
            className={`flex flex-col ${isSender ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-end gap-2 max-w-[85%] sm:max-w-[75%]">
              {!isSender && (
                <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0 mb-1">
                  {(otherParty.name || 'User').slice(0, 2).toUpperCase()}
                </div>
              )}

              <div
                className={`p-4 rounded-2xl shadow-xs transition-all text-sm leading-relaxed whitespace-pre-line ${
                  isSender
                    ? 'bg-gradient-brand text-white rounded-tr-xs shadow-md shadow-indigo-500/15'
                    : 'bg-white border border-slate-200/90 text-slate-900 rounded-tl-xs'
                }`}
              >
                {msg.text}

                {/* Message metadata / timestamp */}
                <div
                  className={`flex items-center gap-1 text-[10px] mt-1.5 font-medium ${
                    isSender ? 'text-indigo-200 justify-end' : 'text-slate-400 justify-start'
                  }`}
                >
                  <span>
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  {isSender && <CheckCheck className="w-3.5 h-3.5 text-coral-300" />}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
