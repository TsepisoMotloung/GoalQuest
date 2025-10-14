export interface Team {
  id: string;
  name: string;
  logoId: string;
}

export interface League {
  id: string;
  name: string;
}

export interface Player {
    name: string;
    position: string;
}

export interface Lineup {
    starting: Player[];
    substitutes: Player[];
}

export interface MatchEvent {
  minute: number;
  type: 'goal' | 'yellow-card' | 'red-card' | 'substitution';
  team: 'team1' | 'team2';
  player: string;
  detail?: string;
}

export interface Match {
  id: string;
  team1: Team;
  team2: Team;
  score1: number;
  score2: number;
  status: 'Live' | 'FT' | 'HT' | 'Upcoming';
  minute: number;
  league: League;
  venue: string;
  date: string;
  team1Lineup: Lineup;
  team2Lineup: Lineup;
  events: MatchEvent[];
}

export interface Highlight {
  id: string;
  title: string;
  thumbnail: string;
  league: string;
  date: string;
  matchId: string;
  embed: string;
}
