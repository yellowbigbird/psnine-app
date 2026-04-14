import type { CheerioAPI } from 'cheerio';
import type { GameDetail, Trophy } from '../types';
import { absoluteUrl } from '../scraper';

function parseTrophyType(text: string): Trophy['type'] {
  if (/铜|bronze/i.test(text)) return 'bronze';
  if (/银|silver/i.test(text)) return 'silver';
  if (/金|gold/i.test(text)) return 'gold';
  if (/白金|platinum/i.test(text)) return 'platinum';
  return 'bronze';
}

export function parseGameDetail($: CheerioAPI, gameId: string): GameDetail {
  const title =
    $('h1, div.title a').first().text().trim() ||
    $('title').text().split('-')[0].trim();

  const thumbnailUrl = absoluteUrl(
    $('img[src*="psnobj.prod.dl.playstation.net"]').first().attr('src') || ''
  );

  // Platform detection from page content
  const pageText = $('body').text();
  const platforms: string[] = [];
  if (/PS5/.test(pageText)) platforms.push('PS5');
  if (/PS4/.test(pageText)) platforms.push('PS4');
  if (/PS3/.test(pageText)) platforms.push('PS3');
  if (/PSV/.test(pageText)) platforms.push('PSV');

  // Trophy summary - "白X 金X 银X 铜X 总XX"
  const summaryText = $('div.box, div.mt10').first().text();
  const platMatch = summaryText.match(/白(\d+)/);
  const goldMatch = summaryText.match(/金(\d+)/);
  const silverMatch = summaryText.match(/银(\d+)/);
  const bronzeMatch = summaryText.match(/铜(\d+)/);
  const totalMatch = summaryText.match(/总(\d+)/);

  const trophySummary = {
    platinum: platMatch ? parseInt(platMatch[1]) : 0,
    gold: goldMatch ? parseInt(goldMatch[1]) : 0,
    silver: silverMatch ? parseInt(silverMatch[1]) : 0,
    bronze: bronzeMatch ? parseInt(bronzeMatch[1]) : 0,
    total: totalMatch ? parseInt(totalMatch[1]) : 0,
  };

  // Completion rate
  const completionMatch = pageText.match(/([\d.]+)%/);
  const completionRate = completionMatch
    ? parseFloat(completionMatch[1])
    : 0;

  // Parse individual trophies
  const trophies: Trophy[] = [];
  $(
    'table.list tr, div.trophy, div.box table tr'
  ).each((i, el) => {
    const $el = $(el);
    const trophyText = $el.text();

    // Get trophy icon
    const iconImg = $el.find('img').first();
    const iconUrl = iconImg.attr('src') || '';
    if (!iconUrl && !trophyText.includes('%')) return;

    // Get trophy name - usually the first link text
    const nameEl = $el.find('a').first();
    const name = nameEl.text().trim();
    if (!name) return;

    // Description - text content after the name
    const description =
      $el.find('em, .text-gray, .desc, td:nth-child(2)').text().trim() ||
      '';

    // Rarity percentage
    const rarityMatch = trophyText.match(/([\d.]+)%/);
    const rarity = rarityMatch ? parseFloat(rarityMatch[1]) : 0;

    // Rarity label
    const rarityLabels = ['极为珍贵', '非常珍贵', '珍贵', '一般', '普通'];
    let rarityLabel = '一般';
    for (const label of rarityLabels) {
      if (trophyText.includes(label)) {
        rarityLabel = label;
        break;
      }
    }

    // Trophy type from icon or class
    const typeClass = $el.attr('class') || '';
    const imgAlt = iconImg.attr('alt') || '';
    let type: Trophy['type'] = 'bronze';
    if (/platinum|白金/.test(typeClass + imgAlt + trophyText)) type = 'platinum';
    else if (/gold|金/.test(typeClass + imgAlt)) type = 'gold';
    else if (/silver|银/.test(typeClass + imgAlt)) type = 'silver';

    // Earned status
    const earned =
      $el.hasClass('earned') ||
      $el.find('.earned, .green, .text-green').length > 0 ||
      $el.find('img[src*="earned"]').length > 0;

    trophies.push({
      id: `${gameId}-${i}`,
      name,
      description,
      iconUrl: absoluteUrl(iconUrl),
      type,
      rarity,
      rarityLabel,
      earned,
    });
  });

  return {
    id: gameId,
    title,
    thumbnailUrl,
    platform: platforms,
    trophySummary,
    completionRate,
    trophies,
  };
}
