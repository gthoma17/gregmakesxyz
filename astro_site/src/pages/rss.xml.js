import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  const notes = await getCollection('notes', ({ data }) => !data.draft);
  
  // Combine and sort all content by date
  const allContent = [
    ...posts.map(post => ({
      ...post,
      type: 'post'
    })),
    ...notes.map(note => ({
      ...note,
      type: 'note'
    }))
  ].sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: 'Greg Thomas',
    description: 'The personal website of Greg Thomas, Technologist & Solution Finder.',
    site: context.site,
    items: allContent.map((item) => ({
      title: item.data.title || `Note from ${item.data.date.toLocaleDateString()}`,
      pubDate: item.data.date,
      description: `A ${item.type} by Greg Thomas`,
      link: `/${item.type === 'post' ? 'posts' : 'notes'}/${item.slug}/`,
    })),
  });
}