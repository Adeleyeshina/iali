import { useState, useRef, useEffect } from 'react';
import { X, Plus, Sparkles } from 'lucide-react';
import { SUGGESTED_SKILLS } from '../data/skills.js';

export default function SkillTagInput({
  skills = [],
  onChange,
  placeholder = 'Type a skill and press Enter...',
  maxSkills = 30,
  label = 'Skills',
  hint = 'Select from suggestions or type any custom skill.',
}) {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const trimmed = inputValue.trim();
  const lowerInput = trimmed.toLowerCase();

  const matchingSuggestions = lowerInput
    ? SUGGESTED_SKILLS.filter(
        (s) =>
          s.toLowerCase().includes(lowerInput) &&
          !skills.some((existing) => existing.toLowerCase() === s.toLowerCase())
      ).slice(0, 8)
    : SUGGESTED_SKILLS.filter(
        (s) => !skills.some((existing) => existing.toLowerCase() === s.toLowerCase())
      ).slice(0, 6);

  const isExactSuggestion = SUGGESTED_SKILLS.some(
    (s) => s.toLowerCase() === lowerInput
  );
  const alreadyAdded = skills.some(
    (s) => s.toLowerCase() === lowerInput
  );

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addSkill = (skillToAdd) => {
    const clean = skillToAdd.trim();
    if (!clean) return;
    if (skills.some((s) => s.toLowerCase() === clean.toLowerCase())) {
      setInputValue('');
      return;
    }
    if (skills.length >= maxSkills) return;
    onChange([...skills, clean]);
    setInputValue('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const removeSkill = (indexToRemove) => {
    onChange(skills.filter((_, idx) => idx !== indexToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (trimmed) {
        addSkill(trimmed);
      }
    } else if (e.key === 'Backspace' && !inputValue && skills.length > 0) {
      removeSkill(skills.length - 1);
    }
  };

  return (
    <div className="space-y-1.5" ref={containerRef}>
      {label && (
        <div className="flex justify-between items-center">
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700">
            {label}
          </label>
          <span className="text-[11px] text-zinc-400 font-medium">
            {skills.length} / {maxSkills} tags
          </span>
        </div>
      )}

      <div
        className="min-h-[46px] p-2 bg-white rounded-xl border border-slate-200 focus-within:border-indigo-600 focus-within:ring-2 focus-within:ring-indigo-600/15 transition flex flex-wrap items-center gap-1.5 cursor-text relative shadow-2xs"
        onClick={() => inputRef.current?.focus()}
      >
        {skills.map((skill, index) => (
          <span
            key={skill + index}
            className="inline-flex items-center gap-1 pl-2 sm:pl-2.5 pr-1.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50/80 text-indigo-950 border border-indigo-100 group max-w-full"
          >
            <span className="truncate">{skill}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeSkill(index);
              }}
              className="w-4 h-4 rounded hover:bg-indigo-100 text-slate-400 hover:text-indigo-900 inline-flex items-center justify-center transition cursor-pointer shrink-0"
              aria-label={`Remove ${skill}`}
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}

        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={skills.length === 0 ? placeholder : 'Add another tag…'}
          className="flex-1 min-w-[100px] text-sm text-zinc-900 bg-transparent placeholder-zinc-400 focus:outline-none py-1"
        />

        {isOpen && (trimmed || matchingSuggestions.length > 0) && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-zinc-200 rounded-xl shadow-lg z-50 overflow-hidden py-1 max-h-60 overflow-y-auto">
            {trimmed && !alreadyAdded && (
              <button
                type="button"
                className="w-full text-left px-3.5 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50/50 hover:bg-emerald-100/70 transition flex items-center justify-between cursor-pointer border-b border-zinc-100"
                onClick={() => addSkill(trimmed)}
              >
                <span className="flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 text-emerald-600" />
                  <span>
                    Add custom skill: <b className="text-zinc-900">"{trimmed}"</b>
                  </span>
                </span>
                <span className="text-[10px] uppercase font-bold text-emerald-600 bg-white px-2 py-0.5 rounded border border-emerald-200">
                  Custom
                </span>
              </button>
            )}

            {matchingSuggestions.length > 0 && (
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Suggested skills</span>
              </div>
            )}

            {matchingSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                className="w-full text-left px-3.5 py-1.5 text-xs text-zinc-800 hover:bg-zinc-100 transition flex items-center justify-between cursor-pointer"
                onClick={() => addSkill(suggestion)}
              >
                <span>{suggestion}</span>
                <span className="text-[10px] text-zinc-400 font-medium">Click or press Enter</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {hint && <p className="text-[11px] text-zinc-500 m-0">{hint}</p>}
    </div>
  );
}
