import { getLiveMatch } from "@/lib/football-api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Trophy, Clock, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

export const revalidate = 30 // Revalidate every 30 seconds for live data

interface PageProps {
  params: {
    matchId: string
  }
}

export default async function MatchDetailsPage({ params }: PageProps) {
  const match = await getLiveMatch(params.matchId)

  if (!match) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/live">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Live Matches
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">Match not found</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/live">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Live Matches
          </Button>
        </Link>
        <div className="flex items-center gap-2 mb-2">
          <Trophy className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">{match.league_name}</h2>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-2">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              {/* Home Team */}
              <div className="flex flex-col items-center text-center space-y-3 flex-1">
                <div className="relative w-20 h-20">
                  <Image
                    src={match.team_home_badge || '/placeholder-team.png'}
                    alt={match.match_hometeam_name}
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-xl font-bold">{match.match_hometeam_name}</span>
              </div>

              {/* Score */}
              <div className="flex flex-col items-center px-8">
                <div className="text-4xl font-bold font-headline space-x-4">
                  <span>{match.match_hometeam_score}</span>
                  <span>-</span>
                  <span>{match.match_awayteam_score}</span>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <Clock className="w-4 h-4" />
                  <span>{match.match_time}&apos;</span>
                  <Badge variant="destructive" className="ml-2 animate-pulse">LIVE</Badge>
                </div>
              </div>

              {/* Away Team */}
              <div className="flex flex-col items-center text-center space-y-3 flex-1">
                <div className="relative w-20 h-20">
                  <Image
                    src={match.team_away_badge || '/placeholder-team.png'}
                    alt={match.match_awayteam_name}
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-xl font-bold">{match.match_awayteam_name}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Match Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Match Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {match.statistics ? (
              Object.entries(match.statistics).map(([key, value]: [string, any]) => (
                <div key={key}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{value.home}</span>
                    <span className="text-muted-foreground capitalize">
                      {key.replace(/_/g, ' ')}
                    </span>
                    <span>{value.away}</span>
                  </div>
                  <div className="flex h-2 bg-secondary">
                    <div
                      className="bg-primary"
                      style={{
                        width: (() => {
                          const home = parseInt(value.home || '0', 10) || 0;
                          const away = parseInt(value.away || '0', 10) || 0;
                          const total = home + away;
                          return total > 0 ? `${(home / total) * 100}%` : '50%';
                        })(),
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground">No statistics available</p>
            )}
          </CardContent>
        </Card>

        {/* Match Events */}
        <Card>
          <CardHeader>
            <CardTitle>Match Events</CardTitle>
          </CardHeader>
          <CardContent>
            {match.events ? (
              <div className="space-y-4">
                {match.events.map((event: any, index: number) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-12 text-center">
                      <span className="text-sm font-medium">{event.time}&apos;</span>
                    </div>
                    <div>
                      <p className="font-medium">{event.type}</p>
                      <p className="text-sm text-muted-foreground">{event.player}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">No events available</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}