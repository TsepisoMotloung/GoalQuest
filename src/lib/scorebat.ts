
import axios from 'axios';
import type { Highlight, Match, ScoreBatHighlight } from './types';

const SCOREBAT_API_URL = 'https://www.scorebat.com/video-api/v3/feed/';
const SCOREBAT_API_TOKEN = process.env.NEXT_PUBLIC_SCOREBAT_API_TOKEN || '';

const transformToHighlight = (item: ScoreBatHighlight): Highlight => {
    const matchId = item.matchviewUrl.split('/')[4] || `match-${item.title.replace(/\s/g, '-')}`;
    
    return {
        id: `hl-${item.title.replace(/\s/g, '-')}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: item.title,
        thumbnail: item.thumbnail,
        league: item.competition,
        date: item.date,
        matchId: matchId,
        embed: item.videos[0]?.embed || '',
        videos: item.videos,
    };
};

const transformToMatch = (item: ScoreBatHighlight): Match => {
    if (!item?.title || !item.competition) {
        console.error('Invalid match data:', item);
        throw new Error('Invalid match data received from API');
    }

    // Parse team names from title
    const teamParts = item.title.split(' - ');
    if (teamParts.length !== 2) {
        console.error('Invalid title format:', item.title);
        throw new Error('Invalid match title format');
    }

    const [team1Name, team2Name] = teamParts;
    
    // Generate a unique match ID using title and timestamp
    const matchId = `match-${item.title.replace(/\s/g, '-').toLowerCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Score is not available in API v3, default to 0-0
    const score1 = 0;
    const score2 = 0;
    
    return {
        id: matchId,
        team1: {
            id: team1Name.toLowerCase().replace(/\s/g, '-'),
            name: team1Name,
            logoUrl: `https://via.placeholder.com/50?text=${team1Name.charAt(0)}`,
        },
        team2: {
            id: team2Name.toLowerCase().replace(/\s/g, '-'),
            name: team2Name,
            logoUrl: `https://via.placeholder.com/50?text=${team2Name.charAt(0)}`,
        },
        score1,
        score2,
        status: 'Completed', // API v3 only shows completed matches
        minute: undefined,
        league: {
            id: item.competitionUrl?.split('/')[4] || 'league-unknown',
            name: item.competition,
        },
        venue: 'N/A',
        date: item.date,
        embed: item.videos?.[0]?.embed || '',
    };
  };

export const getHighlights = async (): Promise<Highlight[]> => {
  if (!SCOREBAT_API_TOKEN) {
    console.error("Scorebat API token is not set. Returning empty array.");
    return [];
  }
  try {
    const response = await axios.get<{ response: ScoreBatHighlight[] }>(SCOREBAT_API_URL, {
      headers: {
        'x-rapidapi-key': SCOREBAT_API_TOKEN
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
    if (!SCOREBAT_API_TOKEN) {
        console.error("Scorebat API token is not set. Returning empty array.");
        return [];
    }
    try {
        console.log('Using Scorebat Token:', SCOREBAT_API_TOKEN);
        
        const response = await axios.get<{ response: ScoreBatHighlight[] }>(SCOREBAT_API_URL, {
            headers: {
                'x-rapidapi-key': SCOREBAT_API_TOKEN
            }
        });

        // Log the raw response for debugging
        console.log('Raw API Response:', JSON.stringify(response.data, null, 2));

        if (!response.data?.response) {
            console.error('Invalid API response:', response.data);
            return [];
        }

        // Log a sample match data
        if (response.data.response.length > 0) {
            console.log('Sample Match Data:', JSON.stringify(response.data.response[0], null, 2));
        }

        // Filter valid matches with detailed logging
        const validMatches = response.data.response
            .filter(item => {
                if (!item?.title?.includes(' - ')) {
                    console.log('Filtered out item:', item);
                    return false;
                }
                return true;
            })
            .map(item => {
                try {
                    console.log('Processing match:', item.title);
                    const match = transformToMatch(item);
                    console.log('Transformed match:', match);
                    return match;
                } catch (error) {
                    console.error('Error transforming match:', error, 'Match data:', item);
                    return null;
                }
            })
            .filter((match): match is Match => match !== null);

        console.log('Final matches count:', validMatches.length);
        return validMatches;
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
