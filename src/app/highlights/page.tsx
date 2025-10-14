
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getPlaceholderImage } from '@/lib/utils';
import { Clapperboard } from 'lucide-react';
import { getHighlights } from '@/lib/scorebat';
import { HighlightFilter } from './highlight-filter';

export default async function HighlightsPage({ searchParams }: { searchParams?: { league?: string } }) {
  const highlights = await getHighlights();
  const heroImage = getPlaceholderImage('hero-highlights');
  
  const allLeagues = [...new Set(highlights.map(h => h.league))];

  const selectedLeague = searchParams?.league || 'all';

  const filteredHighlights = highlights.filter(highlight => {
    return selectedLeague === 'all' || highlight.league === selectedLeague;
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
        <HighlightFilter leagues={allLeagues} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredHighlights.map(highlight => (
            <Link href={`/${highlight.matchId}`} key={highlight.id}>
              <Card className="overflow-hidden h-full flex flex-col group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <CardHeader className="p-0 relative">
                  <div className="aspect-video relative">
                    <Image
                      src={highlight.thumbnail}
                      alt={highlight.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      data-ai-hint="football highlight"
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
        ))}
      </div>
    </div>
  );
}
