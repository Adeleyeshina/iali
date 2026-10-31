import { Send } from 'lucide-react';

export default function ChatInput({
  messageText,
  setMessageText,
  onSendMessage,
  sending,
  recipientName = 'recipient',
}) {
  return (
    <div className="p-3.5 sm:p-4 bg-white border-t border-slate-200/90 shrink-0">
      <form
        onSubmit={onSendMessage}
        className="flex items-center gap-2 bg-slate-100/90 rounded-2xl p-1.5 border border-slate-200 focus-within:border-indigo-600 focus-within:ring-2 focus-within:ring-indigo-600/15 transition"
      >
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder={`Reply to ${recipientName}… (Press Enter to send)`}
          disabled={sending}
          className="flex-1 px-3 py-2 bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
        />

        <button
          type="submit"
          disabled={sending || !messageText.trim()}
          className="px-4 py-2.5 rounded-xl bg-gradient-brand hover:opacity-95 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-indigo-500/20 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
        >
          <span>{sending ? 'Sending…' : 'Send'}</span>
          <Send className="w-3.5 h-3.5 text-coral-300" />
        </button>
      </form>
    </div>
  );
}
