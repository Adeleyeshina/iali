const express = require('express');
const cors = require('cors');
const db = require('./store');
const { authRequired, roleRequired } = require('./middleware/auth');
const { locationRules, rankJobs } = require('./services/locationRules');
const { parseMock } = require('./services/parseMock');

const app = express();
app.use(cors());
app.use(express.json());

// --- launch areas (LOC-01 seed, admin-editable in memory for slice) ---
let launchAreas = [
  { city: 'Lagos', state: 'Lagos', enabled: true, areas: ['Ikeja', 'Lekki', 'Victoria Island', 'Yaba', 'Surulere', 'Ajah', 'Ikorodu'], aliases: { vi: 'Victoria Island' } },
  { city: 'Ibadan', state: 'Oyo', enabled: true, areas: ['Bodija', 'Challenge', 'Ring Road', 'Dugbe'], aliases: {} },
];
const isLaunchCity = (city) => launchAreas.some((l) => l.enabled && l.city.toLowerCase() === String(city || '').toLowerCase());

// auto-seed demo data on first boot (in-memory store: `npm run seed` alone can't persist across processes)
if (db._all.users.length === 0) {
  const admin = db.createUser({ email: 'admin@iali.ng', password: 'Admin123!', role: 'admin', consentVersion: 'v1' });
  db.confirmUser(admin.confirmToken);
  const rec = db.createUser({ email: 'tunde@techstartup.ng', password: 'Recruiter123!', role: 'recruiter', consentVersion: 'v1' });
  db.confirmUser(rec.confirmToken);
  const co = db.createCompany({ name: 'TechStartup Ltd', domain: 'techstartup.ng', cacNumber: 'RC123456', website: 'https://techstartup.ng', verificationLevel: 'L2', verifiedAt: new Date().toISOString() });
  db._all.memberships.push({ userId: rec.id, companyId: co.id, role: 'admin', verified: true });
  const cand = db.createUser({ email: 'adaeze@example.com', password: 'Candidate123!', role: 'candidate', consentVersion: 'v1' });
  db.confirmUser(cand.confirmToken);
  db.saveProfile(cand.id, { headline: 'Frontend developer · React', city: 'Lagos', area: 'Yaba', workModePref: 'hybrid', willingRelocate: false, skills: ['React', 'JavaScript', 'CSS'] });
  db.createJob({ companyId: co.id, title: 'Frontend Developer', description: 'React role in Lagos', workMode: 'onsite', state: 'Lagos', city: 'Lagos', area: 'Yaba', expLevel: 'mid', status: 'Live', outsideFlag: false });
  db.createJob({ companyId: co.id, title: 'Remote Backend Developer', description: 'Node API, nationwide', workMode: 'remote', state: null, city: null, expLevel: 'mid', status: 'Live', outsideFlag: false });
  db.createJob({ companyId: co.id, title: 'Onsite Support Officer', description: 'Enugu onsite — flagged demo', workMode: 'onsite', state: 'Enugu', city: 'Enugu', expLevel: 'junior', status: 'Live', outsideFlag: true });
  console.log('Seeded demo logins: admin@iali.ng / tunde@techstartup.ng / adaeze@example.com');
}

// --- auth (ACC-01..04,07 mock confirm/OTP) ---
const FREE_DOMAINS = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
app.post('/api/auth/signup', (req, res) => {
  const { email, password, role, phone, consentVersion } = req.body || {};
  if (!email || !password || !role) return res.status(400).json({ error: 'email, password, role required' });
  if (!['candidate', 'recruiter'].includes(role)) return res.status(400).json({ error: 'invalid role' });
  if (db.findUserByEmail(email)) return res.status(409).json({ error: 'email taken' });
  const user = db.createUser({ email, password, role, phone, consentVersion: consentVersion || 'v1' });
  // dev confirm token (email link simulation)
  console.log(`[mail] confirm ${email}: token ${user.confirmToken}`);
  res.json({ id: user.id, email: user.email, confirmToken: user.confirmToken });
});
app.post('/api/auth/confirm', (req, res) => {
  const u = db.confirmUser(req.body?.token);
  if (!u) return res.status(400).json({ error: 'bad token' });
  res.json({ ok: true });
});
app.post('/api/auth/login', (req, res) => {
  const token = db.login(req.body?.email, req.body?.password);
  if (!token) return res.status(401).json({ error: 'bad credentials or unconfirmed email' });
  res.json(token);
});
app.post('/api/auth/otp/send', (req, res) => {
  console.log(`[sms] OTP for ${req.body?.phone || req.body?.email}: 123456 (dev accepts any 6-digit)`);
  res.json({ ok: true });
});
app.post('/api/auth/otp/verify', authRequired, (req, res) => {
  if (!/^\d{6}$/.test(String(req.body?.code || ''))) return res.status(400).json({ error: '6-digit code required' });
  db.verifyPhone(req.user.id);
  res.json({ ok: true });
});
app.get('/api/me', authRequired, (req, res) => {
  const u = db.getUser(req.user.id);
  res.json({ ...u, passwordHash: undefined, confirmToken: undefined });
});

// --- jobs (JOB + LOC-03/04/05) ---
app.get('/api/jobs', (req, res) => {
  const { city, workMode, q, exp } = req.query;
  let jobs = db.listJobs({ status: 'Live' }).map((j) => ({ ...j, company: db.getCompany(j.companyId) }));
  if (workMode) jobs = jobs.filter((j) => j.workMode === workMode);
  if (city) jobs = jobs.filter((j) => (j.city || '').toLowerCase() === String(city).toLowerCase() || j.workMode === 'remote');
  if (exp) jobs = jobs.filter((j) => j.expLevel === exp);
  if (q) jobs = jobs.filter((j) => `${j.title} ${j.description}`.toLowerCase().includes(String(q).toLowerCase()));
  res.json(rankJobs(jobs));
});
app.get('/api/jobs/:id', (req, res) => {
  const j = db.getJob(req.params.id);
  if (!j) return res.status(404).json({ error: 'not found' });
  res.json({ ...j, company: db.getCompany(j.companyId) });
});
app.post('/api/jobs', authRequired, roleRequired('recruiter'), (req, res) => {
  const m = db.membershipOf(req.user.id);
  if (!m) return res.status(400).json({ error: 'join a company first' });
  const { title, description, workMode, state, city, area, expLevel, clientName } = req.body || {};
  if (!title || !description || !workMode) return res.status(400).json({ error: 'title, description, workMode required' });
  if (['onsite', 'hybrid'].includes(workMode) && !city) return res.status(400).json({ error: 'city required for onsite/hybrid (dropdown, no free text)' });
  const outsideFlag = ['onsite', 'hybrid'].includes(workMode) && city ? !isLaunchCity(city) : false;
  const companyJobs = db.jobsByCompany(m.companyId);
  const status = companyJobs.length === 0 ? 'Pending review' : 'Live'; // JOB-05 first job review
  const job = db.createJob({ companyId: m.companyId, title, description, workMode, state, city: workMode === 'remote' ? null : city, area, expLevel, clientName, status, outsideFlag });
  res.status(201).json({ ...job, notice: outsideFlag ? 'We are currently focused on Lagos and Ibadan. Your job will be visible, but there may be fewer matching candidates in this city. Switch to remote to reach people nationwide.' : null });
});
app.patch('/api/jobs/:id/to-remote', authRequired, roleRequired('recruiter'), (req, res) => {
  const j = db.updateJob(req.params.id, { workMode: 'remote', city: null, outsideFlag: false });
  if (!j) return res.status(404).json({ error: 'not found' });
  res.json(j);
});
app.patch('/api/jobs/:id/status', authRequired, roleRequired('recruiter'), (req, res) => {
  const j = db.updateJob(req.params.id, { status: req.body.status });
  if (!j) return res.status(404).json({ error: 'not found' });
  res.json(j);
});

// --- profiles + CV mock parse (CAN + AIM stub) ---
app.get('/api/profile', authRequired, (req, res) => res.json(db.getProfile(req.user.id) || null));
app.put('/api/profile', authRequired, (req, res) => res.json(db.saveProfile(req.user.id, req.body || {})));
app.post('/api/profile/parse', authRequired, (req, res) => {
  const { fileName, text } = req.body || {};
  if (!text) return res.status(400).json({ error: 'paste CV text or upload (upload route in full slice)' });
  res.json({ fileName: fileName || 'cv.txt', reviewFirst: true, parsed: parseMock(text) });
});

// --- applications (APP) ---
app.post('/api/jobs/:id/apply', authRequired, roleRequired('candidate'), (req, res) => {
  try {
    const a = db.apply(req.params.id, req.user.id, req.body?.coverNote);
    const job = db.getJob(req.params.id);
    let notice = null;
    const p = db.getProfile(req.user.id);
    if (job && job.workMode !== 'remote' && p && p.city && job.city && p.city.toLowerCase() !== job.city.toLowerCase() && !p.willingRelocate) {
      notice = `Heads up: this ${job.workMode} role is in ${job.city}, your profile says ${p.city}.`;
    }
    res.status(201).json({ ...a, notice });
  } catch (e) { res.status(409).json({ error: e.message }); }
});
app.get('/api/applications/mine', authRequired, (req, res) => res.json(db.applicationsByCandidate(req.user.id)));
app.get('/api/jobs/:id/applicants', authRequired, roleRequired('recruiter'), (req, res) => res.json(db.applicantsForJob(req.params.id)));
app.patch('/api/applications/:id', authRequired, roleRequired('recruiter'), (req, res) => {
  const a = db.setApplicationStatus(req.params.id, req.body.status);
  if (!a) return res.status(404).json({ error: 'not found' });
  console.log(`[mail] application ${a.id} -> ${a.status}`);
  res.json(a);
});

// --- search (SRC, verified only, no contact details) ---
app.get('/api/search/candidates', authRequired, roleRequired('recruiter'), (req, res) => {
  const m = db.membershipOf(req.user.id);
  const co = m && db.getCompany(m.companyId);
  if (!co || co.verificationLevel !== 'L2') return res.status(403).json({ error: 'verification required: company must be Level 2 Verified' });
  const { q, city, workMode, availability } = req.query;
  let out = db.searchProfiles({ q, city, workMode, availability });
  res.json(out.map((p) => ({ ...p, email: undefined, phone: undefined })));
});

// --- messaging (MSG guards) ---
app.post('/api/conversations', authRequired, roleRequired('recruiter'), (req, res) => {
  const m = db.membershipOf(req.user.id);
  const co = m && db.getCompany(m.companyId);
  if (!co || co.verificationLevel !== 'L2') return res.status(403).json({ error: 'only verified recruiters can message' });
  const { candidateId, jobId, subject } = req.body || {};
  if (!candidateId || !subject) return res.status(400).json({ error: 'candidateId + subject (role + company) required' });
  try {
    const c = db.startConversation(req.user.id, candidateId, jobId, subject);
    console.log(`[mail] new message for candidate ${candidateId} (unsubscribe: /settings)`);
    res.status(201).json(c);
  } catch (e) { res.status(429).json({ error: e.message }); }
});
app.get('/api/conversations/mine', authRequired, (req, res) => res.json(db.myConversations(req.user.id, req.user.role)));
app.post('/api/conversations/:id/messages', authRequired, (req, res) => {
  const msg = db.sendMessage(req.params.id, req.user.id, req.body?.body);
  if (!msg) return res.status(400).json({ error: 'cannot send (blocked / no access)' });
  if (msg.flagged) console.log('[moderation] message held for scam-pattern review');
  res.status(201).json(msg);
});
app.post('/api/block', authRequired, roleRequired('candidate'), (req, res) => {
  res.json(db.block(req.user.id, req.body.recruiterId));
});

// --- verification + location + admin stub ---
app.post('/api/verification/request', authRequired, (req, res) => res.status(201).json(db.requestVerification(req.user.id, req.body)));
app.get('/api/launch-areas', (req, res) => res.json(launchAreas));
app.post('/api/waitlist', authRequired, (req, res) => {
  try { res.status(201).json(db.joinWaitlist(req.user.id, req.body.city)); }
  catch (e) { res.status(409).json({ error: e.message }); }
});
app.get('/api/admin/queues', authRequired, roleRequired('admin'), (req, res) => res.json(db.queues()));
app.post('/api/admin/decide', authRequired, roleRequired('admin'), (req, res) => res.json(db.decide(req.user.id, req.body)));

app.get('/api/health', (req, res) => res.json({ ok: true }));
module.exports = app;
