import { useQuery } from '@tanstack/react-query';
import { fetchPage } from '../lib/scraper';
import { parseTrophyDetail } from '../lib/parsers/trophyDetail';

export function useTrophyDetail(trophyId: string) {
  return useQuery({
    queryKey: ['trophyDetail', trophyId],
    queryFn: async () => {
      const $ = await fetchPage(`/trophy/${trophyId}`);
      return parseTrophyDetail($, trophyId);
    },
    staleTime: 10 * 60 * 1000,
    enabled: !!trophyId,
  });
}
