// Single source of truth for site identity and metadata
export const site = {
  name: 'Prerna Kumari',
  shortName: 'Prerna',
  role: 'PhD Researcher, Data Science',
  institution: 'IISER Bhopal',
  department: 'Department of Data Science and Engineering',
  advisor: '{{ADVISOR_NAME}}', // TODO(content): specify PhD advisor name once assigned
  location: 'Bhopal, India',
  email: 'prerna26@iiserb.ac.in',
  tagline: 'Precision computer vision and robust deep learning for visual reasoning.', // ≤ 90 chars
  bio: 'PhD Research Scholar in Data Science and Engineering at IISER Bhopal. Specializing in computer vision, deep learning frameworks, and predictive modeling with mathematical rigor. M.Sc. in Mathematics and Computing from BHU Varanasi.',
  domain: 'https://Prerna-Kri.github.io',
  repo: 'Prerna_Website', // see §3.4: set to Prerna-Kri.github.io for root site or repo name for sub-path
  cvPdf: '/cv.pdf',
  socials: {
    scholar: '{{GOOGLE_SCHOLAR_URL}}', // TODO(content): Google Scholar profile URL
    orcid: '{{ORCID_URL}}', // TODO(content): ORCID profile URL
    github: 'https://github.com/Prerna-Kri',
    linkedin: 'https://www.linkedin.com/in/prerna-kumari-30589a224',
    x: '{{X_URL}}', // TODO(content): X profile URL
    bluesky: '{{BLUESKY_URL}}', // TODO(content): Bluesky profile URL
    semanticScholar: '{{SEMANTIC_SCHOLAR_URL}}', // TODO(content): Semantic Scholar URL
  },
  researchAreas: [
    'Computer Vision',
    'Deep Learning',
    'Predictive Analytics',
    'Object Detection & Tracking',
  ],
  openTo: 'Research collaborations, internships, and reviewing.',
} as const;

export type SiteConfig = typeof site;
