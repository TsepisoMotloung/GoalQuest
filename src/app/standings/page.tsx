
'use client';

import { useState, useEffect } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { leagues } from '@/app/lib/data';
import type { Standing } from '@/app/lib/types';
import { Medal } from 'lucide-react';
import { getStandings } from '@/lib/football-api';
import { Skeleton } from '@/components/ui/skeleton';


function StandingsRowSkeleton() {
  return (
    <TableRow>
      <TableCell><Skeleton className="h-4 w-4" /></TableCell>
      <TableCell>
        <div className="flex items-center gap-4 font-medium">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>
      </TableCell>
      <TableCell><Skeleton className="h-4 w-6 mx-auto" /></TableCell>
      <TableCell><Skeleton className="h-4 w-6 mx-auto" /></TableCell>
      <TableCell><Skeleton className="h-4 w-6 mx-auto" /></TableCell>
      <TableCell><Skeleton className="h-4 w-6 mx-auto" /></TableCell>
      <TableCell><Skeleton className="h-4 w-6 mx-auto" /></TableCell>
      <TableCell><Skeleton className="h-4 w-8 mx-auto" /></TableCell>
    </TableRow>
  );
}


export default function StandingsPage() {
  const [selectedLeague, setSelectedLeague] = useState(leagues[0].id);
  const [standings, setStandings] = useState<Standing[]>([]);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(new Date().getFullYear().toString());


  useEffect(() => {
    async function fetchStandings() {
      setLoading(true);
      const fetchedStandings = await getStandings(selectedLeague, year);
      setStandings(fetchedStandings);
      setLoading(false);
    }
    fetchStandings();
  }, [selectedLeague, year]);

  const handleLeagueChange = (leagueId: string) => {
    setSelectedLeague(leagueId);
  };
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="font-headline text-3xl flex items-center gap-2">
                <Medal className="text-primary" />
                League Standings
              </CardTitle>
              <CardDescription>View the current and past tables for top leagues.</CardDescription>
            </div>
            <div className="flex gap-2">
                 <Select value={year} onValueChange={setYear}>
                    <SelectTrigger className="w-full md:w-[120px]">
                        <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                        {years.map(y => (
                        <SelectItem key={y} value={y.toString()}>
                            {y}
                        </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select value={selectedLeague} onValueChange={handleLeagueChange}>
                <SelectTrigger className="w-full md:w-[240px]">
                    <SelectValue placeholder="Select a league" />
                </SelectTrigger>
                <SelectContent>
                    {leagues.map(league => (
                    <SelectItem key={league.id} value={league.id}>
                        {league.name}
                    </SelectItem>
                    ))}
                </SelectContent>
                </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/12 text-center">#</TableHead>
                  <TableHead className="w-5/12">Team</TableHead>
                  <TableHead className="w-1/12 text-center">P</TableHead>
                  <TableHead className="w-1/12 text-center">W</TableHead>
                  <TableHead className="w-1/12 text-center">D</TableHead>
                  <TableHead className="w-1/12 text-center">L</TableHead>
                  <TableHead className="w-1/12 text-center">GD</TableHead>
                  <TableHead className="w-1/12 text-center font-bold">Pts</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                    Array.from({length: 10}).map((_, i) => <StandingsRowSkeleton key={i} />)
                ) : standings.length > 0 ? (
                  standings.map(standing => (
                    <TableRow key={standing.rank}>
                      <TableCell className="text-center font-medium">{standing.rank}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-4 font-medium">
                          <Image src={standing.team.logoUrl} alt={standing.team.name} width={24} height={24} className="rounded-full bg-muted" data-ai-hint="team logo" />
                          <span>{standing.team.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{standing.played}</TableCell>
                      <TableCell className="text-center">{standing.win}</TableCell>
                      <TableCell className="text-center">{standing.draw}</TableCell>
                      <TableCell className="text-center">{standing.lose}</TableCell>
                      <TableCell className="text-center">{standing.goalDifference}</TableCell>
                      <TableCell className="text-center font-bold">{standing.points}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center h-24">
                      Standings for this league and season are not available yet.
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
