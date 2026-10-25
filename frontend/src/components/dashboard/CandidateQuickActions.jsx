import { Link } from 'react-router-dom';
import { ClipboardList, Target, MessageSquare, Briefcase, ArrowRight } from 'lucide-react';

// Quick shortcuts to main candidate tools
export default function CandidateQuickActions() {
  const actions = [
    {
      title: 'Track Applications',
      desc: 'View status across review, interview, and offer',
      to: '/applications',
      icon: ClipboardList,
      badge: 'Active',
    },
    {
      title: 'Update Profile & Skills',
      desc: 'Keep tags fresh to increase recruiter discovery',
      to: '/profile',
      icon: Target,
      badge: 'Profile',
    },
    {
      title: 'Recruiter Messages',
      desc: 'Direct chats from verified companies',
      to: '/inbox',
      icon: MessageSquare,
      badge: 'Direct',
    },
    {
      title: 'Browse All Jobs',
      desc: 'Explore active listings with match scores',
      to: '/jobs',
      icon: Briefcase,
      badge: 'Openings',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      {actions.map((act, i) => {
        const Icon = act.icon;
        return (
          <Link
            key={i}
            to={act.to}
            className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between group no-underline"
          >
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50/80 text-indigo-950 group-hover:bg-gradient-to-br group-hover:from-indigo-950 group-hover:to-indigo-800 group-hover:text-white transition-all duration-200 flex items-center justify-center shadow-2xs">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {act.badge}
                </span>
              </div>
              <h3 className="text-xs md:text-sm font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
                {act.title}
              </h3>
              <p className="text-[11px] text-slate-500 leading-snug">{act.desc}</p>
            </div>

            <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-slate-900 group-hover:text-indigo-600">
              <span>Open</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
