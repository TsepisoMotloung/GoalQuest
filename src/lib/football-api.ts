
import axios from 'axios';
import type { Standing, APIFootballStanding, APIFootballResponse } from './types';

const API_FOOTBALL_URL = 'https://v3.football.api-sports.io';

const api = axios.create({
  baseURL: API_FOOTBALL_URL,
  headers: {
    'x-rapidapi-key': process.env.API_FOOTBALL_KEY,
    'x-rapidapi-host': 'v3.football.api-sports.io'
  }
});


const transformToStanding = (item: APIFootballStanding): Standing => {
  return {
    rank: item.rank,
    team: {
      id: item.team.id.toString(),
      name: item.team.name,
      logoUrl: item.team.logo
    },
    points: item.points,
    played: item.all.played,
    win: item.all.win,
    draw: item.all.draw,
    lose: item.all.lose,
    goalDifference: item.goalsDiff
  };
};

export const getStandings = async (leagueId: string, year: string): Promise<Standing[]> => {
  try {
    const response = await api.get<APIFootballResponse<{ league: { standings: APIFootballStanding[][] } }>>('/standings', {
      params: {
        league: leagueId,
        season: year
      }
    });

    const standingsData = response.data.response[0]?.league?.standings[0];

    if (standingsData && Array.isArray(standingsData)) {
      return standingsData.map(transformToStanding);
    }
    return [];
  } catch (error) {
    console.error('Error fetching standings from API-Football:', error);
    return [];
  }
};
