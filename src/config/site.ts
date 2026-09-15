// Single source of truth for site identity and metadata per §1
export const site = {
  name: 'Prerna Kumari',
  firstName: 'Prerna',
  initials: 'PK',
  role: 'PhD Researcher',
  field: 'Data Science & Engineering',
  institution: 'IISER Bhopal',
  lab: 'Department of Data Science and Engineering',
  advisor: '{{ADVISOR_NAME}}', // TODO(content): PhD advisor name once assigned
  startedPhD: '2026-01',
  location: 'Bhopal, India',
  email: 'prerna26@iiserb.ac.in',
  tagline: 'Computer vision, deep learning models, and predictive analytics for visual and structured data.', // ≤ 110 chars
  bio: 'PhD researcher in the Department of Data Science and Engineering at IISER Bhopal. Prior background includes an M.Sc. in Mathematics and Computing from Banaras Hindu University and research in computer vision and deep learning. Focuses on practical machine learning applications and visual recognition systems.',
  domain: 'https://Prerna-Kri.github.io',
  repo: 'Prerna-Kri.github.io', // root user site logic per §3.4
  cvPdf: '/cv.pdf',
  socials: {
    github: 'https://github.com/Prerna-Kri',
    linkedin: 'https://www.linkedin.com/in/prerna-kumari-30589a224',
    scholar: '{{GOOGLE_SCHOLAR_URL}}', // TODO(content): Google Scholar URL
    orcid: '{{ORCID_URL}}', // TODO(content): ORCID URL
    x: '{{X_URL}}', // TODO(content): X URL
    bluesky: '{{BLUESKY_URL}}', // TODO(content): Bluesky URL
    kaggle: '{{KAGGLE_URL}}', // TODO(content): Kaggle URL
    huggingface: '{{HUGGINGFACE_URL}}', // TODO(content): HuggingFace URL
  },
  interests: ['Computer Vision', 'Deep Learning', 'Machine Learning'],
  openTo: 'Collaborations, reading groups, and internship conversations.',
} as const;

export type SiteConfig = typeof site;
