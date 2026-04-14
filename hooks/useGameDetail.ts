import { useQuery } from '@tanstack/react-query';
import { fetchPage } from '../lib/scraper';
import { parseGameDetail } from '../lib/parsers/gameDetail';

export function useGameDetail(gameId: string, psnId: string) {
  return useQuery({
    queryKey: ['gameDetail', gameId, psnId],
    queryFn: async () => {
      const $ = await fetchPage(`/psngame/${gameId}?psnid=${psnId}`);
      return parseGameDetail($, gameId);
    },
    staleTime: 10 * 60 * 1000,
    enabled: !!gameId && !!psnId,
  });
}
