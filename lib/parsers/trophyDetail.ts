import type { CheerioAPI } from 'cheerio';
import type { TrophyDetail, Trophy } from '../types';
import { absoluteUrl } from '../scraper';

function parseTrophyType(classStr: string): Trophy['type'] {
  if (/\bt1\b/.test(classStr)) return 'platinum';
  if (/\bt2\b/.test(classStr)) return 'gold';
  if (/\bt3\b/.test(classStr)) return 'silver';
  return 'bronze';
}

export function parseTrophyDetail(
  $: CheerioAPI,
  trophyId: string
): TrophyDetail {
  // Trophy info from the header box
  const headerBox = $('div.box').first();
  const name = headerBox.find('h1').text().trim();
  const description = headerBox.find('em').first().text().trim();
  const iconUrl = absoluteUrl(
    headerBox.find('img').first().attr('src') || ''
  );
  const typeClass = headerBox.find('.l').first().attr('class') || '';
  const type = parseTrophyType(typeClass);

  // Game info from darklist
  const gameLink = $('ul.darklist a').first();
  const gameHref = gameLink.attr('href') || '';
  const gameIdMatch = gameHref.match(/psngame\/(\d+)/);
  const gameId = gameIdMatch ? gameIdMatch[1] : '';
  const gameName =
    $('ul.darklist .ml100 a').first().text().trim() ||
    $('title').text().split('-').pop()?.trim() ||
    '';
  const gameThumbnailUrl = absoluteUrl(
    $('ul.darklist img').first().attr('src') || ''
  );

  // Platform
  const platform: string[] = [];
  const platformText = $('ul.darklist').text();
  if (/PS5/.test(platformText)) platform.push('PS5');
  if (/PS4/.test(platformText)) platform.push('PS4');
  if (/PS3/.test(platformText)) platform.push('PS3');
  if (/PSV/.test(platformText)) platform.push('PSV');

  // Tips/comments
  const tips: TrophyDetail['tips'] = [];
  $('ul.list > li').each((i, el) => {
    const $el = $(el);
    const authorName = $el.find('.psnnode').first().text().trim();
    if (!authorName) return;

    const authorAvatar = absoluteUrl(
      $el.find('a.l img').attr('src') || ''
    );
    const content = $el.find('.content').first().text().trim();
    const metaDivs = $el.find('.meta');
    const timestampEl = metaDivs.last();
    const timestamp = timestampEl.find('span').text().trim();
    const location =
      timestampEl
        .contents()
        .filter((_, node) => node.type === 'text')
        .text()
        .trim() || undefined;

    tips.push({
      id: `${trophyId}-tip-${i}`,
      authorName,
      authorAvatar,
      content,
      timestamp,
      location,
    });
  });

  return {
    id: trophyId,
    name,
    description,
    iconUrl,
    type,
    gameName,
    gameId,
    gameThumbnailUrl,
    platform,
    tips,
  };
}
