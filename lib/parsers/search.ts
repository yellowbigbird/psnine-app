import type { CheerioAPI } from 'cheerio';
import type { SearchResult } from '../types';
import { absoluteUrl } from '../scraper';

export function parseSearchResults($: CheerioAPI): SearchResult[] {
  const results: SearchResult[] = [];

  // PSNine search results page
  $('div.box table tr, div.list li, div.user').each((_, el) => {
    const $el = $(el);
    const link = $el.find('a[href*="/psnid/"]').first();
    const psnId = link.text().trim();
    if (!psnId) return;

    const img = $el.find('img').first();
    const avatarUrl = absoluteUrl(img.attr('src') || '');

    const text = $el.text();
    const levelMatch = text.match(/Lv\s*(\d+)/);
    const level = levelMatch ? parseInt(levelMatch[1]) : 0;

    const trophyMatch = text.match(/(\d+)\s*(?:总奖杯|个奖杯)/);
    const trophyCount = trophyMatch ? parseInt(trophyMatch[1]) : 0;

    results.push({ psnId, avatarUrl, level, trophyCount });
  });

  return results;
}
