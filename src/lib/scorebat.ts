import axios from 'axios';
import type { Highlight } from './types';

const SCOREBAT_API_URL = 'https://www.scorebat.com/video-api/v3/feed/';

// This interface is based on the ScoreBat API response structure
interface ScoreBatResponse {
    response: ScoreBatHighlight[];
}
interface ScoreBatHighlight {
    title: string;
    competition: string;
    thumbnail: string;
    date: string;
    videos: {
        title: string;
        embed: string;
    }[];
     matchviewUrl: string;
}


// We'll transform the ScoreBat data into our app's Highlight type
const transformToHighlight = (item: ScoreBatHighlight, index: number): Highlight => {
    // Extract match ID from matchviewUrl
    const matchId = item.matchviewUrl.split('/')[4] || `match-${index + 1}`;
    
    return {
        id: `hl-${index + 1}`,
        title: item.title,
        thumbnail: item.thumbnail,
        league: item.competition,
        date: item.date,
        matchId: matchId,
        embed: item.videos[0]?.embed || '', // Get the embed code
    };
};

export const getHighlights = async (): Promise<Highlight[]> => {
  try {
    const response = await axios.get<ScoreBatResponse>(SCOREBAT_API_URL, {
      headers: {
        'Authorization': `Bearer ${process.env.SCOREBAT_API_TOKEN}`,
      },
    });

    if (response.data && Array.isArray(response.data.response)) {
      return response.data.response.map(transformToHighlight);
    }
    return [];
  } catch (error) {
    console.error('Error fetching highlights from ScoreBat API:', error);
    // In a real app, you'd want better error handling, maybe return a cached version or an empty array with a log
    return [];
  }
};
