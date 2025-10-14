import { notFound } from 'next/navigation';
import Image from 'next/image';
import type { Metadata } from 'next';
import { matches } from '@/app/lib/data';
import { getPlaceholderImage } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { PlayCircle, Clock, MapPin, Trophy, Users, Shirt, ArrowRightLeft } from 'lucide-react';
import { PredictionTool } from './prediction-tool';

type Props = {
  params: { matchId: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const match = matches.find(m => m.id === params.matchId);

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

function FutbolIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a4.5 4.5 0 0 0-4.5 4.5 4.5 4.5 0 0 0 4.5 4.5 4.5 4.5 0 0 0 4.5-4.5A4.5 4.5 0 0 0 12 2Z" />
      <path d="M12 2v1" />
      <path d="M12 11v1.5" />
      <path d="M12 22v-1" />
      <path d="M12 13.5V12" />
      <path d="M2.44 15.22 4.5 14" />
      <path d="M19.5 14l2.06 1.22" />
      <path d="M3.5 9.5 2 12l1.5 2.5" />
      <path d="M20.5 9.5 22 12l-1.5 2.5" />
      <path d="m9.75 4.04-.13.51" />
      <path d="m14.25 4.04.13.51" />
      <path d="M5.27 6.22 6.5 8" />
      <path d="m17.5 8 1.23-1.78" />
    </svg>
  );
}

const eventIcons = {
    'goal': <FutbolIcon className="w-5 h-5 text-green-500" />,
    'yellow-card': <div className="w-3 h-4 bg-yellow-400 rounded-sm" />,
    'red-card': <div className="w-3 h-4 bg-red-500 rounded-sm" />,
    'substitution': <ArrowRightLeft className="w-5 h-5 text-blue-500" />,
}

export default function MatchPage({ params }: Props) {
  const match = matches.find(m => m.id === params.matchId);

  if (!match) {
    notFound();
  }

  const team1Logo = getPlaceholderImage(match.team1.logoId);
  const team2Logo = getPlaceholderImage(match.team2.logoId);
  const videoThumbnail = getPlaceholderImage('highlight-thumb-1');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Scoreboard */}
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex justify-between items-center text-center">
                <div className="flex flex-col items-center gap-3 w-1/3">
                  <Image src={team1Logo.imageUrl} alt={team1Logo.description} width={80} height={80} className="rounded-full" data-ai-hint={team1Logo.imageHint} />
                  <h2 className="text-xl md:text-2xl font-bold font-headline">{match.team1.name}</h2>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-4xl md:text-6xl font-bold font-headline tracking-tighter">
                    {match.score1} - {match.score2}
                  </span>
                   {match.status === 'Live' ? (
                        <div className="flex flex-col items-center">
                            <Badge variant="destructive" className="animate-pulse">LIVE</Badge>
                            <span className="text-lg font-semibold text-muted-foreground">{match.minute}'</span>
                        </div>
                    ) : (
                        <Badge variant="secondary" className="text-lg">{match.status}</Badge>
                    )}
                </div>
                <div className="flex flex-col items-center gap-3 w-1/3">
                  <Image src={team2Logo.imageUrl} alt={team2Logo.description} width={80} height={80} className="rounded-full" data-ai-hint={team2Logo.imageHint} />
                  <h2 className="text-xl md:text-2xl font-bold font-headline">{match.team2.name}</h2>
                </div>
              </div>
              <Separator className="my-6" />
              <div className="flex justify-around text-sm text-muted-foreground">
                  <div className="flex items-center gap-2"><Trophy className="w-4 h-4 text-primary"/><span>{match.league.name}</span></div>
                  <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary"/><span>{match.venue}</span></div>
                  <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary"/><span>{new Date(match.date).toLocaleDateString()}</span></div>
              </div>
            </CardContent>
          </Card>

          {/* Event Timeline */}
          <Card>
            <CardHeader><CardTitle className="font-headline">Event Timeline</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-6">
                {match.events.sort((a,b) => b.minute - a.minute).map(event => (
                    <div key={`${event.minute}-${event.player}`} className="flex items-start gap-4">
                        <div className="flex flex-col items-center">
                            <span className="font-bold text-lg">{event.minute}'</span>
                            <div className="mt-1">{eventIcons[event.type]}</div>
                        </div>
                        <div className={`flex-1 pb-4 ${event.team === 'team1' ? 'text-left' : 'text-right'}`}>
                            <p className="font-semibold">{event.player}</p>
                            {event.detail && <p className="text-sm text-muted-foreground">{event.detail}</p>}
                        </div>
                    </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Lineups */}
          <Card>
             <CardHeader><CardTitle className="font-headline">Team Lineups</CardTitle></CardHeader>
             <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2"><Users className="w-5 h-5 text-primary"/>{match.team1.name}</h3>
                        <ul className="space-y-2 text-sm">
                            {match.team1Lineup.starting.map(p => <li key={p.name} className="flex items-center gap-2"><Shirt className="w-4 h-4 text-muted-foreground" />{p.name} ({p.position})</li>)}
                        </ul>
                         <Separator className="my-4"/>
                         <h4 className="font-semibold mb-2">Substitutes</h4>
                         <ul className="space-y-2 text-sm text-muted-foreground">
                            {match.team1Lineup.substitutes.map(p => <li key={p.name}>{p.name} ({p.position})</li>)}
                        </ul>
                    </div>
                     <div>
                        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2"><Users className="w-5 h-5 text-primary"/>{match.team2.name}</h3>
                        <ul className="space-y-2 text-sm">
                            {match.team2Lineup.starting.map(p => <li key={p.name} className="flex items-center gap-2"><Shirt className="w-4 h-4 text-muted-foreground" />{p.name} ({p.position})</li>)}
                        </ul>
                         <Separator className="my-4"/>
                         <h4 className="font-semibold mb-2">Substitutes</h4>
                         <ul className="space-y-2 text-sm text-muted-foreground">
                            {match.team2Lineup.substitutes.map(p => <li key={p.name}>{p.name} ({p.position})</li>)}
                        </ul>
                    </div>
                </div>
             </CardContent>
          </Card>

        </div>

        <div className="space-y-8 mt-8 lg:mt-0">
          {/* Video Highlights */}
          <Card className="overflow-hidden group">
            <CardHeader>
              <CardTitle className="font-headline">Highlights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video relative rounded-lg overflow-hidden cursor-pointer">
                <Image src={videoThumbnail.imageUrl} alt={videoThumbnail.description} fill className="object-cover group-hover:scale-105 transition-transform duration-300" data-ai-hint={videoThumbnail.imageHint} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <PlayCircle className="w-16 h-16 text-white/80 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
                </div>
                <div className="absolute bottom-2 left-4 text-white font-semibold">
                    <p>Watch all key moments</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Prediction Tool */}
          <PredictionTool match={match} />

        </div>
      </div>
    </div>
  );
}
