import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  const sortedPosts = posts.sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );

  return rss({
    title: '个人技术思考',
    description: '记录 C++、Qt 桌面开发、AI 编程工具实践与真实问题排查。',
    site: context.site ?? 'https://laoola.github.io',
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/blog/${post.id.replace(/\.(md|mdx)$/, '')}/`,
    })),
    customData: '<language>zh-cn</language>',
  });
}
