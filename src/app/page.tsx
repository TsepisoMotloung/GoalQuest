'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { getMatches } from '@/lib/scorebat';
import type { Match } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

function MatchRowSkeleton() {
  return (
    <TableRow>
      <TableCell className="w-2/5">
        <div className="flex items-center gap-4 font-medium">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-4 w-24" />
          <span className="text-muted-foreground">vs</span>
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
      </TableCell>
      <TableCell className="w-1/5 text-center"><Skeleton className="h-4 w-12 mx-auto" /></TableCell>
      <TableCell className="w-1/5 text-center"><Skeleton className="h-6 w-16 mx-auto" /></TableCell>
      <TableCell className="w-1/5 text-right"><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
    </TableRow>
  );
}


export default function Home() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLeague, setSelectedLeague] = useState('all');
  const [leagues, setLeagues] = useState<string[]>([]);

  useEffect(() => {
    async function fetchMatches() {
      setLoading(true);
      const fetchedMatches = await getMatches();
      setMatches(fetchedMatches);
      const uniqueLeagues = [...new Set(fetchedMatches.map(m => m.league.name))];
      setLeagues(uniqueLeagues);
      setLoading(false);
    }
    fetchMatches();
  }, []);

  const filteredMatches = matches.filter(match => {
    const team1Name = match.team1.name.toLowerCase();
    const team2Name = match.team2.name.toLowerCase();
    const term = searchTerm.toLowerCase();
    const leagueFilter = selectedLeague === 'all' || match.league.name === selectedLeague;

    return (team1Name.includes(term) || team2Name.includes(term)) && leagueFilter;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Live Match Feed</CardTitle>
          <CardDescription>Follow all the action from pitches around the world.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col gap-4 md:flex-row">
            <Input
              placeholder="Search by team..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Select value={selectedLeague} onValueChange={setSelectedLeague} disabled={loading}>
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
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-2/5">Match</TableHead>
                  <TableHead className="w-1/5 text-center">Score</TableHead>
                  <TableHead className="w-1/5 text-center">Status</TableHead>
                  <TableHead className="w-1/5 text-right">League</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <>
                    <MatchRowSkeleton />
                    <MatchRowSkeleton />
                    <MatchRowSkeleton />
                    <MatchRowSkeleton />
                    <MatchRowSkeleton />
                  </>
                ) : filteredMatches.length > 0 ? (
                  filteredMatches.map(match => (
                    <TableRow key={match.id} className="hover:bg-primary/10 cursor-pointer">
                      <TableCell>
                        <Link href={`/${match.id}`} className="flex items-center gap-4 font-medium">
                          <div className="flex items-center gap-2">
                            <Image src={match.team1.logoUrl} alt={match.team1.name} width={24} height={24} className="rounded-full bg-muted" data-ai-hint="team logo"/>
                            <span>{match.team1.name}</span>
                          </div>
                          <span className="text-muted-foreground">vs</span>
                          <div className="flex items-center gap-2">
                             <Image src={match.team2.logoUrl} alt={match.team2.name} width={24} height={24} className="rounded-full bg-muted" data-ai-hint="team logo"/>
                            <span>{match.team2.name}</span>
                          </div>
                        </Link>
                      </TableCell>
                      <TableCell className="text-center font-bold text-lg">
                        <Link href={`/${match.id}`}>
                           {match.score1} - {match.score2}
                        </Link>
                      </TableCell>
                      <TableCell className="text-center">
                        <Link href={`/${match.id}`}>
                          {match.status === 'Live' ? (
                            <div className="flex flex-col items-center">
                              <Badge variant="destructive" className="animate-pulse">LIVE</Badge>
                              {match.minute && <span className="text-sm text-muted-foreground">{match.minute}'</span>}
                            </div>
                          ) : (
                            <Badge variant="secondary">{match.status}</Badge>
                          )}
                        </Link>
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        <Link href={`/${match.id}`}>
                          {match.league.name}
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center h-24">
                      No matches found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
