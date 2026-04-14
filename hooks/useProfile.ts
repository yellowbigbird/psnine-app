import { useQuery } from '@tanstack/react-query';
import { fetchPage } from '../lib/scraper';
import { parseProfile } from '../lib/parsers/profile';

export function useProfile(psnId: string) {
  return useQuery({
    queryKey: ['profile', psnId],
    queryFn: async () => {
      const $ = await fetchPage(`/psnid/${psnId}`);
      return parseProfile($);
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!psnId,
  });
}
