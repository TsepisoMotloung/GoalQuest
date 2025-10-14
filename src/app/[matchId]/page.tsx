
import { notFound } from 'next/navigation';
import Image from 'next/image';
import type { Metadata } from 'next';
import { getMatch } from '@/lib/scorebat';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Clock, MapPin, Trophy } from 'lucide-react';
import { PredictionTool } from './prediction-tool';
import type { Match } from '@/lib/types';


type Props = {
  params: { matchId: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  let match: Match | null = null;
  try {
     match = await getMatch(params.matchId);
  } catch(e) {
    // ignore
  }

  if (!match) {
    return {
      title: 'Match Not Found',
    };
  }

  return {
    title: `${match.team1.name} vs ${match.team2.name} - Live Score & Highlights | GoalQuest`,
    description: `Follow the live score, timeline, highlights, and predictions for the ${match.league.name} match between ${match.team1.name} and ${match.team2.name}.`,
  };
}

export default async function MatchPage({ params }: Props) {
  let match: Match | null = null;

  try {
     match = await getMatch(params.matchId);
  } catch(e) {
    console.error(e)
  }

  if (!match) {
    notFound();
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Scoreboard */}
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex justify-between items-center text-center">
                <div className="flex flex-col items-center gap-3 w-1/3">
                  <Image src={match.team1.logoUrl} alt={match.team1.name} width={80} height={80} className="rounded-full bg-muted" data-ai-hint="team logo" />
                  <h2 className="text-xl md:text-2xl font-bold font-headline">{match.team1.name}</h2>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-4xl md:text-6xl font-bold font-headline tracking-tighter">
                    {match.score1} - {match.score2}
                  </span>
                   {match.status === 'Live' ? (
                        <div className="flex flex-col items-center">
                            <Badge variant="destructive" className="animate-pulse">LIVE</Badge>
                            {match.minute && <span className="text-lg font-semibold text-muted-foreground">{match.minute}'</span>}
                        </div>
                    ) : (
                        <Badge variant="secondary" className="text-lg">{match.status}</Badge>
                    )}
                </div>
                <div className="flex flex-col items-center gap-3 w-1/3">
                  <Image src={match.team2.logoUrl} alt={match.team2.name} width={80} height={80} className="rounded-full bg-muted" data-ai-hint="team logo" />
                  <h2 className="text-xl md:text-2xl font-bold font-headline">{match.team2.name}</h2>
                </div>
              </div>
              <Separator className="my-6" />
              <div className="flex justify-around text-sm text-muted-foreground">
                  <div className="flex items-center gap-2"><Trophy className="w-4 h-4 text-primary"/><span>{match.league.name}</span></div>
                  {match.venue && <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary"/><span>{match.venue}</span></div>}
                  <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary"/><span>{new Date(match.date).toLocaleDateString()}</span></div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8 mt-8 lg:mt-0">
          {/* Video Highlights Embed */}
          <Card className="overflow-hidden group">
            <CardHeader>
              <CardTitle className="font-headline">Highlights</CardTitle>
            </CardHeader>
            <CardContent>
               {match.embed ? (
                <div
                  className="aspect-video [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:rounded-lg"
                  dangerouslySetInnerHTML={{ __html: match.embed }}
                />
              ) : (
                <div className="aspect-video w-full rounded-lg bg-muted flex items-center justify-center">
                  <p className="text-muted-foreground">No highlights available.</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Prediction Tool */}
          <PredictionTool match={match} />

        </div>
      </div>
    </div>
  );
}

