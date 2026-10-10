const db = require('./store');
function run() {
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
  console.log('Seed done. Logins: admin@iali.ng / tunde@techstartup.ng / adaeze@example.com');
}
run();
