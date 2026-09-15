import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { site } from '../config/site';

export async function GET() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);

  return rss({
    title: `${site.name} — Research Notes & Essays`,
    description: site.bio,
    site: site.domain,
    items: posts.map((post) => {
      const slug = post.id.replace(/\.[^/.]+$/, '');
      return {
        title: post.data.title,
        pubDate: new Date(post.data.date),
        description: post.data.description,
        link: `/writing/${slug}/`,
      };
    }),
    customData: `<language>en-us</language>`,
  });
}
