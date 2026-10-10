// AIM stub: keyword extraction behind server-only interface. Real model API plugs in here.
function parseMock(text) {
  const t = String(text || '');
  const skills = [...new Set((t.match(/[A-Za-z][A-Za-z+.#]{2,}/g) || []).slice(0, 12))];
  const exp = (t.match(/(\d+)\s+years?/i) || [])[1] || '';
  return { skills, experienceYears: exp, summary: t.slice(0, 280), headline: skills.slice(0, 3).join(' · '), needsReview: true };
}
module.exports = { parseMock };
