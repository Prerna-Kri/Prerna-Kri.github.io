import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { site } from '../config/site';

export async function GET() {
  const notes = await getCollection('writing', ({ data }) => !data.draft);

  return rss({
    title: `${site.name} — Technical Notes`,
    description: site.bio,
    site: site.domain,
    items: notes.map((note) => {
      const slug = note.id.replace(/\.[^/.]+$/, '');
      return {
        title: note.data.title,
        pubDate: new Date(note.data.date),
        description: note.data.description,
        link: `/writing/${slug}/`,
      };
    }),
    customData: `<language>en-us</language>`,
  });
}
