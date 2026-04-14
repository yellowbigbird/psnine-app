import type { CheerioAPI } from 'cheerio';
import type { Comment } from '../types';
import { absoluteUrl } from '../scraper';

export function parseComments($: CheerioAPI): Comment[] {
  const comments: Comment[] = [];

  $('div.comment, div.post, div.list li, table.list tr').each((i, el) => {
    const $el = $(el);

    const authorLink = $el.find('a[href*="/psnid/"]').first();
    const authorName = authorLink.text().trim();
    if (!authorName) return;

    const authorImg = $el.find('img').first();
    const authorAvatar = absoluteUrl(authorImg.attr('src') || '');

    const content = $el
      .find('p, div.content, td')
      .last()
      .text()
      .trim()
      .replace(authorName, '')
      .trim();
    if (!content) return;

    const timeEl = $el.find('small, span.time, time, .meta');
    const timestamp = timeEl.text().trim();

    const locationMatch = $el.text().match(/[\u4e00-\u9fa5]{2,4}(?=\s*$)/);
    const location = locationMatch ? locationMatch[0] : undefined;

    comments.push({
      id: `comment-${i}`,
      authorName,
      authorAvatar,
      content,
      timestamp,
      location,
    });
  });

  return comments;
}
