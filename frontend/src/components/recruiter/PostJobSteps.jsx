// Step indicator for publishing a new job opening in Electric Indigo theme
export default function PostJobSteps({ currentStep }) {
  const steps = [
    { num: 1, label: 'Role Details' },
    { num: 2, label: 'Tech Stack' },
    { num: 3, label: 'Publish' },
  ];

  return (
    <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6 overflow-x-auto">
      {steps.map((st, i) => (
        <div key={st.num} className="flex items-center gap-2 shrink-0">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              currentStep >= st.num
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-400'
            }`}
          >
            {st.num}
          </div>
          <span
            className={`text-xs font-bold ${
              currentStep >= st.num ? 'text-indigo-950' : 'text-slate-400'
            }`}
          >
            {st.label}
          </span>
          {i < steps.length - 1 && (
            <div
              className={`w-6 sm:w-16 h-0.5 mx-1.5 transition-colors ${
                currentStep > st.num ? 'bg-indigo-600' : 'bg-slate-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
