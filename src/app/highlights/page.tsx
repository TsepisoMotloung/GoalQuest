'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { highlights, leagues } from '@/app/lib/data';
import { getPlaceholderImage } from '@/lib/utils';
import { Clapperboard } from 'lucide-react';

export default function HighlightsPage() {
  const [selectedLeague, setSelectedLeague] = useState('all');
  const heroImage = getPlaceholderImage('hero-highlights');

  const filteredHighlights = highlights.filter(highlight => {
    const leagueMatch = leagues.find(l => l.name === highlight.league);
    return selectedLeague === 'all' || leagueMatch?.id === selectedLeague;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative mb-8 w-full h-64 md:h-80 rounded-2xl overflow-hidden shadow-2xl">
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          className="object-cover"
          data-ai-hint={heroImage.imageHint}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8">
          <h1 className="font-headline text-4xl md:text-6xl font-bold text-white shadow-xl">
            Latest Highlights
          </h1>
          <p className="text-lg text-white/90 mt-2">
            Catch up on all the goals and key moments.
          </p>
        </div>
      </div>

      <div className="mb-6 flex justify-end">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredHighlights.map(highlight => {
          const thumbnail = getPlaceholderImage(highlight.thumbnailId);
          return (
            <Link href={`/${highlight.matchId}`} key={highlight.id}>
              <Card className="overflow-hidden h-full flex flex-col group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <CardHeader className="p-0 relative">
                  <div className="aspect-video relative">
                    <Image
                      src={thumbnail.imageUrl}
                      alt={thumbnail.description}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      data-ai-hint={thumbnail.imageHint}
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                    <div className="absolute top-2 right-2 bg-primary/80 text-primary-foreground rounded-full p-2 backdrop-blur-sm">
                        <Clapperboard className="w-5 h-5"/>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 p-4">
                  <CardTitle className="text-lg font-semibold leading-snug group-hover:text-primary transition-colors">
                    {highlight.title}
                  </CardTitle>
                </CardContent>
                <CardFooter className="p-4 pt-0 text-sm text-muted-foreground flex justify-between">
                  <span>{highlight.league}</span>
                  <span>{new Date(highlight.date).toLocaleDateString()}</span>
                </CardFooter>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
