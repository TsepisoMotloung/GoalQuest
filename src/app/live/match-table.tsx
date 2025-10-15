import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Clock, ChevronLeft, ChevronRight, Info } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface MatchTableProps {
  matches: any[]
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedLeague: string
  onLeagueChange: (league: string) => void
}

export function MatchTable({ 
  matches, 
  currentPage, 
  totalPages, 
  onPageChange,
  searchQuery,
  onSearchChange,
  selectedLeague,
  onLeagueChange
}: MatchTableProps) {
  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center gap-4 p-4 bg-card rounded-lg border">
        <div className="flex-1">
          <Input 
            placeholder="Search by team..."
            className="max-w-[300px]"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <Select 
          value={selectedLeague}
          onValueChange={onLeagueChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Leagues" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Leagues</SelectItem>
            <SelectItem value="premier-league">Premier League</SelectItem>
            <SelectItem value="la-liga">La Liga</SelectItem>
            <SelectItem value="bundesliga">Bundesliga</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Matches List */}
      <ScrollArea className="h-[600px] w-full rounded-lg border bg-background">
        <div className="divide-y divide-border">
          {matches.map((match) => (
            <Link 
              key={match.match_id} 
              href={`/live/${match.match_id}`}
              className="block"
            >
              <div className="grid grid-cols-[auto_1fr_auto_1fr_auto_auto] items-center gap-4 px-4 py-3 hover:bg-accent cursor-pointer transition-colors">
                {/* Match Status (FT/LIVE) */}
                <div className="w-12 text-sm font-medium text-muted-foreground">
                  {match.match_status === '90' ? 'FT' : (
                    <Badge variant="destructive" className="animate-pulse">
                      LIVE
                    </Badge>
                  )}
                </div>

                {/* Home Team */}
                <div className="flex items-center justify-end gap-2">
                  <span className="font-medium truncate text-right">
                    {match.match_hometeam_name}
                  </span>
                  <div className="relative w-6 h-6 flex-shrink-0">
                    <Image
                      src={match.team_home_badge || '/placeholder-team.png'}
                      alt={match.match_hometeam_name}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>

                {/* Score */}
                <div className="w-16 text-center tabular-nums font-semibold bg-accent/50 rounded-md py-1">
                  {match.match_hometeam_score} - {match.match_awayteam_score}
                </div>

                {/* Away Team */}
                <div className="flex items-center gap-2">
                  <div className="relative w-6 h-6 flex-shrink-0">
                    <Image
                      src={match.team_away_badge || '/placeholder-team.png'}
                      alt={match.match_awayteam_name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="font-medium truncate">
                    {match.match_awayteam_name}
                  </span>
                </div>

                {/* Match Time */}
                <div className="w-14 text-sm text-muted-foreground tabular-nums">
                  {match.match_status === '90' ? 
                    match.match_time :
                    `${match.match_time}'`
                  }
                </div>

                {/* Info Button */}
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Info className="h-4 w-4" />
                </Button>
              </div>
            </Link>
          ))}
        </div>
      </ScrollArea>

      {/* Pagination */}
      <div className="flex items-center justify-between p-4 bg-card rounded-lg border">
        <div className="text-sm text-muted-foreground">
          Showing {(currentPage - 1) * 10 + 1}-{Math.min(currentPage * 10, matches.length)} of {matches.length} matches
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Prev
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(page)}
                className="w-8"
              >
                {page}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  )
}