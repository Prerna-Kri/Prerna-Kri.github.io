import { getCollection } from 'astro:content';
import { withBase } from '../lib/paths';

export async function GET() {
  const publications = await getCollection('publications');
  const projects = await getCollection('projects');
  const notes = await getCollection('writing', ({ data }) => !data.draft);

  const searchIndex: Array<{
    id: string;
    title: string;
    category: 'page' | 'publication' | 'project' | 'post' | 'action';
    url: string;
    description?: string;
    actionId?: 'toggle-theme' | 'copy-email' | 'download-cv';
  }> = [];

  // Pages (§7, §10)
  searchIndex.push(
    { id: 'page-home', title: 'Home', category: 'page', url: withBase('/'), description: 'Overview, timeline, and research highlights' },
    { id: 'page-research', title: 'Research', category: 'page', url: withBase('/research'), description: 'Computer vision diagnostics and machine learning directions' },
    { id: 'page-work', title: 'Work & Code', category: 'page', url: withBase('/work'), description: 'Computational implementations and models' },
    { id: 'page-cv', title: 'Curriculum Vitae', category: 'page', url: withBase('/cv'), description: 'Full academic history, qualifications, and PDF' },
  );

  if (notes.length > 0) {
    searchIndex.push({
      id: 'page-writing',
      title: 'Writing & Notes',
      category: 'page',
      url: withBase('/writing'),
      description: 'Technical explainers and derivations',
    });
  }

  if (publications.length > 0) {
    searchIndex.push({
      id: 'page-publications',
      title: 'Publications',
      category: 'page',
      url: withBase('/publications'),
      description: 'Peer-reviewed papers and preprints',
    });
  }

  // Quick Actions (§10)
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
    searchIndex.push({
      id: `proj-${proj.id}`,
      title: proj.data.name,
      category: 'project',
      url: withBase('/work'),
      description: proj.data.summary,
    });
  });

  // Notes
  notes.forEach((note) => {
    const slug = note.id.replace(/\.[^/.]+$/, '');
    searchIndex.push({
      id: `note-${slug}`,
      title: note.data.title,
      category: 'post',
      url: withBase(`/writing/${slug}`),
      description: note.data.description,
    });
  });

  return new Response(JSON.stringify(searchIndex), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
