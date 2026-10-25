import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

// Categorized FAQ accordion component
export default function FaqSection() {
  const [activeTab, setActiveTab] = useState('general');
  const [expandedIndex, setExpandedIndex] = useState(0);

  const FAQ_DATA = {
    general: [
      {
        q: 'What is ialihub and how does it help me?',
        a: 'ialihub is Nigeria’s premier rule-based hiring marketplace. It connects verified candidates with trusted employers through transparent 60/25/15 match scores, live application status tracking, and 0-100% profile completeness meters.',
      },
      {
        q: 'Is ialihub completely free for job seekers?',
        a: 'Yes, 100% free! Candidates never pay any fees to register, optimize their profile, view match scores, apply to jobs, or message recruiters.',
      },
      {
        q: 'How does ialihub prevent fake jobs and scam recruiters?',
        a: 'Every employer is verified by our admin team before their job postings and candidate outreach tools are activated. We enforce strict company domain and identity verification.',
      },
    ],
    candidates: [
      {
        q: 'How does the Match Score work?',
        a: 'Our rule-based engine evaluates three transparent factors: 60% skills overlap between your skills tags and job requirements, 25% role title similarity, and 15% location fit. You know your exact odds before applying!',
      },
      {
        q: 'How does Application Progress Tracking work?',
        a: 'Whenever a recruiter reviews your application, shortlists you, schedules an interview, or issues an offer, your timeline updates live and you receive immediate email notifications.',
      },
      {
        q: 'Why should I aim for 80%+ Profile Completeness?',
        a: 'Verified employers can filter talent search to "Complete profiles only (80%+)". Completing your skills, experience, education, bio, and photo ensures you get prioritized for top roles.',
      },
    ],
    employers: [
      {
        q: 'How do I post a job and search talent as an employer?',
        a: 'Create a free recruiter account, submit your company details for verification, and start posting jobs. You can search verified candidates and filter by 80%+ completeness immediately.',
      },
      {
        q: 'Can I sort job applicants by best match?',
        a: 'Yes! ialihub automatically computes the fit match score for every applicant and lets you sort by best match with one click.',
      },
    ],
  };

  return (
    <section className="py-20 bg-white border-t border-zinc-200/80">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-2">
            Got Questions?
          </span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl tracking-tight text-zinc-950 mb-2">
            Simple Answers to Power Your Career
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600">
            Everything you need to know about using ialihub as a candidate or employer.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center gap-2 mb-8">
          {[
            { key: 'general', label: 'General' },
            { key: 'candidates', label: 'For Candidates' },
            { key: 'employers', label: 'For Employers' },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => {
                setActiveTab(tab.key);
                setExpandedIndex(0);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === tab.key
                  ? 'bg-indigo-950 text-white shadow-xs'
                  : 'bg-zinc-100 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/70'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Accordion List */}
        <div className="max-w-3xl mx-auto space-y-3">
          {FAQ_DATA[activeTab].map((item, idx) => {
            const isOpen = expandedIndex === idx;
            return (
              <div
                key={item.q}
                className="rounded-2xl border border-zinc-200/80 overflow-hidden transition-all bg-[#FAF9F6]"
              >
                <button
                  type="button"
                  onClick={() => setExpandedIndex(isOpen ? -1 : idx)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-zinc-100/50 transition"
                >
                  <b className="text-xs sm:text-sm font-bold text-zinc-900">{item.q}</b>
                  <ChevronDown
                    className={`w-4 h-4 text-zinc-500 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-indigo-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-zinc-600 leading-relaxed border-t border-zinc-200/40 bg-white">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
