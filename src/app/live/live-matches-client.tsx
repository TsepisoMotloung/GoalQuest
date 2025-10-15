'use client';

import { useState, useEffect, useMemo } from 'react';
import { MatchTable } from './match-table';
import { useDebounce } from '@/hooks/use-debounce';
import type { Match } from '@/lib/types';

const MATCHES_PER_PAGE = 10;

interface LiveMatchesClientProps {
  matches: Match[];
}

export default function LiveMatchesClient({ matches }: LiveMatchesClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeague, setSelectedLeague] = useState('all');
  
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Map the shared Match type into the legacy client-side shape expected by this component
  const legacyMatches = matches.map(m => ({
    match_id: m.id.replace('match-', ''),
    league_name: m.league?.name || '',
    match_hometeam_name: m.team1?.name || m.team1?.id || 'Home',
    match_awayteam_name: m.team2?.name || m.team2?.id || 'Away',
    match_hometeam_score: String(m.score1 ?? 0),
    match_awayteam_score: String(m.score2 ?? 0),
    match_time: m.minute || '',
    match_status: m.status || '',
    team_home_badge: m.team1?.logoUrl || '/placeholder-team.png',
    team_away_badge: m.team2?.logoUrl || '/placeholder-team.png',
  }));

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, selectedLeague]);

  // Filter matches based on search and league selection
  const filteredMatches = useMemo(() => {
    return legacyMatches.filter(match => {
      const matchesSearch = debouncedSearch === '' || 
        match.match_hometeam_name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        match.match_awayteam_name.toLowerCase().includes(debouncedSearch.toLowerCase());

      const matchesLeague = selectedLeague === 'all' || 
        match.league_name.toLowerCase().includes(selectedLeague.toLowerCase());

      return matchesSearch && matchesLeague;
    });
  }, [legacyMatches, debouncedSearch, selectedLeague]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredMatches.length / MATCHES_PER_PAGE);
  const startIndex = (currentPage - 1) * MATCHES_PER_PAGE;
  const endIndex = startIndex + MATCHES_PER_PAGE;
  const currentMatches = filteredMatches.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <MatchTable
      matches={currentMatches}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      selectedLeague={selectedLeague}
      onLeagueChange={setSelectedLeague}
    />
  );
}