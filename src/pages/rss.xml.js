import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { site } from '../config';

export async function GET(context) {
  const posts = await getCollection('blog');
  return rss({
    title: `${site.name} Blog`,
    description: site.description,
    site: context.site ?? site.url,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${post.id}`,
    })),
  });
}
