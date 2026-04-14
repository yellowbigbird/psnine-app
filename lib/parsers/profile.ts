import type { CheerioAPI } from 'cheerio';
import type { UserProfile, GameItem } from '../types';
import { absoluteUrl } from '../scraper';
import { parseGameCard } from './gameList';

export function parseProfile($: CheerioAPI): UserProfile {
  // Avatar
  const avatarUrl =
    $('div.psnava img').attr('src') ||
    $('img[onerror]').first().attr('src') ||
    '';

  // PSN ID
  const psnId =
    $('div.psninfo h1').text().trim() ||
    $('span.psnid').text().trim() ||
    $('title').text().split(' ')[0] || '';

  // Check Plus
  const isPlus = $('img[alt*="PLUS"], img[src*="plus"]').length > 0;

  // Stats - parse from the profile box area
  const statsText = $('div.box').first().text() || $('body').text();

  // Level - "Lv XXX"
  const levelMatch = statsText.match(/Lv\s*(\d+)/);
  const level = levelMatch ? parseInt(levelMatch[1]) : 0;

  // Level progress - "经验XX%"
  const progressMatch = statsText.match(/经验(\d+)%/);
  const levelProgress = progressMatch ? parseInt(progressMatch[1]) : 0;

  // Rank
  const rankMatch = statsText.match(/排名[^\d]*(\d+)|(\d+)\s*所在服排名/);
  const rank = rankMatch ? parseInt(rankMatch[1] || rankMatch[2]) : 0;

  // Trophies - "白XXX 金XXX 银XXX 铜XXX"
  const platinumMatch = statsText.match(/白(\d+)/);
  const goldMatch = statsText.match(/金(\d+)/);
  const silverMatch = statsText.match(/银(\d+)/);
  const bronzeMatch = statsText.match(/铜(\d+)/);

  const platinum = platinumMatch ? parseInt(platinumMatch[1]) : 0;
  const gold = goldMatch ? parseInt(goldMatch[1]) : 0;
  const silver = silverMatch ? parseInt(silverMatch[1]) : 0;
  const bronze = bronzeMatch ? parseInt(bronzeMatch[1]) : 0;

  // Total trophies
  const totalMatch = statsText.match(/(\d+)\s*总奖杯/);
  const total = totalMatch
    ? parseInt(totalMatch[1])
    : platinum + gold + silver + bronze;

  // Game stats
  const totalGamesMatch = statsText.match(/(\d+)\s*总游戏/);
  const totalGames = totalGamesMatch ? parseInt(totalGamesMatch[1]) : 0;

  const perfectMatch = statsText.match(/(\d+)\s*完美数/);
  const perfectGames = perfectMatch ? parseInt(perfectMatch[1]) : 0;

  const abandonedMatch = statsText.match(/(\d+)\s*坑数/);
  const abandonedGames = abandonedMatch ? parseInt(abandonedMatch[1]) : 0;

  const completionMatch = statsText.match(/([\d.]+)\s*完成率/);
  const completionRate = completionMatch ? parseFloat(completionMatch[1]) : 0;

  // Recent games
  const recentGames: GameItem[] = [];
  $('table.list tr, div.gamelist div.game, div.box table tbody tr').each(
    (i, el) => {
      if (i >= 10) return false;
      const game = parseGameCard($, el);
      if (game) recentGames.push(game);
    }
  );

  return {
    psnId,
    avatarUrl: absoluteUrl(avatarUrl),
    level,
    levelProgress,
    rank,
    isPlus,
    trophies: { platinum, gold, silver, bronze, total },
    totalGames,
    perfectGames,
    abandonedGames,
    completionRate,
    recentGames,
  };
}
