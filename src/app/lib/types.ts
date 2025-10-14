
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
  team1: Team;
  team2: Team;
  score1: number;
  score2: number;
  status: string;
  minute?: string;
  league: League;
  venue: string;
  date: string;
  embed: string;
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

// Based on Scorebat API
export interface ScoreBatHighlight {
    title: string;
    competition: string;
    competitionUrl: string;
    thumbnail: string;
    date: string;
    matchviewUrl: string;
    side1: { name: string, url: string, logo: string };
    side2: { name: string, url: string, logo: string };
    matchstatus: string;
    matchtime: string;
    videos: {
        title: string;
        embed: string;
    }[];
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


// API-Football Types
export interface APIFootballStanding {
  rank: number;
  team: {
    id: number;
    name: string;
    logo: string;
  };
  points: number;
  goalsDiff: number;
  all: {
    played: number;
    win: number;
    draw: number;
    lose: number;
  };
}

export interface APIFootballResponse<T> {
  response: T[];
}
