
import axios from 'axios';
import type { Standing } from './lib/types';
import type { Football98Standing, Football98Response } from './types';

const API_FOOTBALL_URL = 'https://football98.p.rapidapi.com';

const api = axios.create({
  baseURL: API_FOOTBALL_URL,
  headers: {
    'x-rapidapi-key': process.env.FOOTBALL_API_KEY,
    'x-rapidapi-host': process.env.FOOTBALL_API_HOST
  }
});

const transformToStanding = (item: Football98Standing, index: number): Standing => {
  const teamName = Object.keys(item)[0];
  const stats = item[teamName];
  
  return {
    rank: index + 1,
    team: {
      id: teamName.toLowerCase().replace(/\s/g, '-'),
      name: teamName,
      logoUrl: `https://picsum.photos/seed/${teamName.replace(/\s/g, '')}/100/100` // Placeholder, as API doesn't provide logo
    },
    points: parseInt(stats.Points, 10),
    played: parseInt(stats.Played, 10),
    win: parseInt(stats.Winned, 10),
    draw: parseInt(stats.Drawn, 10),
    lose: parseInt(stats.Loosed, 10),
    goalDifference: parseInt(stats['Goal Difference'], 10)
  };
};

// The API uses path-based league names, e.g., /premierleague/table
const leaguePathMap: { [key: string]: string } = {
  'Premier League': 'premierleague',
  'La Liga': 'laliga',
  'Serie A': 'seriea',
  'Bundesliga': 'bundesliga',
  'Ligue 1': 'ligue1',
};


export const getStandings = async (leagueName: string): Promise<Standing[]> => {
  const leaguePath = leaguePathMap[leagueName];
  if (!leaguePath) {
    console.error(`Invalid league name for football98 API: ${leagueName}`);
    return [];
  }

  if (!process.env.FOOTBALL_API_KEY || !process.env.FOOTBALL_API_HOST) {
    console.error("Football API key or host is not set. Returning empty array.");
    return [];
  }

  try {
    const response = await api.get<Football98Response>(`/${leaguePath}/table`);

    const standingsData = response.data.Table;

    if (standingsData && Array.isArray(standingsData)) {
      return standingsData.map(transformToStanding);
    }
    return [];
  } catch (error) {
    console.error('Error fetching standings from football98 API:', error);
    return [];
  }
};
