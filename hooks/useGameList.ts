import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchPage } from '../lib/scraper';
import { parseGameList } from '../lib/parsers/gameList';
import type { PlatformFilter, SortOrder, DlcFilter } from '../lib/types';

interface GameListParams {
  psnId: string;
  platform: PlatformFilter;
  sort: SortOrder;
  dlc: DlcFilter;
}

export function useGameList({ psnId, platform, sort, dlc }: GameListParams) {
  return useInfiniteQuery({
    queryKey: ['gameList', psnId, platform, sort, dlc],
    queryFn: async ({ pageParam = 1 }) => {
      const params = new URLSearchParams();
      params.set('page', pageParam.toString());
      if (platform !== 'all') params.set('pf', platform);
      if (sort !== 'date') params.set('ob', sort);
      if (dlc !== 'all') params.set('dlc', dlc);

      const $ = await fetchPage(
        `/psnid/${psnId}/psngame?${params.toString()}`
      );
      return parseGameList($);
    },
    getNextPageParam: (lastPage) =>
      lastPage.currentPage < lastPage.totalPages
        ? lastPage.currentPage + 1
        : undefined,
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
    enabled: !!psnId,
  });
}
