import { CheckCircle2 } from 'lucide-react';

// Narrative on why legacy hiring in Nigeria failed and how ialihub fixes it
export default function AboutStory() {
  return (
    <section className="py-20 md:py-28 max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-5">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block">
            The Reality of Nigerian Hiring
          </span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl tracking-tight text-slate-950">
            Why Traditional Job Boards Fail in Africa
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            In Nigeria, finding a job or hiring talent has historically been broken. Job seekers submit dozens of resumes into a digital void with no response, wondering if a human ever saw their work.
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            At the same time, verified tech startups and corporate teams across Nigeria receive hundreds of unformatted applications, spending weeks sifting through mismatched resumes instead of interviewing top candidates.
          </p>
          <p className="text-sm text-slate-600 leading-relaxed font-semibold text-slate-900">
            ialihub changes this completely by turning hiring into a transparent, rule-based experience with live status feedback.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-md space-y-4">
          <b className="text-base font-bold text-slate-900 block border-b border-slate-100 pb-3">
            The ialihub Promise
          </b>
          <div className="space-y-3 text-xs text-slate-600">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>You will always see your live application timeline and status history.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>You will see your exact fit score before you spend time applying.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Recruiters who message you are verified companies with real budgets.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>No pay-to-apply tricks. Zero candidate fees forever.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
