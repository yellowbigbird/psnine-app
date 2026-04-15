import type { CheerioAPI } from 'cheerio';
import type { AnyNode } from 'domhandler';
import type { GameItem, GameListResult } from '../types';
import { absoluteUrl } from '../scraper';

export function parseGameCard(
  $: CheerioAPI,
  el: AnyNode
): GameItem | null {
  const $el = $(el);
  const text = $el.text();

  // Find game link — skip the image-only link, find one with text
  const allLinks = $el.find('a[href*="/psngame/"]');
  let link = allLinks.first();
  let title = '';
  allLinks.each((_, a) => {
    const t = $(a).text().trim();
    if (t && !title) {
      link = $(a);
      title = t;
    }
  });
  const href = link.attr('href') || '';
  const idMatch = href.match(/\/psngame\/(\d+)/);
  if (!idMatch) return null;

  const id = idMatch[1];
  if (!title) {
    title = $el.find('.title, .gamename').text().trim() || '';
  }
  if (!title) return null;

  // Thumbnail
  const img = $el.find('img').first();
  const thumbnailUrl = absoluteUrl(
    img.attr('src') || img.attr('data-src') || ''
  );

  // Platform
  const platforms: string[] = [];
  const platformText = text;
  if (/PS5/.test(platformText)) platforms.push('PS5');
  if (/PS4/.test(platformText)) platforms.push('PS4');
  if (/PS3/.test(platformText)) platforms.push('PS3');
  if (/PSV|Vita/.test(platformText)) platforms.push('PSV');

  // Last played date
  const dateMatch = text.match(
    /(\d{4}-\d{2}-\d{2}\s*\d{2}:\d{2}:\d{2}|\d{4}-\d{2}-\d{2})/
  );
  const lastPlayed = dateMatch ? dateMatch[1] : '';

  // Difficulty
  const difficultyMatch = text.match(/(极易|容易|普通|困难|极难|地狱)/);
  const difficulty = difficultyMatch ? difficultyMatch[1] : undefined;

  // Completion rate - match percentage NOT followed by 完美 (which is the perfect rate)
  const completionMatch = text.match(/([\d.]+)%(?!\s*完美)/);
  let completionRate = completionMatch
    ? parseFloat(completionMatch[1])
    : 0;

  // Perfect rate
  const perfectRateMatch = text.match(/([\d.]+)%\s*完美/);
  const perfectRate = perfectRateMatch ? perfectRateMatch[1] + '%' : undefined;

  // Trophies
  const platMatch = text.match(/白(\d+)/);
  const goldMatch = text.match(/金(\d+)/);
  const silverMatch = text.match(/银(\d+)/);
  const bronzeMatch = text.match(/铜(\d+)/);

  const trophies = {
    platinum: platMatch ? parseInt(platMatch[1]) : 0,
    gold: goldMatch ? parseInt(goldMatch[1]) : 0,
    silver: silverMatch ? parseInt(silverMatch[1]) : 0,
    bronze: bronzeMatch ? parseInt(bronzeMatch[1]) : 0,
  };

  const earnedTrophies =
    trophies.platinum + trophies.gold + trophies.silver + trophies.bronze;

  // Total trophies from progress fraction
  const fractionMatch = text.match(/(\d+)\/(\d+)/);
  const totalTrophies = fractionMatch
    ? parseInt(fractionMatch[2])
    : earnedTrophies;

  // If no explicit completion rate found, calculate from fraction
  if (!completionRate && fractionMatch) {
    const earned = parseInt(fractionMatch[1]);
    const total = parseInt(fractionMatch[2]);
    if (total > 0) {
      completionRate = Math.round((earned / total) * 1000) / 10;
    }
  }

  return {
    id,
    title,
    thumbnailUrl,
    platform: platforms,
    lastPlayed,
    difficulty,
    completionRate,
    perfectRate,
    trophies,
    earnedTrophies,
    totalTrophies,
  };
}

export function parseGameList($: CheerioAPI): GameListResult {
  const games: GameItem[] = [];

  // Try multiple selectors for game rows
  const selectors = [
    'table.list tr',
    'table.list tbody tr',
    'div.box table tr',
    'table tbody tr',
  ];

  for (const selector of selectors) {
    $(selector).each((_, el) => {
      const game = parseGameCard($, el);
      if (game) games.push(game);
    });
    if (games.length > 0) break;
  }

  // Parse pagination
  const totalText = $('div.page, div.page ul').text();
  const totalMatch = totalText.match(/(\d+)条/);
  const totalGames = totalMatch ? parseInt(totalMatch[1]) : games.length;

  // Current page from active pagination button
  const currentPage = parseInt($('div.page li.current a, a.page.current, li.active a').text()) || 1;

  // Total pages
  const pageLinks = $('a[href*="page="]');
  let maxPage = 1;
  pageLinks.each((_, el) => {
    const href = $(el).attr('href') || '';
    const pageMatch = href.match(/page=(\d+)/);
    if (pageMatch) {
      maxPage = Math.max(maxPage, parseInt(pageMatch[1]));
    }
  });

  return {
    games,
    currentPage,
    totalPages: maxPage,
    totalGames,
  };
}
