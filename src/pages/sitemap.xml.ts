import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = (site ?? new URL('https://signalsubstrate.github.io')).toString().replace(/\/$/, '');
  const posts = (await getCollection('blog')).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
  );

  const latestPostDate =
    posts[0]?.data.date.toISOString().slice(0, 10) ??
    new Date().toISOString().slice(0, 10);

  const urls: Array<{ loc: string; lastmod?: string; changefreq: string; priority: string }> = [
    {
      loc: `${baseUrl}/`,
      lastmod: latestPostDate,
      changefreq: 'weekly',
      priority: '1.0',
    },
    {
      loc: `${baseUrl}/about/`,
      changefreq: 'monthly',
      priority: '0.6',
    },
  ];

  for (const post of posts) {
    const lastmod = post.data.date.toISOString().slice(0, 10);
    if (!post.data.externalUrl) {
      urls.push({
        loc: `${baseUrl}/blog/${post.id}/`,
        lastmod,
        changefreq: 'monthly',
        priority: '0.8',
      });
    } else if (post.data.externalUrl.startsWith('/')) {
      urls.push({
        loc: `${baseUrl}${post.data.externalUrl}`,
        lastmod,
        changefreq: 'monthly',
        priority: '0.8',
      });
    }
  }

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map((entry) => {
      const parts = [
        '  <url>',
        `    <loc>${escapeXml(entry.loc)}</loc>`,
        entry.lastmod ? `    <lastmod>${entry.lastmod}</lastmod>` : null,
        `    <changefreq>${entry.changefreq}</changefreq>`,
        `    <priority>${entry.priority}</priority>`,
        '  </url>',
      ].filter(Boolean);
      return parts.join('\n');
    }),
    '</urlset>',
  ].join('\n');

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
