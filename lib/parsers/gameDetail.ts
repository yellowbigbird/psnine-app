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
  $('table.list tr.trophy').each((i, el) => {
    const $el = $(el);
    const trophyText = $el.text();

    // Get trophy icon from first td
    const iconImg = $el.find('td').first().find('img').first();
    const iconUrl = iconImg.attr('src') || '';

    // Get trophy name from the link in the second td (first link in the row wraps the icon)
    const nameTd = $el.find('td').eq(1);
    const nameEl = nameTd.find('a').first();
    const name = nameEl.text().trim();
    if (!name) return;

    // Trophy detail URL
    const trophyUrl = nameEl.attr('href') || '';

    // Description from em.text-gray
    const description = nameTd.find('em.text-gray').text().trim();

    // Rarity percentage from the last td
    const rarityTd = $el.find('td').last();
    const rarityMatch = rarityTd.text().match(/([\d.]+)%/);
    const rarity = rarityMatch ? parseFloat(rarityMatch[1]) : 0;

    // Rarity label
    const rarityLabels = ['极为珍贵', '非常珍贵', '珍贵', '一般', '普通'];
    let rarityLabel = '一般';
    for (const label of rarityLabels) {
      if (rarityTd.text().includes(label)) {
        rarityLabel = label;
        break;
      }
    }

    // Trophy type from first td class (t1=platinum, t2=gold, t3=silver, t4=bronze)
    // or from the name link class (text-platinum, text-gold, text-silver, text-bronze)
    const tdClass = $el.find('td').first().attr('class') || '';
    const linkClass = nameEl.attr('class') || '';
    let type: Trophy['type'] = 'bronze';
    if (/\bt1\b/.test(tdClass) || /text-platinum/.test(linkClass)) type = 'platinum';
    else if (/\bt2\b/.test(tdClass) || /text-gold/.test(linkClass)) type = 'gold';
    else if (/\bt3\b/.test(tdClass) || /text-silver/.test(linkClass)) type = 'silver';

    // Earned status: earned trophies have a date in the third td
    const earnedTd = $el.find('td').eq(2);
    const earned = earnedTd.find('em').length > 0 && earnedTd.text().trim().length > 0;

    trophies.push({
      id: `${gameId}-${i}`,
      name,
      description,
      iconUrl: absoluteUrl(iconUrl),
      type,
      rarity,
      rarityLabel,
      earned,
      url: trophyUrl ? absoluteUrl(trophyUrl) : undefined,
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
