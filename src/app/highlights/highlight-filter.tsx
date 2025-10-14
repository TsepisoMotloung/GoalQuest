'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function HighlightFilter({ leagues }: { leagues: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedLeague = searchParams.get('league') || 'all';

  const handleValueChange = (league: string) => {
    const params = new URLSearchParams(window.location.search);
    if (league === 'all') {
      params.delete('league');
    } else {
      params.set('league', league);
    }
    router.replace(`/highlights?${params.toString()}`);
  };

  return (
    <Select value={selectedLeague} onValueChange={handleValueChange}>
      <SelectTrigger className="w-full md:w-[200px]">
        <SelectValue placeholder="Filter by league" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Leagues</SelectItem>
        {leagues.map(league => (
          <SelectItem key={league} value={league}>
            {league}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
