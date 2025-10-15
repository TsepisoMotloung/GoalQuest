
export interface Team {
  id: string;
  name: string;
  logoUrl: string;
}

export interface League {
  id: string;
  name: string;
}

export interface Match {
  id: string;
  team1: Team & {
    stats?: {
      possession?: number;
      shots?: number;
      shotsOnTarget?: number;
      corners?: number;
      fouls?: number;
      yellowCards?: number;
      redCards?: number;
    };
  };
  team2: Team & {
    stats?: {
      possession?: number;
      shots?: number;
      shotsOnTarget?: number;
      corners?: number;
      fouls?: number;
      yellowCards?: number;
      redCards?: number;
    };
  };
  score1: number;
  score2: number;
  status: 'Live' | 'Completed' | 'Scheduled' | 'Postponed' | 'Cancelled';
  minute?: string;
  league: League & {
    country?: string;
    logo?: string;
    season?: string;
  };
  venue: string;
  date: string;
  embed: string;
  events?: Array<{
    type: 'Goal' | 'YellowCard' | 'RedCard' | 'Substitution';
    minute: string;
    team: 'team1' | 'team2';
    player: string;
    additionalInfo?: string;
  }>;
  weather?: {
    temp?: number;
    condition?: string;
    humidity?: number;
    windSpeed?: number;
  };
  odds?: {
    team1Win: number;
    draw: number;
    team2Win: number;
  };
  referee?: string;
  attendance?: number;
}

export interface Highlight {
    id: string;
    title: string;
    thumbnail: string;
    league: string;
    date: string;
    matchId: string;
    embed: string;
    videos?: Array<{
        id: string;
        title: string;
        embed: string;
    }>;
}// Based on Scorebat API v3
export interface ScoreBatHighlight {
    title: string;
    competition: string;
    competitionUrl: string;
    matchviewUrl: string;
    thumbnail: string;
    date: string;
    videos: Array<{
        id: string;
        title: string;
        embed: string;
    }>;
}

export interface Standing {
  rank: number;
  team: Team;
  points: number;
  played: number;
  win: number;
  draw: number;
  lose: number;
  goalDifference: number;
}

export interface NewsArticle {
    id: string;
    title: string;
    source: string;
    date: string;
    imageUrl: string;
    imageHint: string;
    url: string;
    summary: string;
}


// football98 API Types
export interface Football98Standing {
  [teamName: string]: {
    Played: string;
    Winned: string;
    Drawn: string;
    Loosed: string;
    'Goal For': string;
    'Goal Against': string;
    'Goal Difference': string;
    Points: string;
  };
}

export interface Football98Response {
  Table: Football98Standing[];
}
