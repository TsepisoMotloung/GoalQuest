import { Card, CardContent } from '@/components/ui/card';
import { getLiveScores } from '@/lib/football-api';
import LiveMatchesClient from './live-matches-client';
import type { Match } from '@/lib/types';

// Revalidate the page every 30 seconds to keep live scores up to date
export const revalidate = 30;

export default async function LiveMatchesPage() {
  let liveMatches: Match[] = [];
  let error: string | null = null;

  try {
    liveMatches = await getLiveScores();
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load live matches';
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-headline text-4xl font-bold mb-2">Live Matches</h1>
        <p className="text-muted-foreground">Watch football matches happening right now</p>
      </div>

      {error ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-red-500">{error}</p>
          </CardContent>
        </Card>
      ) : liveMatches.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No live matches at the moment. Check back later!</p>
          </CardContent>
        </Card>
      ) : (
        <LiveMatchesClient matches={liveMatches} />
      )}
    </div>
  );
}
