'use client';

import { useState } from 'react';
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
import { matches, leagues } from '@/app/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLeague, setSelectedLeague] = useState('all');

  const filteredMatches = matches.filter(match => {
    const team1Name = match.team1.name.toLowerCase();
    const team2Name = match.team2.name.toLowerCase();
    const term = searchTerm.toLowerCase();
    const leagueFilter = selectedLeague === 'all' || match.league.id === selectedLeague;

    return (team1Name.includes(term) || team2Name.includes(term)) && leagueFilter;
  });

  const getTeamLogo = (logoId: string) => {
    return PlaceHolderImages.find(img => img.id === logoId)?.imageUrl || 'https://picsum.photos/seed/placeholder/40/40';
  };

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
            <Select value={selectedLeague} onValueChange={setSelectedLeague}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by league" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Leagues</SelectItem>
                {leagues.map(league => (
                  <SelectItem key={league.id} value={league.id}>
                    {league.name}
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
                {filteredMatches.length > 0 ? (
                  filteredMatches.map(match => (
                    <TableRow key={match.id} className="hover:bg-primary/10 cursor-pointer">
                      <TableCell>
                        <Link href={`/${match.id}`} className="flex items-center gap-4 font-medium">
                          <div className="flex items-center gap-2">
                            <Image src={getTeamLogo(match.team1.logoId)} alt={match.team1.name} width={24} height={24} className="rounded-full" data-ai-hint="team logo"/>
                            <span>{match.team1.name}</span>
                          </div>
                          <span className="text-muted-foreground">vs</span>
                          <div className="flex items-center gap-2">
                             <Image src={getTeamLogo(match.team2.logoId)} alt={match.team2.name} width={24} height={24} className="rounded-full" data-ai-hint="team logo"/>
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
                              <span className="text-sm text-muted-foreground">{match.minute}'</span>
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
