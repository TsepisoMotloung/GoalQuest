import axios from 'axios';
import type { Highlight, Match, ScoreBatHighlight } from './types';

const SCOREBAT_API_URL = 'https://www.scorebat.com/video-api/v3/feed/';

const transformToHighlight = (item: ScoreBatHighlight): Highlight => {
    const matchId = item.matchviewUrl.split('/')[4] || `match-${item.title.replace(/\s/g, '-')}`;
    
    return {
        id: `hl-${matchId}-${item.title.replace(/\s/g, '-')}`,
        title: item.title,
        thumbnail: item.thumbnail,
        league: item.competition,
        date: item.date,
        matchId: matchId,
        embed: item.videos[0]?.embed || '',
    };
};

const transformToMatch = (item: ScoreBatHighlight): Match => {
    const matchId = item.matchviewUrl.split('/')[4] || `match-${item.title.replace(/\s/g, '-')}`;
    const [team1Name, team2Name] = item.title.split(' - ');
    const [score1, score2] = item.side2.name.includes('vs') ? ['0', '0'] : item.side2.name.split(' - ');
    
    return {
      id: matchId,
      team1: {
        id: item.side1.name.toLowerCase().replace(/\s/g, '-'),
        name: item.side1.name,
        logoUrl: item.side1.logo,
      },
      team2: {
        id: team2Name ? team2Name.toLowerCase().replace(/\s/g, '-') : 'tbd',
        name: team2Name || 'TBD',
        logoUrl: item.side2.logo,
      },
      score1: parseInt(score1, 10) || 0,
      score2: parseInt(score2, 10) || 0,
      status: item.matchstatus,
      minute: item.matchstatus === 'LIVE' ? item.matchtime : undefined,
      league: {
        id: item.competitionUrl.split('/')[4] || 'league-unknown',
        name: item.competition,
      },
      venue: 'N/A', // Not provided by this API
      date: item.date,
      embed: item.videos[0]?.embed || '',
    };
  };

export const getHighlights = async (): Promise<Highlight[]> => {
  try {
    const response = await axios.get<{ response: ScoreBatHighlight[] }>(SCOREBAT_API_URL, {
      params: {
        token: process.env.SCOREBAT_API_TOKEN,
      }
    });

    if (response.data && Array.isArray(response.data.response)) {
      return response.data.response.map(transformToHighlight).filter(h => h.title.includes(' - '));
    }
    return [];
  } catch (error) {
    console.error('Error fetching highlights from ScoreBat API:', error);
    return [];
  }
};

export const getMatches = async (): Promise<Match[]> => {
    try {
        const response = await axios.get<{ response: ScoreBatHighlight[] }>(SCOREBAT_API_URL, {
            params: {
                token: process.env.SCOREBAT_API_TOKEN,
            }
        });

        if (response.data && Array.isArray(response.data.response)) {
             // Filter out items that are not matches (e.g., news, compilations)
            const matchesOnly = response.data.response.filter(item => item.title.includes(' - '));
            return matchesOnly.map(transformToMatch);
        }
        return [];
    } catch (error) {
        console.error('Error fetching matches from ScoreBat API:', error);
        return [];
    }
};

export const getMatch = async (id: string): Promise<Match | null> => {
    try {
        const matches = await getMatches();
        const match = matches.find(m => m.id === id);
        return match || null;
    } catch (error) {
        console.error(`Error fetching match ${id}:`, error);
        return null;
    }
};
