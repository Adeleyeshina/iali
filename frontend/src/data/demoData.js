export const DEMO_CANDIDATE_USER = {
  id: 'demo-cand-01',
  name: 'Adaeze Okonkwo',
  email: 'adaeze@ialihub.com',
  role: 'candidate',
  isDemo: true,
};

export const DEMO_RECRUITER_USER = {
  id: 'demo-rec-01',
  name: 'Tunde Bakare',
  email: 'tunde@apexfintech.ng',
  role: 'recruiter',
  companyName: 'Apex Innovations',
  isDemo: true,
};

export const DEMO_ADMIN_USER = {
  id: 'demo-admin-01',
  name: 'Admin Manager',
  email: 'admin@ialihub.com',
  role: 'admin',
  isDemo: true,
};

export const DEMO_CANDIDATE_PROFILE = {
  name: 'Adaeze Okonkwo',
  headline: 'Senior Frontend Engineer · React & TypeScript',
  city: 'Lagos',
  workModePref: 'hybrid',
  skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Node.js', 'Redux', 'GraphQL'],
  experience: [
    {
      title: 'Senior Frontend Engineer',
      company: 'Paystack',
      period: '2022 - Present',
      description: 'Led checkout redesign and high-conversion payment flow components across 5 African markets.',
    },
    {
      title: 'Frontend Developer',
      company: 'Interswitch Group',
      period: '2020 - 2022',
      description: 'Built merchant settlement portals and real-time transaction monitoring dashboards.',
    },
  ],
  education: [
    {
      school: 'University of Lagos (UNILAG)',
      degree: 'B.Sc Computer Science (First Class)',
      year: '2020',
    },
  ],
  cvFileName: 'Adaeze_Okonkwo_Resume_2026.pdf',
  summary:
    'Senior Frontend Engineer with 5+ years creating scalable, responsive fintech web products. Passionate about design systems, accessible UI, and sub-second load times.',
  photoUrl:
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
  availability: 'Actively looking for a job',
  contactPref: 'any',
  willingRelocate: true,
  searchable: true,
};

export const DEMO_JOBS = [
  {
    id: 'demo-job-1',
    title: 'Senior Frontend Developer (React)',
    company: 'Apex Innovations',
    city: 'Lagos',
    workMode: 'hybrid',
    type: 'Full-time',
    salary: '₦1,200,000 - ₦1,800,000 / month',
    description:
      'We are looking for a Senior Frontend Developer to lead the user interface engineering for our cross-border payment gateway. You will work with React, TypeScript, and modern state architectures.',
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'Fintech'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'demo-job-2',
    title: 'Full Stack Node.js / React Engineer',
    company: 'PayFlow Africa',
    city: 'Abuja',
    workMode: 'remote',
    type: 'Full-time',
    salary: '₦1,500,000 - ₦2,200,000 / month',
    description:
      'Join our distributed engineering team building scalable microservices and delightful digital banking interfaces for millions of users across West Africa.',
    tags: ['Node.js', 'React', 'PostgreSQL', 'Docker'],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'demo-job-3',
    title: 'Lead Mobile Engineer (Flutter / React Native)',
    company: 'HealthConnect Nigeria',
    city: 'Ibadan',
    workMode: 'hybrid',
    type: 'Full-time',
    salary: '₦900,000 - ₦1,400,000 / month',
    description:
      'Lead our mobile product line connecting patients to certified specialists, telemedicine consultations, and instant pharmacy fulfillment.',
    tags: ['Flutter', 'React Native', 'Mobile', 'Healthtech'],
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: 'demo-job-4',
    title: 'Senior Product Designer (UI/UX)',
    company: 'Kora Tech Solutions',
    city: 'Port Harcourt',
    workMode: 'remote',
    type: 'Full-time',
    salary: '₦800,000 - ₦1,300,000 / month',
    description:
      'Craft intuitive, beautiful design systems and user journeys for enterprise supply chain logistics and haulage management portals.',
    tags: ['Figma', 'UI/UX', 'Design Systems', 'User Research'],
    createdAt: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: 'demo-job-5',
    title: 'DevOps & Cloud Infrastructure Specialist',
    company: 'KudiCloud',
    city: 'Lagos',
    workMode: 'remote',
    type: 'Full-time',
    salary: '₦1,400,000 - ₦2,000,000 / month',
    description:
      'Manage multi-region AWS cloud infrastructure, CI/CD automated deployment pipelines, and zero-downtime database failovers.',
    tags: ['AWS', 'Kubernetes', 'CI/CD', 'Terraform'],
    createdAt: new Date(Date.now() - 345600000).toISOString(),
  },
];

export const DEMO_CANDIDATES = [
  {
    id: 'cand-1',
    name: 'Adaeze Okonkwo',
    headline: 'Senior Frontend Engineer · React & TypeScript',
    city: 'Lagos',
    workModePref: 'hybrid',
    skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'],
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    availability: 'Actively looking for a job',
  },
  {
    id: 'cand-2',
    name: 'Chinedu Eze',
    headline: 'Backend Architect · Go & Distributed Systems',
    city: 'Abuja',
    workModePref: 'remote',
    skills: ['Go', 'PostgreSQL', 'Docker', 'Kubernetes', 'gRPC'],
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    availability: 'Employed, open to opportunities',
  },
  {
    id: 'cand-3',
    name: 'Fatima Abubakar',
    headline: 'Product Designer · UI/UX & Design Systems',
    city: 'Kano',
    workModePref: 'remote',
    skills: ['Figma', 'Prototyping', 'User Research', 'Design Systems'],
    photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
    availability: 'Actively looking for a job',
  },
  {
    id: 'cand-4',
    name: 'Oluwaseun Adeleke',
    headline: 'Mobile Lead · Flutter & Swift',
    city: 'Ibadan',
    workModePref: 'hybrid',
    skills: ['Flutter', 'Dart', 'iOS', 'Android', 'Firebase'],
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    availability: 'Actively looking for a job',
  },
];

export const DEMO_APPLICATIONS = [
  {
    id: 'app-1',
    jobTitle: 'Senior Frontend Developer (React)',
    company: 'Apex Innovations',
    city: 'Lagos',
    status: 'interviewing',
    appliedDate: '2 days ago',
  },
  {
    id: 'app-2',
    jobTitle: 'Full Stack Node.js / React Engineer',
    company: 'PayFlow Africa',
    city: 'Abuja',
    status: 'reviewed',
    appliedDate: '5 days ago',
  },
  {
    id: 'app-3',
    jobTitle: 'Senior Product Designer',
    company: 'Kora Tech Solutions',
    city: 'Port Harcourt',
    status: 'submitted',
    appliedDate: '1 week ago',
  },
];
