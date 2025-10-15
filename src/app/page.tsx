'use client';

import React from 'react';
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
import { getLiveScores } from '@/lib/football-api';
import type { Match, NewsArticle } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { getNews } from '@/lib/news';
import { formatDistanceToNow } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { Newspaper, Search, CalendarDays, Trophy, CircleDot } from 'lucide-react';

const MatchRowSkeleton: React.FC = () => (
  <TableRow>
    <TableCell className="w-2/5">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
          <div className="flex flex-col gap-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        <span className="text-muted-foreground">vs</span>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
          <div className="flex flex-col gap-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </div>
    </TableCell>
    <TableCell className="w-1/5 text-center">
      <div className="flex flex-col items-center gap-1">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-3 w-20" />
      </div>
    </TableCell>
    <TableCell className="w-1/5 text-center">
      <div className="flex flex-col items-center gap-1">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-3 w-16" />
      </div>
    </TableCell>
    <TableCell className="w-1/5">
      <div className="flex flex-col items-end gap-1">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-16" />
      </div>
    </TableCell>
  </TableRow>
);

interface FeaturedNewsProps {
  articles: NewsArticle[];
}

const FeaturedNews: React.FC<FeaturedNewsProps> = ({ articles }) => {
  if (articles.length === 0) {
    return (
      <Card className="shadow-lg border-0">
        <CardHeader className="border-b bg-muted/30">
          <CardTitle className="font-headline flex items-center gap-2">
            <Newspaper className="text-primary"/>
            Featured News
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-muted-foreground">No news available right now.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="border-b bg-muted/30">
        <CardTitle className="font-headline flex items-center gap-2">
          <Newspaper className="text-primary"/>
          Featured News
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        {articles.slice(0, 2).map((article, index) => (
          <div key={article.id} className="group">
            <Link href={article.url} target="_blank" rel="noopener noreferrer">
              <div className="flex gap-4">
                <div className="relative w-1/3 aspect-video rounded-lg overflow-hidden shadow-md">
                  <Image 
                    src={article.imageUrl} 
                    alt={article.title} 
                    fill 
                    className="object-cover transition-transform duration-300 group-hover:scale-105" 
                    data-ai-hint={article.imageHint} 
                  />
                </div>
                <div className="w-2/3">
                  <h3 className="font-semibold text-sm leading-snug group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(article.date), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </Link>
            {index < 1 && <Separator className="mt-4"/>}
          </div>
        ))}
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Link href="/news" className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
          Read more news &rarr;
        </Link>
      </CardFooter>
    </Card>
  );
};

interface MatchListProps {
  matches: Match[];
  title: string;
  loading: boolean;
}

const MatchList: React.FC<MatchListProps> = ({ matches, title, loading }) => {
  return (
    <>
      <h2 className="font-headline text-2xl font-bold mb-4 flex items-center gap-2">
        {title === "Live Matches" ? (
          <>
            <span className="inline-block w-3 h-3 rounded-full bg-destructive animate-pulse"></span>
            <CircleDot className="h-6 w-6 text-primary" />
          </>
        ) : (
          <Trophy className="h-6 w-6 text-primary" />
        )}
        {title} {matches.length > 0 && <span className="text-sm text-muted-foreground ml-2">({matches.length})</span>}
      </h2>
      <div className="overflow-x-auto rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted hover:bg-muted">
              <TableHead className="w-[100px]">Time</TableHead>
              <TableHead>Match</TableHead>
              <TableHead className="w-[200px] text-right">Info</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => <MatchRowSkeleton key={i} />)
            ) : matches.length > 0 ? (
              matches.map(match => (
                <TableRow key={match.id} className="match-card group hover:bg-muted/50">
                  {/* Status/Time Column */}
                  <TableCell className="w-[100px]">
                    <Link href={`/${match.id}`}>
                      {match.status === 'Live' ? (
                        <div className="flex flex-col items-center gap-1">
                          <Badge variant="destructive" className="animate-pulse whitespace-nowrap">LIVE</Badge>
                          {match.minute && (
                            <span className="text-sm font-medium tabular-nums">{match.minute}'</span>
                          )}
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground tabular-nums text-center">
                          {new Date(match.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      )}
                    </Link>
                  </TableCell>

                  {/* Teams and Score Column */}
                  <TableCell>
                    <Link href={`/${match.id}`} className="flex items-center gap-4">
                      {/* Home Team */}
                      <div className="flex items-center justify-end gap-3 flex-1">
                        <span className="font-medium">{match.team1.name}</span>
                        <div className="relative">
                          <Image 
                            src={match.team1.logoUrl} 
                            alt={match.team1.name} 
                            width={24} 
                            height={24} 
                            className="team-logo rounded-full bg-background border" 
                          />
                          {match.team1.stats?.yellowCards && match.team1.stats.yellowCards > 0 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full text-[10px] flex items-center justify-center border border-background">
                              {match.team1.stats.yellowCards}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Score */}
                      <div className="w-[90px] text-center">
                        <span className="inline-block px-3 py-1 bg-accent rounded font-medium tabular-nums">
                          {match.score1} - {match.score2}
                        </span>
                      </div>

                      {/* Away Team */}
                      <div className="flex items-center gap-3 flex-1">
                        <div className="relative">
                          <Image 
                            src={match.team2.logoUrl} 
                            alt={match.team2.name} 
                            width={24} 
                            height={24} 
                            className="team-logo rounded-full bg-background border" 
                          />
                          {match.team2.stats?.yellowCards && match.team2.stats.yellowCards > 0 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full text-[10px] flex items-center justify-center border border-background">
                              {match.team2.stats.yellowCards}
                            </span>
                          )}
                        </div>
                        <span className="font-medium">{match.team2.name}</span>
                      </div>
                    </Link>
                  </TableCell>

                  {/* Info Column */}
                  <TableCell className="text-right w-[200px]">
                    <Link href={`/${match.id}`}>
                      <div className="flex flex-col items-end gap-1">
                        <Badge variant="outline" className="font-normal group-hover:border-primary">
                          {match.league.name}
                        </Badge>
                        {match.venue && (
                          <span className="text-xs text-muted-foreground">{match.venue}</span>
                        )}
                        {(match.team1.stats?.shots || match.team2.stats?.shots) && (
                          <span className="text-xs text-muted-foreground">
                            Shots: {match.team1.stats?.shots || 0}-{match.team2.stats?.shots || 0}
                          </span>
                        )}
                      </div>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center h-24">
                  <p className="text-muted-foreground">No matches found.</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

const Home: React.FC = () => {
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
      try {
        const [fetchedMatches, fetchedNews] = await Promise.all([
          getLiveScores(),
          getNews()
        ]);
        setMatches(fetchedMatches);
        const uniqueLeagues = [...new Set(fetchedMatches.map(m => m.league.name))];
        setLeagues(uniqueLeagues);
        setNews(fetchedNews);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();

    // Refresh live scores every minute
    const interval = setInterval(async () => {
      try {
        const fetchedMatches = await getLiveScores();
        setMatches(fetchedMatches);
      } catch (error) {
        console.error('Error refreshing scores:', error);
      }
    }, 60000);

    return () => clearInterval(interval);
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
    <main className="min-h-screen bg-background">
      <div className="hero-pattern py-16 mb-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Live Football
            <span className="text-primary-foreground"> Updates</span>
          </h1>
          <p className="text-gray-200 text-lg max-w-2xl">
            Real-time scores, highlights, and news from football matches around the world.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-border">
              <CardHeader className="border-b">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Search className="h-5 w-5 text-muted-foreground" />
                  Match Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6">
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
    </main>
  );
};

export default Home;      