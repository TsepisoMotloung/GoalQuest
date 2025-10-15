


import axios from 'axios';
import type { Standing, Match } from './types';

const API_FOOTBALL_URL = 'https://apiv3.apifootball.com/';
const API_FOOTBALL_KEY = process.env.NEXT_PUBLIC_API_FOOTBALL_KEY || '';

// Map league names to apifootball.com league IDs (example IDs, update as needed)
const leagueIdMap: { [key: string]: string } = {
  'Premier League': '152',
  'La Liga': '302',
  'Serie A': '207',
  'Bundesliga': '175',
  'Ligue 1': '168',
};

const transformToStanding = (item: any, index: number): Standing => {
  return {
    rank: parseInt(item.overall_league_position, 10),
    team: {
      id: item.team_id,
      name: item.team_name,
      logoUrl: item.team_badge,
    },
    points: parseInt(item.overall_league_PTS, 10),
    played: parseInt(item.overall_league_payed, 10),
    win: parseInt(item.overall_league_W, 10),
    draw: parseInt(item.overall_league_D, 10),
    lose: parseInt(item.overall_league_L, 10),
    goalDifference: parseInt(item.overall_league_GF, 10) - parseInt(item.overall_league_GA, 10),
  };
};

export const getStandings = async (leagueName: string): Promise<Standing[]> => {
  const leagueId = leagueIdMap[leagueName];
  if (!leagueId) {
    console.error(`Invalid league name for API-Football: ${leagueName}`);
    return [];
  }
  if (!API_FOOTBALL_KEY) {
    console.error('API_FOOTBALL_KEY is not set. Returning empty array.');
    return [];
  }
  try {
    const response = await axios.get(API_FOOTBALL_URL, {
      params: {
        action: 'get_standings',
        league_id: leagueId,
        APIkey: API_FOOTBALL_KEY,
      },
    });
    if (Array.isArray(response.data)) {
      return response.data.map(transformToStanding);
    }
    return [];
  } catch (error) {
    console.error('Error fetching standings from apifootball.com:', error);
    return [];
  }
};

// Transform API Football match data to our Match type
const transformToMatch = (item: any): Match => {
  return {
    id: `match-${item.match_id}`,
    team1: {
      id: item.match_hometeam_id,
      name: item.match_hometeam_name,
      logoUrl: item.team_home_badge || `https://api.sofascore.app/api/v1/team/${item.match_hometeam_id}/logo`,
    },
    team2: {
      id: item.match_awayteam_id,
      name: item.match_awayteam_name,
      logoUrl: item.team_away_badge || `https://api.sofascore.app/api/v1/team/${item.match_awayteam_id}/logo`,
    },
    score1: parseInt(item.match_hometeam_score) || 0,
    score2: parseInt(item.match_awayteam_score) || 0,
    status: item.match_status === '90' ? 'Completed' : 
            item.match_live === '1' ? 'Live' : 
            'Scheduled',
    minute: item.match_status !== 'Finished' && item.match_status !== 'Scheduled' ? 
            item.match_status : undefined,
    league: {
      id: item.league_id,
      name: item.league_name,
    },
    venue: item.match_stadium || 'N/A',
    date: item.match_date,
    embed: '',  // API Football doesn't provide video embeds
  };
};

// Live scores
export const getLiveScores = async () => {
  if (!API_FOOTBALL_KEY) return [];
  try {
    const response = await axios.get(API_FOOTBALL_URL, {
      params: {
        action: 'get_events',
        match_live: 1,
        APIkey: API_FOOTBALL_KEY,
      },
    });

    if (!Array.isArray(response.data)) return [];
    
    return response.data.map(transformToMatch);
  } catch (error) {
    console.error('Error fetching live scores:', error);
    return [];
  }
};

// Fixtures (upcoming matches)
export const getFixtures = async (leagueName: string) => {
  const leagueId = leagueIdMap[leagueName];
  if (!leagueId || !API_FOOTBALL_KEY) return [];
  try {
    const response = await axios.get(API_FOOTBALL_URL, {
      params: {
        action: 'get_events',
        league_id: leagueId,
        from: new Date().toISOString().slice(0, 10),
        to: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        APIkey: API_FOOTBALL_KEY,
      },
    });
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching fixtures:', error);
    return [];
  }
};

// Get detailed information for a single match
export const getLiveMatch = async (matchId: string) => {
  if (!API_FOOTBALL_KEY) return null;
  try {
    const response = await axios.get(API_FOOTBALL_URL, {
      params: {
        action: 'get_events',
        match_id: matchId.replace('match-', ''),
        APIkey: API_FOOTBALL_KEY,
      },
    });

    if (!Array.isArray(response.data) || response.data.length === 0) {
      return null;
    }

    const match = response.data[0];

    // Transform statistics into a more structured format
    const statistics = match.statistics ? {
      possession: {
        home: match.statistics.find((s: any) => s.type === 'Possession')?.home || '0',
        away: match.statistics.find((s: any) => s.type === 'Possession')?.away || '0',
      },
      shots: {
        home: match.statistics.find((s: any) => s.type === 'Total Shots')?.home || '0',
        away: match.statistics.find((s: any) => s.type === 'Total Shots')?.away || '0',
      },
      shots_on_target: {
        home: match.statistics.find((s: any) => s.type === 'Shots on Goal')?.home || '0',
        away: match.statistics.find((s: any) => s.type === 'Shots on Goal')?.away || '0',
      },
      corners: {
        home: match.statistics.find((s: any) => s.type === 'Corner Kicks')?.home || '0',
        away: match.statistics.find((s: any) => s.type === 'Corner Kicks')?.away || '0',
      },
      fouls: {
        home: match.statistics.find((s: any) => s.type === 'Fouls')?.home || '0',
        away: match.statistics.find((s: any) => s.type === 'Fouls')?.away || '0',
      },
    } : null;

    // Transform events into a structured format
    const events = match.cards || match.goals ? [
      ...(match.cards || []).map((card: any) => ({
        time: card.time,
        type: `${card.card} Card`,
        player: card.player,
        team: card.home_fault ? match.match_hometeam_name : match.match_awayteam_name,
      })),
      ...(match.goals || []).map((goal: any) => ({
        time: goal.time,
        type: 'Goal',
        player: goal.scorer,
        assist: goal.assist,
        team: goal.home_scorer ? match.match_hometeam_name : match.match_awayteam_name,
      })),
    ].sort((a, b) => parseInt(a.time) - parseInt(b.time)) : null;

    return {
      ...match,
      statistics,
      events,
    };
  } catch (error) {
    console.error('Error fetching match details:', error);
    return null;
  }
};
