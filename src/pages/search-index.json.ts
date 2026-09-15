import { getCollection } from 'astro:content';
import { withBase } from '../lib/paths';

export async function GET() {
  const publications = await getCollection('publications');
  const projects = await getCollection('projects');
  const posts = await getCollection('blog', ({ data }) => !data.draft);

  const searchIndex: Array<{
    id: string;
    title: string;
    category: 'page' | 'publication' | 'project' | 'post' | 'action';
    url: string;
    description?: string;
    actionId?: 'toggle-theme' | 'copy-email' | 'download-cv';
  }> = [];

  // Pages
  searchIndex.push(
    { id: 'page-home', title: 'Home', category: 'page', url: withBase('/'), description: 'Overview and research highlights' },
    { id: 'page-research', title: 'Research Pillars', category: 'page', url: withBase('/research'), description: 'Geometric invariance, visual topology, and applied vision' },
    { id: 'page-publications', title: 'Publications', category: 'page', url: withBase('/publications'), description: 'Peer-reviewed papers and conference preprints' },
    { id: 'page-projects', title: 'Projects & Code', category: 'page', url: withBase('/projects'), description: 'Applied machine learning and vision implementations' },
    { id: 'page-talks', title: 'Talks & Teaching', category: 'page', url: withBase('/talks'), description: 'Lectures, colloquia, instruction, and academic service' },
    { id: 'page-cv', title: 'Curriculum Vitae', category: 'page', url: withBase('/cv'), description: 'Full academic history, qualifications, and PDF download' },
    { id: 'page-writing', title: 'Writing', category: 'page', url: withBase('/writing'), description: 'Expository essays and mathematical notes' },
  );

  // Actions
  searchIndex.push(
    { id: 'act-theme', title: 'Toggle Theme', category: 'action', url: '#', description: 'Switch between dark and light appearance', actionId: 'toggle-theme' },
    { id: 'act-email', title: 'Copy Email', category: 'action', url: '#', description: 'Copy prerna26@iiserb.ac.in to clipboard', actionId: 'copy-email' },
    { id: 'act-cv', title: 'Download CV (PDF)', category: 'action', url: '#', description: 'Download complete academic resume in PDF format', actionId: 'download-cv' },
  );

  // Publications
  publications.forEach((pub) => {
    const slug = pub.id.replace(/\.[^/.]+$/, '');
    searchIndex.push({
      id: `pub-${slug}`,
      title: pub.data.title,
      category: 'publication',
      url: withBase(`/publications/${slug}`),
      description: `${pub.data.venue} (${pub.data.year}) · ${pub.data.authors.join(', ')}`,
    });
  });

  // Projects
  projects.forEach((proj) => {
    const slug = proj.id.replace(/\.[^/.]+$/, '');
    searchIndex.push({
      id: `proj-${slug}`,
      title: proj.data.name,
      category: 'project',
      url: withBase('/projects'),
      description: proj.data.summary,
    });
  });

  // Posts
  posts.forEach((post) => {
    const slug = post.id.replace(/\.[^/.]+$/, '');
    searchIndex.push({
      id: `post-${slug}`,
      title: post.data.title,
      category: 'post',
      url: withBase(`/writing/${slug}`),
      description: post.data.description,
    });
  });

  return new Response(JSON.stringify(searchIndex), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
