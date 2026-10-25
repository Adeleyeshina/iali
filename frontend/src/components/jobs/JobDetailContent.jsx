import { Briefcase } from 'lucide-react';

// Main job role description, skills breakdown, and employer details
export default function JobDetailContent({ job }) {
  const company = job.company || {};

  return (
    <div className="space-y-6">
      <div className="bg-white border border-zinc-200 rounded-3xl p-6 md:p-8 shadow-xs space-y-5">
        <h2 className="text-base font-bold text-zinc-900 border-b border-zinc-100 pb-3 flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-zinc-500" />
          <span>Role Description</span>
        </h2>

        <div className="text-sm text-zinc-700 leading-relaxed whitespace-pre-wrap">
          {job.description || 'No description provided.'}
        </div>

        {Array.isArray(job.requiredSkills) && job.requiredSkills.length > 0 && (
          <div className="pt-4 border-t border-zinc-100">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-2.5">
              Required Tech Stack & Skills
            </span>
            <div className="flex flex-wrap gap-1.5">
              {job.requiredSkills.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-zinc-100 text-zinc-800"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {company.description && (
        <div className="bg-white border border-zinc-200 rounded-3xl p-6 md:p-8 shadow-xs space-y-3">
          <h2 className="text-base font-bold text-zinc-900">About {company.name}</h2>
          <p className="text-sm text-zinc-600 leading-relaxed">{company.description}</p>
        </div>
      )}
    </div>
  );
}
