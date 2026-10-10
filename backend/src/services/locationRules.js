// LOC-03/04/05: flag onsite/hybrid outside launch areas, rank flagged lower.
function rankJobs(jobs) {
  return [...jobs].sort((a, b) => Number(a.outsideFlag || false) - Number(b.outsideFlag || false));
}
function locationRules() { return { note: 'implemented inline in app.js isLaunchCity + rankJobs' }; }
module.exports = { rankJobs, locationRules };
