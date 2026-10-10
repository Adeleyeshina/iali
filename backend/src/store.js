// In-memory store for MVP slice. Swaps to Prisma/Postgres in phase 2 without changing routes.
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const users = []; const profiles = []; const companies = []; const memberships = [];
const jobs = []; const applications = []; const conversations = []; const messages = [];
const verifications = []; const blocks = []; const waitlist = []; const audit = [];
let seq = 1;
const id = (p) => `${p}_${seq++}`;
const JWT = () => process.env.JWT_SECRET || 'change-me-dev-secret';

function createUser({ email, password, role, phone, consentVersion }) {
  const u = { id: id('u'), email: email.toLowerCase(), passwordHash: bcrypt.hashSync(password, 10), role, phone: phone || null, phoneVerified: false, emailVerified: false, confirmToken: Math.random().toString(36).slice(2), consentVersion, consentDate: new Date().toISOString(), status: 'active' };
  users.push(u);
  if (role === 'candidate') profiles.push({ userId: u.id, city: '', area: '', workModePref: 'remote', willingRelocate: false, availability: 'Actively looking', contactPref: 'any', searchable: true, headline: '', skills: [] });
  return u;
}
function findUserByEmail(email) { return users.find((u) => u.email === String(email || '').toLowerCase()); }
function confirmUser(token) { const u = users.find((x) => x.confirmToken === token); if (!u) return null; u.emailVerified = true; u.confirmToken = null; return u; }
function login(email, password) {
  const u = findUserByEmail(email);
  if (!u || !bcrypt.compareSync(password || '', u.passwordHash)) return null;
  if (!u.emailVerified) return null;
  const token = jwt.sign({ id: u.id, role: u.role }, JWT(), { expiresIn: '7d' });
  return { token, role: u.role, id: u.id };
}
function getUser(uid) { return users.find((u) => u.id === uid); }
function verifyPhone(uid) { const u = getUser(uid); if (u) u.phoneVerified = true; }

// companies + memberships
function createCompany(o) { const c = { id: id('c'), verificationLevel: 'L1', status: 'active', verifiedAt: null, ...o }; companies.push(c); return c; }
function getCompany(cid) { return companies.find((c) => c.id === cid); }
function membershipOf(userId) { return memberships.find((m) => m.userId === userId); }

// jobs
function createJob(o) { const j = { id: id('j'), createdAt: new Date().toISOString(), salaryMin: null, salaryMax: null, expLevel: 'mid', ...o }; jobs.push(j); return j; }
function getJob(jid) { return jobs.find((j) => j.id === jid); }
function listJobs({ status }) { return jobs.filter((j) => !status || j.status === status); }
function jobsByCompany(cid) { return jobs.filter((j) => j.companyId === cid); }
function updateJob(jid, patch) { const j = getJob(jid); if (!j) return null; Object.assign(j, patch); return j; }

// profiles
function getProfile(uid) { return profiles.find((p) => p.userId === uid); }
function saveProfile(uid, patch) { let p = getProfile(uid); if (!p) { p = { userId: uid, searchable: true }; profiles.push(p); } Object.assign(p, patch, { lastUpdated: new Date().toISOString() }); return p; }
function searchProfiles({ q, city, workMode, availability }) {
  return profiles.filter((p) => {
    if (p.searchable === false) return false;
    if (city && (p.city || '').toLowerCase() !== city.toLowerCase() && p.workModePref !== 'remote' && workMode !== 'remote') return false;
    if (availability && p.availability !== availability) return false;
    if (q && !`${p.headline} ${(p.skills || []).join(' ')} ${p.city}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });
}

// applications
function apply(jobId, candidateId, coverNote) {
  if (applications.some((a) => a.jobId === jobId && a.candidateId === candidateId)) throw new Error('already applied');
  const a = { id: id('a'), jobId, candidateId, status: 'Submitted', coverNote: coverNote || '', createdAt: new Date().toISOString() };
  applications.push(a); return a;
}
function applicationsByCandidate(cid) { return applications.filter((a) => a.candidateId === cid); }
function applicantsForJob(jid) { return applications.filter((a) => a.jobId === jid); }
function setApplicationStatus(aid, status) { const a = applications.find((x) => x.id === aid); if (!a) return null; a.status = status; return a; }

// messaging with guards (MSG-03/04)
const dailyCount = {};
function startConversation(recruiterId, candidateId, jobId, subject) {
  const p = getProfile(candidateId);
  if (p && p.contactPref === 'nobody') throw new Error('candidate is not contactable');
  const day = new Date().toISOString().slice(0, 10);
  const k = `${recruiterId}:${day}`;
  dailyCount[k] = (dailyCount[k] || 0) + 1;
  const limit = Number(process.env.DAILY_MSG_LIMIT || 20);
  if (dailyCount[k] > limit) throw new Error(`daily limit reached (${limit})`);
  const c = { id: id('cv'), recruiterId, candidateId, jobId: jobId || null, subject, status: 'open', createdAt: new Date().toISOString() };
  conversations.push(c); return c;
}
function myConversations(uid, role) { return conversations.filter((c) => role === 'recruiter' ? c.recruiterId === uid : c.candidateId === uid); }
function sendMessage(convId, senderId, body) {
  const c = conversations.find((x) => x.id === convId);
  if (!c || (c.recruiterId !== senderId && c.candidateId !== senderId)) return null;
  if (blocks.some((b) => b.candidateId === c.candidateId && b.recruiterId === c.recruiterId)) return null;
  const flagged = /(bank|otp|transfer|fee|payment|account number)/i.test(body || '');
  const m = { id: id('m'), convId, senderId, body, flagged, createdAt: new Date().toISOString() };
  messages.push(m); return m;
}
function block(candidateId, recruiterId) { const b = { candidateId, recruiterId }; blocks.push(b); return b; }

// verification / waitlist / admin
function requestVerification(userId, body) { const v = { id: id('v'), userId, ...body, status: 'pending', createdAt: new Date().toISOString() }; verifications.push(v); return v; }
function joinWaitlist(candidateId, city) {
  if (!city) throw new Error('city required');
  if (waitlist.some((w) => w.candidateId === candidateId && w.city.toLowerCase() === city.toLowerCase())) throw new Error('already on waitlist');
  const w = { candidateId, city, createdAt: new Date().toISOString() }; waitlist.push(w); return w;
}
function queues() { return { verifications, jobs: jobs.filter((j) => j.status === 'Pending review'), waitlist }; }
function decide(adminId, { kind, targetId, ok, reason }) {
  if (kind === 'company') { const c = getCompany(targetId); if (c && ok) { c.verificationLevel = 'L2'; c.verifiedAt = new Date().toISOString(); } }
  if (kind === 'job') { const j = getJob(targetId); if (j) j.status = ok ? 'Live' : 'Removed'; }
  audit.push({ adminId, action: `${kind}:${ok ? 'approve' : 'reject'}`, targetId, reason, at: new Date().toISOString() });
  return { ok: true };
}

module.exports = { createUser, findUserByEmail, confirmUser, login, getUser, verifyPhone, createCompany, getCompany, membershipOf, createJob, getJob, listJobs, jobsByCompany, updateJob, getProfile, saveProfile, searchProfiles, apply, applicationsByCandidate, applicantsForJob, setApplicationStatus, startConversation, myConversations, sendMessage, block, requestVerification, joinWaitlist, queues, decide, _all: { users, companies, memberships, jobs, profiles } };
