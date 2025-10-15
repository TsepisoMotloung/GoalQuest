
import { notFound } from 'next/navigation';
import Image from 'next/image';
import type { Metadata } from 'next';
import { getMatch as getScorebatMatch } from '@/lib/scorebat';
import { getLiveMatch as getFootballLiveMatch } from '@/lib/football-api';
import { Match as RawMatch } from '@/lib/types';

// Normalizes the football-api live match response into our Match type
function normalizeFootballMatch(raw: any): RawMatch {
  const team1 = {
    id: raw.match_hometeam_id ? String(raw.match_hometeam_id) : 'team1',
    name: raw.match_hometeam_name || raw.home_team || 'Home',
    logoUrl: raw.team_home_badge || `https://via.placeholder.com/50?text=${raw.match_hometeam_name?.charAt(0) || 'H'}`,
  };

  const team2 = {
    id: raw.match_awayteam_id ? String(raw.match_awayteam_id) : 'team2',
    name: raw.match_awayteam_name || raw.away_team || 'Away',
    logoUrl: raw.team_away_badge || `https://via.placeholder.com/50?text=${raw.match_awayteam_name?.charAt(0) || 'A'}`,
  };

  // Convert statistics to the expected format
  const statsForTeam = (side: 'home' | 'away') => {
    return {
      possession: 50, // Default to 50-50 possession if not available
      shots: parseInt(side === 'home' ? raw.match_hometeam_ft_score || '0' : raw.match_awayteam_ft_score || '0'),
      shotsOnTarget: parseInt(side === 'home' ? raw.match_hometeam_score || '0' : raw.match_awayteam_score || '0'),
      corners: 0,
      fouls: 0,
      yellowCards: (raw.cards || []).filter((c: any) => 
        (side === 'home' ? c.home_fault : !c.home_fault) && c.card === 'yellow'
      ).length,
      redCards: (raw.cards || []).filter((c: any) => 
        (side === 'home' ? c.home_fault : !c.home_fault) && c.card === 'red'
      ).length,
    };
  };

  const events = raw.events || raw.goals || raw.cards ? [
    ...(raw.cards || []).map((card: any) => ({
      type: card.card === 'yellow' ? 'YellowCard' : 'RedCard',
      minute: card.time,
      team: card.home_fault ? 'team1' : 'team2',
      player: card.player,
    })),
    ...(raw.goals || []).map((goal: any) => ({
      type: 'Goal',
      minute: goal.time,
      team: goal.home_scorer ? 'team1' : 'team2',
      player: goal.scorer,
      additionalInfo: goal.assist || undefined,
    })),
  ].sort((a: any, b: any) => parseInt(a.minute) - parseInt(b.minute)) : undefined;

  return {
    id: raw.match_id ? `match-${raw.match_id}` : raw.id || `match-${Date.now()}`,
    team1: { ...team1, stats: statsForTeam('home') },
    team2: { ...team2, stats: statsForTeam('away') },
    score1: parseInt(raw.match_hometeam_score) || 0,
    score2: parseInt(raw.match_awayteam_score) || 0,
    status: raw.match_live === '1' ? 'Live' : (raw.match_status === 'Finished' || raw.match_status === '90' ? 'Completed' : 'Scheduled'),
    minute: raw.match_status && raw.match_status !== 'Finished' ? String(raw.match_status) : undefined,
    league: { id: raw.league_id || 'league-unknown', name: raw.league_name || raw.competition || 'Unknown' },
    venue: raw.match_stadium || raw.venue || 'N/A',
    date: raw.match_date || new Date().toISOString(),
    embed: '',
    events,
  } as RawMatch;
}
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Clock, MapPin, Trophy, Goal, Flag, CreditCard as CardIcon } from 'lucide-react';
import { PredictionTool } from './prediction-tool';
import type { Match } from '@/lib/types';


type Props = {
  params: { matchId: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { matchId } = params;
  let match: Match | null = null;
  try {
    match = await getScorebatMatch(matchId);
  } catch(e) {
    console.error('ScoreBat fetch error:', e);
  }

  // Fallback: try football API when Scorebat doesn't have the match
  if (!match) {
    try {
      const raw = await getFootballLiveMatch(matchId.replace('match-', ''));
      if (raw) {
        match = normalizeFootballMatch(raw);
      }
    } catch (e) {
      console.error('Football API fetch error:', e);
    }
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
  const { matchId } = params;
  let match: Match | null = null;

  try {
    match = await getScorebatMatch(matchId);
  } catch(e) {
    console.error('ScoreBat fetch error:', e);
  }
 
  if (!match) {
    // Try football API as a fallback for matches coming from the live feed
    try {
      const raw = await getFootballLiveMatch(matchId.replace('match-', ''));
      if (raw) {
        match = normalizeFootballMatch(raw);
      }
    } catch (e) {
      console.error('football-api fallback error', e);
    }
  }  if (!match) {
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

