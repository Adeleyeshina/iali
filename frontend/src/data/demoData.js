// Realistic Nigerian Tech Platform Mock Data (derived from Neon PostgreSQL seeds)

export const DEMO_CANDIDATE_PROFILE = {
  name: 'Adaeze Okonkwo',
  headline: 'Frontend Engineer · React & TypeScript',
  summary:
    'Experienced frontend engineer with 4+ years building high-conversion, accessible fintech and SaaS web applications across Nigeria.',
  city: 'Lagos',
  workModePref: 'hybrid',
  availability: 'Actively looking for a job',
  contactPref: 'any',
  willingRelocate: false,
  searchable: true,
  skills: [
    'React',
    'TypeScript',
    'JavaScript',
    'Tailwind CSS',
    'Next.js',
    'Redux',
    'REST APIs',
    'Git',
  ],
  experience: [
    {
      title: 'Frontend Engineer',
      company: 'TechStartup Ltd',
      period: '2022 - Present',
      description:
        'Led component architecture and checkout redesign with React and Tailwind CSS. Reduced load times by 42% on Nigerian mobile networks.',
    },
    {
      title: 'Junior Web Developer',
      company: 'Interswitch Group',
      period: '2020 - 2022',
      description:
        'Built merchant portal dashboards and responsive transaction settlement monitoring views.',
    },
  ],
  education: [
    {
      school: 'University of Lagos (UNILAG)',
      degree: 'B.Sc Computer Science (First Class)',
      year: '2021',
    },
  ],
  cvFileName: 'Adaeze_Okonkwo_Resume.pdf',
  photoUrl:
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
};

export const DEMO_CANDIDATE_USER = {
  id: 'cand_1792935650559',
  name: 'Adaeze Okonkwo',
  email: 'adaeze@example.com',
  role: 'candidate',
  phone: '+234 802 345 6789',
  isConfirmed: true,
  isDemo: true,
  profile: DEMO_CANDIDATE_PROFILE,
};

export const DEMO_RECRUITER_USER = {
  id: 'recruiter_1792935650559',
  name: 'Tunde Bakare',
  email: 'tunde@techlagos.ng',
  role: 'recruiter',
  companyName: 'TechLagos Innovations',
  phone: '+234 803 987 6543',
  isConfirmed: true,
  isDemo: true,
  memberships: [
    {
      role: 'admin',
      verified: true,
      company: {
        id: 'comp-techlagos',
        name: 'TechLagos Innovations',
        verificationLevel: 'L2',
        cacNumber: 'RC-1849202',
        website: 'https://techlagos.ng',
      },
    },
  ],
};

export const DEMO_ADMIN_USER = {
  id: 'admin_01',
  name: 'Trust & Safety Admin',
  email: 'admin@iali.ng',
  role: 'admin',
  isConfirmed: true,
  isDemo: true,
};

export const INITIAL_DEMO_JOBS = [
  {
    id: '62506cc5-bb43-4149-8f9a-c7c21916a8f8',
    title: 'Frontend Engineer',
    companyId: 'comp-techlagos',
    company: {
      id: 'comp-techlagos',
      name: 'TechLagos Innovations',
      verificationLevel: 'L2',
      cacNumber: 'RC-1849202',
    },
    city: 'Lagos',
    workMode: 'onsite',
    salary: '₦850,000 - ₦1,400,000 / month',
    type: 'Full-time',
    status: 'Live',
    outsideFlag: false,
    requiredSkills: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js'],
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js'],
    description:
      'We are looking for a skilled React and TypeScript frontend developer in Lagos to build responsive and fast user interfaces for our fintech and candidate verification portals.',
    requirements: [
      '3+ years professional experience building web apps with React and TypeScript',
      'Solid understanding of component design systems, Tailwind CSS, and clean UI architecture',
      'Experience optimizing client bundles for mobile users in Nigeria and West Africa',
    ],
    responsibilities: [
      'Implement accessible, high-performance UI components from Figma specs',
      'Integrate with secure backend REST endpoints and handle edge states gracefully',
      'Collaborate closely with product managers and QA engineers',
    ],
    createdAt: '2026-10-25T13:41:13.858Z',
    _count: { applications: 4 },
  },
  {
    id: 'dd9bc416-820c-4bde-81bb-e151b7ba87f4',
    title: 'Fullstack Engineer (React & Node.js)',
    companyId: 'comp-techcorp',
    company: {
      id: 'comp-techcorp',
      name: 'TECHCORP Ltd',
      verificationLevel: 'L2',
      cacNumber: 'RC-123456',
    },
    city: 'Lagos',
    workMode: 'hybrid',
    salary: '₦1,200,000 - ₦1,900,000 / month',
    type: 'Full-time',
    status: 'Live',
    outsideFlag: false,
    requiredSkills: ['React', 'Node.js', 'PostgreSQL', 'Express'],
    tags: ['React', 'Node.js', 'PostgreSQL', 'Express'],
    description:
      'Join our high-growth Lagos engineering squad to build resilient fintech products and payment settlement infrastructure.',
    requirements: [
      'Strong proficiency with Node.js, Express, and React',
      'Hands-on experience with relational databases (PostgreSQL/Prisma)',
      'Understanding of JWT authentication and API security best practices',
    ],
    responsibilities: [
      'Develop end-to-end features spanning React UI and Node API services',
      'Maintain automated integration test suites and CI deployment flows',
    ],
    createdAt: '2026-10-17T01:06:49.384Z',
    _count: { applications: 3 },
  },
  {
    id: '3dc0a0f6-1838-4755-ba3e-4d930a395e08',
    title: 'Backend Systems Engineer',
    companyId: 'comp-techcorp',
    company: {
      id: 'comp-techcorp',
      name: 'TECHCORP Ltd',
      verificationLevel: 'L2',
      cacNumber: 'RC-123456',
    },
    city: null,
    workMode: 'remote',
    salary: '₦1,500,000 - ₦2,200,000 / month',
    type: 'Full-time',
    status: 'Live',
    outsideFlag: false,
    requiredSkills: ['PostgreSQL', 'Redis', 'Node.js', 'Docker'],
    tags: ['PostgreSQL', 'Redis', 'Node.js', 'Docker'],
    description:
      'Experience with PostgreSQL, Redis caching, microservices, and high-concurrency transaction processing nationwide across Nigeria.',
    requirements: [
      '4+ years building production backend APIs in Node.js or Go',
      'Deep knowledge of SQL query optimization and database indexing',
      'Familiarity with containerized deployments using Docker',
    ],
    responsibilities: [
      'Scale backend microservices to sustain high-volume transaction spikes',
      'Architect robust queue and background job processing pipelines',
    ],
    createdAt: '2026-10-17T01:06:50.699Z',
    _count: { applications: 2 },
  },
  {
    id: 'f8b0945d-0662-4f89-b7ab-bca4ddc5f12e',
    title: 'Product Designer (UI/UX)',
    companyId: 'comp-techcorp',
    company: {
      id: 'comp-techcorp',
      name: 'TECHCORP Ltd',
      verificationLevel: 'L2',
      cacNumber: 'RC-123456',
    },
    city: null,
    workMode: 'remote',
    salary: '₦900,000 - ₦1,500,000 / month',
    type: 'Full-time',
    status: 'Live',
    outsideFlag: false,
    requiredSkills: ['Figma', 'UI/UX', 'Design Systems', 'User Research'],
    tags: ['Figma', 'UI/UX', 'Design Systems', 'User Research'],
    description:
      'Design delightful mobile-first experiences for millions of Nigerian job seekers, recruiters, and verified hiring partners.',
    requirements: [
      'Proven portfolio displaying responsive web and mobile product design',
      'Advanced Figma component and variable design token skills',
      'Experience conducting user interviews and usability testing',
    ],
    responsibilities: [
      'Produce high-fidelity wireframes, interaction prototypes, and specs',
      'Collaborate with frontend engineers to maintain design consistency',
    ],
    createdAt: '2026-10-17T01:06:52.041Z',
    _count: { applications: 1 },
  },
  {
    id: '2df565ee-0747-40ea-9c24-50be3e007a84',
    title: 'Mobile Developer (React Native)',
    companyId: 'comp-techcorp',
    company: {
      id: 'comp-techcorp',
      name: 'TECHCORP Ltd',
      verificationLevel: 'L2',
      cacNumber: 'RC-123456',
    },
    city: 'Lagos',
    workMode: 'onsite',
    salary: '₦1,100,000 - ₦1,700,000 / month',
    type: 'Full-time',
    status: 'Live',
    outsideFlag: false,
    requiredSkills: ['React Native', 'TypeScript', 'Mobile', 'iOS', 'Android'],
    tags: ['React Native', 'TypeScript', 'Mobile'],
    description:
      'Help us scale our cross-platform mobile apps across Nigeria and West Africa with smooth offline-first experience.',
    requirements: [
      '3+ years hands-on React Native development for iOS and Android',
      'Proficiency with offline storage and push notifications',
    ],
    responsibilities: [
      'Develop core features for candidate job search and real-time chat',
      'Ship clean, native-feeling UI interactions with smooth animations',
    ],
    createdAt: '2026-10-17T01:06:53.312Z',
    _count: { applications: 2 },
  },
  {
    id: '4968a52c-98eb-42da-94c1-579434172ede',
    title: 'DevOps / Cloud Infrastructure Engineer',
    companyId: 'comp-techcorp',
    company: {
      id: 'comp-techcorp',
      name: 'TECHCORP Ltd',
      verificationLevel: 'L2',
      cacNumber: 'RC-123456',
    },
    city: null,
    workMode: 'remote',
    salary: '₦1,600,000 - ₦2,400,000 / month',
    type: 'Full-time',
    status: 'Live',
    outsideFlag: false,
    requiredSkills: ['AWS', 'Docker', 'CI/CD', 'Kubernetes'],
    tags: ['AWS', 'Docker', 'CI/CD', 'Kubernetes'],
    description:
      'AWS cloud infrastructure, Docker, CI/CD automated deployment pipelines, and infrastructure as code automation.',
    requirements: [
      'Demonstrated expertise in AWS, Terraform, and Kubernetes',
      'Experience setting up monitoring, Prometheus, and Grafana alert suites',
    ],
    responsibilities: [
      'Maintain 99.9% uptime across production clusters',
      'Automate staging previews and zero-downtime blue/green deployments',
    ],
    createdAt: '2026-10-17T01:06:54.619Z',
    _count: { applications: 1 },
  },
  {
    id: '65864ae3-44fa-467a-81e9-ed8f1a2d5fe1',
    title: 'Frontend Developer (Vue & React)',
    companyId: 'comp-techcorp',
    company: {
      id: 'comp-techcorp',
      name: 'TECHCORP Ltd',
      verificationLevel: 'L2',
      cacNumber: 'RC-123456',
    },
    city: 'Ibadan',
    workMode: 'onsite',
    salary: '₦700,000 - ₦1,100,000 / month',
    type: 'Full-time',
    status: 'Live',
    outsideFlag: false,
    requiredSkills: ['Vue', 'React', 'JavaScript', 'CSS'],
    tags: ['Vue', 'React', 'JavaScript', 'CSS'],
    description:
      'Build responsive and fast user interfaces for candidate verification portals at our Ibadan tech hub.',
    requirements: [
      'Solid experience in Vue 3 or React',
      'Knowledge of modern CSS, responsive layouts, and cross-browser testing',
    ],
    responsibilities: [
      'Develop portal modules and identity upload forms for applicant onboarding',
    ],
    createdAt: '2026-10-17T01:06:55.989Z',
    _count: { applications: 2 },
  },
  {
    id: '51a7c9bc-08ce-4584-a817-cc957804315f',
    title: 'QA Automation Engineer',
    companyId: 'comp-techcorp',
    company: {
      id: 'comp-techcorp',
      name: 'TECHCORP Ltd',
      verificationLevel: 'L2',
      cacNumber: 'RC-123456',
    },
    city: null,
    workMode: 'remote',
    salary: '₦950,000 - ₦1,500,000 / month',
    type: 'Full-time',
    status: 'Live',
    outsideFlag: false,
    requiredSkills: ['Playwright', 'Jest', 'TypeScript', 'QA Automation'],
    tags: ['Playwright', 'Jest', 'TypeScript', 'QA Automation'],
    description:
      'Playwright, Jest, end-to-end testing, and API regression testing suites for high-integrity hiring workflows.',
    requirements: [
      'Hands-on experience with Playwright or Cypress automation suites',
      'Experience writing API functional and regression tests with Jest/Supertest',
    ],
    responsibilities: [
      'Build automated regression test suites run on every pull request',
      'Identify edge-case bugs across auth, job applications, and messaging',
    ],
    createdAt: '2026-10-17T01:07:00.049Z',
    _count: { applications: 3 },
  },
  {
    id: '245b25f0-0b0d-4bc4-b866-4ebdeb57001c',
    title: 'Senior Go / Rust Systems Developer',
    companyId: 'comp-techcorp',
    company: {
      id: 'comp-techcorp',
      name: 'TECHCORP Ltd',
      verificationLevel: 'L2',
      cacNumber: 'RC-123456',
    },
    city: null,
    workMode: 'remote',
    salary: '₦2,000,000 - ₦3,000,000 / month',
    type: 'Full-time',
    status: 'Live',
    outsideFlag: false,
    requiredSkills: ['Go', 'Rust', 'Distributed Systems', 'PostgreSQL'],
    tags: ['Go', 'Rust', 'Distributed Systems', 'PostgreSQL'],
    description:
      'Architecting high-throughput distributed message queues, search indexing, and real-time candidate notification engines.',
    createdAt: '2026-10-17T01:07:01.926Z',
    _count: { applications: 2 },
  },
];

export const DEMO_JOBS = INITIAL_DEMO_JOBS;

export const DEMO_CANDIDATES = [
  {
    id: 'cand-adaeze',
    name: 'Adaeze Okonkwo',
    headline: 'Frontend Engineer · React & TypeScript',
    summary:
      'Experienced frontend developer building scalable web applications across Nigeria.',
    city: 'Lagos',
    workModePref: 'remote',
    skills: ['React', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'Next.js', 'Redux'],
    photoUrl:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    availability: 'Actively looking for a job',
    completeness: { score: 100, missing: [] },
    experience: [
      {
        title: 'Frontend Engineer',
        period: '2022 - Present',
        company: 'TechStartup Ltd',
        description: 'React development and checkout optimization',
      },
    ],
    education: [
      {
        year: '2021',
        degree: 'B.Sc Computer Science',
        school: 'University of Lagos',
      },
    ],
    cvFileName: 'Adaeze_Okonkwo_Resume.pdf',
  },
  {
    id: 'cand-chinedu',
    name: 'Chinedu Eze',
    headline: 'Backend Developer · Node.js & Distributed Systems',
    summary: 'Passionate developer building scalable distributed APIs and systems.',
    city: 'Lagos',
    workModePref: 'remote',
    skills: ['Node.js', 'Express', 'PostgreSQL', 'Prisma', 'Docker'],
    photoUrl:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    availability: 'Actively looking for a job',
    completeness: { score: 100, missing: [] },
    experience: [
      {
        title: 'Backend Engineer',
        period: '2023 - Present',
        company: 'Paystack',
        description: 'Payment settlement APIs and PostgreSQL indexing',
      },
    ],
    education: [
      {
        year: '2022',
        degree: 'B.Sc Computer Science',
        school: 'UNILAG',
      },
    ],
    cvFileName: 'Chinedu_CV.pdf',
  },
  {
    id: 'cand-fatima',
    name: 'Fatima Abubakar',
    headline: 'Product Designer · UI/UX & Design Systems',
    summary:
      'Fintech UI/UX designer focusing on intuitive onboarding and localized payment UX.',
    city: 'Abuja',
    workModePref: 'remote',
    skills: ['Figma', 'UI/UX', 'Design Systems', 'Prototyping', 'User Research'],
    photoUrl:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    availability: 'Open to offers',
    completeness: { score: 95, missing: [] },
    experience: [
      {
        title: 'Product Designer',
        period: '2021 - Present',
        company: 'Kuda Bank',
        description: 'Design system tokens and mobile savings flow',
      },
    ],
    education: [
      {
        year: '2020',
        degree: 'B.A Industrial Design',
        school: 'Ahmadu Bello University',
      },
    ],
    cvFileName: 'Fatima_Abubakar_Portfolio.pdf',
  },
  {
    id: 'cand-oluwaseun',
    name: 'Oluwaseun Adeleke',
    headline: 'Mobile Lead · Flutter & React Native',
    summary:
      'Mobile lead delivering offline-first banking and logistics apps for iOS and Android.',
    city: 'Ibadan',
    workModePref: 'hybrid',
    skills: ['Flutter', 'React Native', 'Dart', 'TypeScript', 'Firebase'],
    photoUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    availability: 'Actively looking for a job',
    completeness: { score: 100, missing: [] },
    experience: [
      {
        title: 'Mobile Lead',
        period: '2022 - Present',
        company: 'HealthConnect Nigeria',
        description: 'Cross-platform telemedicine and pharmacy ordering app',
      },
    ],
    education: [
      {
        year: '2021',
        degree: 'B.Sc Software Engineering',
        school: 'University of Ibadan',
      },
    ],
    cvFileName: 'Oluwaseun_Adeleke_CV.pdf',
  },
  {
    id: 'cand-chidi',
    name: 'Chidi Okafor',
    headline: 'Frontend Engineer · React & Component Systems',
    summary:
      'Passionate about accessible UI primitives, web performance, and design systems.',
    city: 'Lagos',
    workModePref: 'remote',
    skills: ['React', 'JavaScript', 'HTML/CSS', 'Tailwind CSS'],
    photoUrl:
      'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80',
    availability: 'Actively looking for a job',
    completeness: { score: 92, missing: [] },
    experience: [
      {
        title: 'Frontend Developer',
        period: '2022 - 2024',
        company: 'TechStartup Ltd',
        description: 'React responsive layouts and dashboard analytics views',
      },
    ],
    education: [
      {
        year: '2022',
        degree: 'B.Sc Computer Science',
        school: 'Covenant University',
      },
    ],
    cvFileName: 'Chidi_Okafor_CV.pdf',
  },
  {
    id: 'cand-shina',
    name: 'Adeleye Shina',
    headline: 'Fullstack Software Engineer · React, Node & PostgreSQL',
    summary:
      'Product-minded fullstack engineer building robust web architectures and distributed APIs.',
    city: 'Lagos',
    workModePref: 'hybrid',
    skills: ['React', 'Node.js', 'PostgreSQL', 'Prisma', 'Tailwind CSS', 'Docker'],
    photoUrl:
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
    availability: 'Actively looking for a job',
    completeness: { score: 100, missing: [] },
    experience: [
      {
        title: 'Fullstack Engineer',
        period: '2021 - Present',
        company: 'TechLagos Innovations',
        description: 'Built authentication pipelines and applicant tracking views',
      },
    ],
    education: [
      {
        year: '2021',
        degree: 'B.Sc Computer Engineering',
        school: 'University of Lagos',
      },
    ],
    cvFileName: 'Adeleye_Shina_Resume.pdf',
  },
];

export const INITIAL_DEMO_APPLICATIONS = [
  {
    id: 'app-01',
    jobId: '62506cc5-bb43-4149-8f9a-c7c21916a8f8',
    candidateId: 'cand_1792935650559',
    status: 'Interview',
    rejected: false,
    createdAt: '2026-10-25T13:41:22.026Z',
    updatedAt: '2026-10-25T13:41:35.308Z',
    job: {
      id: '62506cc5-bb43-4149-8f9a-c7c21916a8f8',
      title: 'Frontend Engineer',
      company: {
        id: 'comp-techlagos',
        name: 'TechLagos Innovations',
        verificationLevel: 'L2',
      },
      city: 'Lagos',
      workMode: 'onsite',
      salary: '₦850,000 - ₦1,400,000 / month',
    },
    matchScore: { score: 96, label: 'Strong Fit', level: 'high' },
  },
  {
    id: 'app-02',
    jobId: 'dd9bc416-820c-4bde-81bb-e151b7ba87f4',
    candidateId: 'cand_1792935650559',
    status: 'Shortlisted',
    rejected: false,
    createdAt: '2026-10-23T11:15:00.000Z',
    updatedAt: '2026-10-24T09:30:00.000Z',
    job: {
      id: 'dd9bc416-820c-4bde-81bb-e151b7ba87f4',
      title: 'Fullstack Engineer (React & Node.js)',
      company: {
        id: 'comp-techcorp',
        name: 'TECHCORP Ltd',
        verificationLevel: 'L2',
      },
      city: 'Lagos',
      workMode: 'hybrid',
      salary: '₦1,200,000 - ₦1,900,000 / month',
    },
    matchScore: { score: 88, label: 'Good Fit', level: 'mid' },
  },
  {
    id: 'app-03',
    jobId: '51a7c9bc-08ce-4584-a817-cc957804315f',
    candidateId: 'cand_1792935650559',
    status: 'Submitted',
    rejected: false,
    createdAt: '2026-10-21T14:20:00.000Z',
    updatedAt: '2026-10-21T14:20:00.000Z',
    job: {
      id: '51a7c9bc-08ce-4584-a817-cc957804315f',
      title: 'QA Automation Engineer',
      company: {
        id: 'comp-techcorp',
        name: 'TECHCORP Ltd',
        verificationLevel: 'L2',
      },
      city: null,
      workMode: 'remote',
      salary: '₦950,000 - ₦1,500,000 / month',
    },
    matchScore: { score: 72, label: 'Potential Fit', level: 'mid' },
  },
  {
    id: 'app-04',
    jobId: '3dc0a0f6-1838-4755-ba3e-4d930a395e08',
    candidateId: 'cand_1792935650559',
    status: 'Withdrawn',
    rejected: false,
    createdAt: '2026-10-18T10:00:00.000Z',
    updatedAt: '2026-10-20T16:00:00.000Z',
    job: {
      id: '3dc0a0f6-1838-4755-ba3e-4d930a395e08',
      title: 'Backend Systems Engineer',
      company: {
        id: 'comp-techcorp',
        name: 'TECHCORP Ltd',
        verificationLevel: 'L2',
      },
      city: null,
      workMode: 'remote',
      salary: '₦1,500,000 - ₦2,200,000 / month',
    },
  },
];

export const DEMO_APPLICATIONS = INITIAL_DEMO_APPLICATIONS;

export const INITIAL_DEMO_JOB_APPLICANTS = {
  '62506cc5-bb43-4149-8f9a-c7c21916a8f8': [
    {
      id: 'app-job-1-cand-1',
      jobId: '62506cc5-bb43-4149-8f9a-c7c21916a8f8',
      candidateId: 'cand_1792935650559',
      status: 'Interview',
      rejected: false,
      createdAt: '2026-10-25T13:41:22.026Z',
      candidate: {
        id: 'cand_1792935650559',
        name: 'Adaeze Okonkwo',
        email: 'adaeze@example.com',
        profile: DEMO_CANDIDATE_PROFILE,
      },
      matchScore: { score: 96, label: 'Strong Fit', level: 'high' },
    },
    {
      id: 'app-job-1-cand-2',
      jobId: '62506cc5-bb43-4149-8f9a-c7c21916a8f8',
      candidateId: 'cand-chidi',
      status: 'Shortlisted',
      rejected: false,
      createdAt: '2026-10-25T10:20:00.000Z',
      candidate: {
        id: 'cand-chidi',
        name: 'Chidi Okafor',
        email: 'chidi@example.com',
        profile: DEMO_CANDIDATES[4],
      },
      matchScore: { score: 91, label: 'Strong Fit', level: 'high' },
    },
    {
      id: 'app-job-1-cand-3',
      jobId: '62506cc5-bb43-4149-8f9a-c7c21916a8f8',
      candidateId: 'cand-shina',
      status: 'Submitted',
      rejected: false,
      createdAt: '2026-10-25T15:28:12.818Z',
      candidate: {
        id: 'cand-shina',
        name: 'Adeleye Shina',
        email: 'adeleyeshina7@gmail.com',
        profile: DEMO_CANDIDATES[5],
      },
      matchScore: { score: 84, label: 'Good Fit', level: 'mid' },
    },
    {
      id: 'app-job-1-cand-4',
      jobId: '62506cc5-bb43-4149-8f9a-c7c21916a8f8',
      candidateId: 'cand-chinedu',
      status: 'Viewed',
      rejected: false,
      createdAt: '2026-10-24T18:00:00.000Z',
      candidate: {
        id: 'cand-chinedu',
        name: 'Chinedu Eze',
        email: 'chinedu@example.com',
        profile: DEMO_CANDIDATES[1],
      },
      matchScore: { score: 68, label: 'Potential Fit', level: 'mid' },
    },
  ],
};

export const INITIAL_DEMO_CONVERSATIONS = [
  {
    id: 'conv-01',
    recruiterId: 'recruiter_1792935650559',
    candidateId: 'cand_1792935650559',
    jobId: '62506cc5-bb43-4149-8f9a-c7c21916a8f8',
    subject: 'Interview Invitation: Frontend Engineer at TechLagos Innovations',
    createdAt: '2026-10-25T14:30:00.000Z',
    updatedAt: '2026-10-25T14:52:00.000Z',
    candidate: {
      id: 'cand_1792935650559',
      name: 'Adaeze Okonkwo',
      email: 'adaeze@example.com',
      headline: 'Frontend Engineer · React & TypeScript',
      city: 'Lagos',
      photoUrl:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    },
    recruiter: {
      id: 'recruiter_1792935650559',
      name: 'Tunde Bakare',
      email: 'tunde@techlagos.ng',
      companyName: 'TechLagos Innovations',
      memberships: [
        {
          company: {
            name: 'TechLagos Innovations',
            verificationLevel: 'L2',
          },
        },
      ],
    },
    messages: [
      {
        id: 'msg-01',
        senderId: 'recruiter_1792935650559',
        senderRole: 'recruiter',
        text: 'Hi Adaeze, we thoroughly reviewed your portfolio and React experience at TechStartup Ltd. Your focus on performance optimization on Nigerian mobile networks aligns directly with our engineering priorities.',
        createdAt: '2026-10-25T14:30:00.000Z',
      },
      {
        id: 'msg-02',
        senderId: 'recruiter_1792935650559',
        senderRole: 'recruiter',
        text: 'We would love to invite you to a 30-minute technical chat this Thursday to discuss the Frontend Engineer role. Please let me know what time works best for you.',
        createdAt: '2026-10-25T14:31:00.000Z',
      },
      {
        id: 'msg-03',
        senderId: 'cand_1792935650559',
        senderRole: 'candidate',
        text: 'Hello Tunde! Thank you so much for reaching out. I would be thrilled to discuss the role and your verification portal roadmap. Thursday at 2:00 PM WAT works perfectly for me!',
        createdAt: '2026-10-25T14:48:00.000Z',
      },
      {
        id: 'msg-04',
        senderId: 'recruiter_1792935650559',
        senderRole: 'recruiter',
        text: 'Wonderful! I have scheduled Thursday 2:00 PM on the calendar and will send over the Google Meet link. Looking forward to our conversation!',
        createdAt: '2026-10-25T14:52:00.000Z',
      },
    ],
  },
  {
    id: 'conv-02',
    recruiterId: 'recruiter_1792935650559',
    candidateId: 'cand-chinedu',
    jobId: '3dc0a0f6-1838-4755-ba3e-4d930a395e08',
    subject: 'Backend Systems Engineer Opportunity',
    createdAt: '2026-10-25T12:10:00.000Z',
    updatedAt: '2026-10-25T12:10:00.000Z',
    candidate: {
      id: 'cand-chinedu',
      name: 'Chinedu Eze',
      email: 'chinedu@example.com',
      headline: 'Backend Developer · Node.js & Distributed Systems',
      city: 'Lagos',
      photoUrl:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    },
    recruiter: {
      id: 'recruiter_1792935650559',
      name: 'Tunde Bakare',
      email: 'tunde@techlagos.ng',
      companyName: 'TechLagos Innovations',
      memberships: [
        {
          company: {
            name: 'TechLagos Innovations',
            verificationLevel: 'L2',
          },
        },
      ],
    },
    messages: [
      {
        id: 'msg-chinedu-01',
        senderId: 'recruiter_1792935650559',
        senderRole: 'recruiter',
        text: 'Hi Chinedu, saw your background building distributed microservices with PostgreSQL and Docker. We have an open Backend Systems role you would be great for.',
        createdAt: '2026-10-25T12:10:00.000Z',
      },
    ],
  },
  {
    id: 'conv-03',
    recruiterId: 'recruiter_1792935650559',
    candidateId: 'cand-fatima',
    jobId: 'dd9bc416-820c-4bde-81bb-e151b7ba87f4',
    subject: 'UI/UX Design Systems Collaboration',
    createdAt: '2026-10-24T09:20:00.000Z',
    updatedAt: '2026-10-24T09:20:00.000Z',
    candidate: {
      id: 'cand-fatima',
      name: 'Fatima Abubakar',
      email: 'fatima@example.com',
      headline: 'Product Designer · UI/UX & Design Systems',
      city: 'Abuja',
      photoUrl:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    },
    recruiter: {
      id: 'recruiter_1792935650559',
      name: 'Tunde Bakare',
      email: 'tunde@techlagos.ng',
      companyName: 'TechLagos Innovations',
      memberships: [
        {
          company: {
            name: 'TechLagos Innovations',
            verificationLevel: 'L2',
          },
        },
      ],
    },
    messages: [
      {
        id: 'msg-fatima-01',
        senderId: 'recruiter_1792935650559',
        senderRole: 'recruiter',
        text: 'Hi Fatima! We loved your fintech design portfolio on Figma and Behance. Are you open to discussing remote product design roles?',
        createdAt: '2026-10-24T09:20:00.000Z',
      },
    ],
  },
  {
    id: 'conv-04',
    recruiterId: 'recruiter_1792935650559',
    candidateId: 'cand-emeka',
    jobId: '62506cc5-bb43-4149-8f9a-c7c21916a8f8',
    subject: 'React Native & Mobile Engineering Role',
    createdAt: '2026-10-23T16:45:00.000Z',
    updatedAt: '2026-10-23T16:45:00.000Z',
    candidate: {
      id: 'cand-emeka',
      name: 'Emeka Okafor',
      email: 'emeka@example.com',
      headline: 'Mobile Engineer · React Native & Flutter',
      city: 'Lagos',
      photoUrl:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    },
    recruiter: {
      id: 'recruiter_1792935650559',
      name: 'Tunde Bakare',
      email: 'tunde@techlagos.ng',
      companyName: 'TechLagos Innovations',
      memberships: [
        {
          company: {
            name: 'TechLagos Innovations',
            verificationLevel: 'L2',
          },
        },
      ],
    },
    messages: [
      {
        id: 'msg-emeka-01',
        senderId: 'recruiter_1792935650559',
        senderRole: 'recruiter',
        text: 'Hello Emeka, your background in mobile offline-first architectures in Lagos stood out. Let us connect!',
        createdAt: '2026-10-23T16:45:00.000Z',
      },
    ],
  },
];

export const DEMO_ADMIN_QUEUES = {
  jobs: [
    {
      id: 'pending-job-01',
      title: 'Senior Flutter Developer',
      companyId: 'comp-apex',
      workMode: 'hybrid',
      city: 'Lagos',
      outsideFlag: false,
      status: 'Pending Review',
      createdAt: '2026-10-25T16:00:00.000Z',
      company: {
        name: 'Apex Fintech Ltd',
        verificationLevel: 'L1',
      },
    },
    {
      id: 'pending-job-02',
      title: 'Customer Onboarding Officer',
      companyId: 'comp-apex',
      workMode: 'onsite',
      city: 'Enugu',
      outsideFlag: true,
      status: 'Pending Review',
      createdAt: '2026-10-25T17:15:00.000Z',
      company: {
        name: 'Apex Fintech Ltd',
        verificationLevel: 'L1',
      },
    },
  ],
  verifications: [
    {
      id: 'verif-01',
      kind: 'CAC',
      status: 'Pending',
      createdAt: '2026-10-25T11:00:00.000Z',
      user: {
        id: 'rec-02',
        name: 'Kunle Adeleke',
        email: 'kunle@apexfintech.ng',
        memberships: [
          {
            company: {
              name: 'Apex Fintech Ltd',
              cacNumber: 'RC-998241',
              verificationLevel: 'L1',
            },
          },
        ],
      },
    },
    {
      id: 'verif-02',
      kind: 'CIPM',
      status: 'Pending',
      createdAt: '2026-10-25T09:30:00.000Z',
      user: {
        id: 'rec-03',
        name: 'Ngozi Okereke',
        email: 'hr@kudicloud.ng',
        memberships: [
          {
            company: {
              name: 'KudiCloud Systems',
              cacNumber: 'RC-445892',
              verificationLevel: 'L1',
            },
          },
        ],
      },
    },
  ],
  waitlist: {
    Lagos: 342,
    Abuja: 189,
    Ibadan: 114,
    'Port Harcourt': 88,
    Kano: 52,
    Enugu: 43,
  },
};
