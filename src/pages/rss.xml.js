import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = (await getCollection('blog')).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
  );

  return rss({
    title: 'Signal & Substrate',
    description:
      'Notes on AI safety, machine learning mechanics, and data engineering.',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: post.data.externalUrl ?? `/blog/${post.id}/`,
    })),
    customData: '<language>en-us</language>',
  });
}
