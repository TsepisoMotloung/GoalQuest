
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
  CardFooter,
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
import type { Match, NewsArticle } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { getNews } from '@/lib/news';
import { formatDistanceToNow } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { Newspaper, Search, CalendarDays } from 'lucide-react';


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

function FeaturedNews({ articles }: { articles: NewsArticle[] }) {
    if (articles.length === 0) {
        return (
             <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2">
                        <Newspaper className="text-primary"/>
                        Featured News
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">No news available right now.</p>
                </CardContent>
             </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <Newspaper className="text-primary"/>
                    Featured News
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {articles.slice(0, 2).map((article, index) => (
                    <div key={article.id}>
                        <Link href={article.url} target="_blank" rel="noopener noreferrer" className="group">
                             <div className="flex gap-4">
                                <div className="relative w-1/3 aspect-video rounded-md overflow-hidden">
                                     <Image src={article.imageUrl} alt={article.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" data-ai-hint={article.imageHint} />
                                </div>
                                <div className="w-2/3">
                                    <h3 className="font-semibold text-sm leading-snug group-hover:text-primary transition-colors">{article.title}</h3>
                                    <p className="text-xs text-muted-foreground mt-1">{formatDistanceToNow(new Date(article.date), { addSuffix: true })}</p>
                                </div>
                            </div>
                        </Link>
                         {index < 1 && <Separator className="mt-4"/>}
                    </div>
                ))}
            </CardContent>
             <CardFooter>
                <Link href="/news" className="text-sm font-semibold text-primary hover:underline">
                    Read more news &rarr;
                </Link>
            </CardFooter>
        </Card>
    )
}

function MatchList({ matches, title, loading }: { matches: Match[], title: string, loading: boolean }) {
    return (
        <>
            <h2 className="font-headline text-2xl font-bold mb-4">{title}</h2>
            <div className="overflow-x-auto rounded-lg border">
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
                            Array.from({ length: 3 }).map((_, i) => <MatchRowSkeleton key={i} />)
                        ) : matches.length > 0 ? (
                            matches.map(match => (
                                <TableRow key={match.id} className="hover:bg-primary/10 cursor-pointer">
                                    <TableCell>
                                        <Link href={`/${match.id}`} className="flex items-center gap-4 font-medium">
                                            <div className="flex items-center gap-2">
                                                <Image src={match.team1.logoUrl} alt={match.team1.name} width={24} height={24} className="rounded-full bg-muted" data-ai-hint="team logo" />
                                                <span>{match.team1.name}</span>
                                            </div>
                                            <span className="text-muted-foreground">vs</span>
                                            <div className="flex items-center gap-2">
                                                <Image src={match.team2.logoUrl} alt={match.team2.name} width={24} height={24} className="rounded-full bg-muted" data-ai-hint="team logo" />
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
        </>
    );
}

export default function Home() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLeague, setSelectedLeague] = useState('all');
  const [dateRange, setDateRange] = useState('7');
  const [leagues, setLeagues] = useState<string[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [fetchedMatches, fetchedNews] = await Promise.all([
          getMatches(),
          getNews()
      ]);
      setMatches(fetchedMatches);
      const uniqueLeagues = [...new Set(fetchedMatches.map(m => m.league.name))];
      setLeagues(uniqueLeagues);
      setNews(fetchedNews);
      setLoading(false);
    }
    fetchData();
  }, []);

  const filteredMatches = matches.filter(match => {
    const team1Name = match.team1.name.toLowerCase();
    const team2Name = match.team2.name.toLowerCase();
    const term = searchTerm.toLowerCase();
    const leagueFilter = selectedLeague === 'all' || match.league.name === selectedLeague;

    const matchDate = new Date(match.date);
    const today = new Date();
    const daysAgo = (today.getTime() - matchDate.getTime()) / (1000 * 3600 * 24);
    const dateFilter = dateRange === 'all' || daysAgo <= parseInt(dateRange);

    return (team1Name.includes(term) || team2Name.includes(term)) && leagueFilter && dateFilter;
  });

  const liveMatches = filteredMatches.filter(m => m.status === 'Live');
  const recentMatches = filteredMatches.filter(m => m.status !== 'Live');

  return (
    <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-xl">Match Filters</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by team..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={selectedLeague} onValueChange={setSelectedLeague} disabled={loading}>
                            <SelectTrigger>
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
                         <Select value={dateRange} onValueChange={setDateRange} disabled={loading}>
                            <SelectTrigger>
                                <div className="flex items-center gap-2">
                                     <CalendarDays className="h-4 w-4 text-muted-foreground" />
                                     <SelectValue placeholder="Filter by date" />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">Past 24 hours</SelectItem>
                                <SelectItem value="3">Past 3 days</SelectItem>
                                <SelectItem value="7">Past 7 days</SelectItem>
                                <SelectItem value="30">Past 30 days</SelectItem>
                                <SelectItem value="all">All time</SelectItem>
                            </SelectContent>
                        </Select>
                    </CardContent>
                </Card>

                {liveMatches.length > 0 && (
                    <MatchList matches={liveMatches} title="Live Matches" loading={loading} />
                )}

                <MatchList matches={recentMatches} title="Recent Results" loading={loading && liveMatches.length === 0} />

            </div>
            <div className="space-y-8 mt-8 lg:mt-0">
                <FeaturedNews articles={news} />
            </div>
        </div>
    </div>
  );
}

    
