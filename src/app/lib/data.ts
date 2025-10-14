
import type { League, Standing } from './types';

// This file is now mostly deprecated in favor of the API services.
// We'll keep the leagues for now for the standings page, but this could also come from an API.

export const leagues: League[] = [
  { id: '39', name: 'Premier League' },
  { id: '140', name: 'La Liga' },
  { id: '135', name: 'Serie A' },
  { id: '78', name: 'Bundesliga' },
  { id: '61', name: 'Ligue 1' },
];


export const mockStandings: { [key: string]: Standing[] } = {
  '39': [
    { rank: 1, team: { id: '50', name: 'Manchester City', logoUrl: 'https://media.api-sports.io/football/teams/50.png' }, points: 91, played: 38, win: 28, draw: 7, lose: 3, goalDifference: 62 },
    { rank: 2, team: { id: '42', name: 'Arsenal', logoUrl: 'https://media.api-sports.io/football/teams/42.png' }, points: 89, played: 38, win: 28, draw: 5, lose: 5, goalDifference: 62 },
    { rank: 3, team: { id: '40', name: 'Liverpool', logoUrl: 'https://media.api-sports.io/football/teams/40.png' }, points: 82, played: 38, win: 24, draw: 10, lose: 4, goalDifference: 45 },
    { rank: 4, team: { id: '66', name: 'Aston Villa', logoUrl: 'https://media.api-sports.io/football/teams/66.png' }, points: 68, played: 38, win: 20, draw: 8, lose: 10, goalDifference: 15 },
    { rank: 5, team: { id: '47', name: 'Tottenham Hotspur', logoUrl: 'https://media.api-sports.io/football/teams/47.png' }, points: 66, played: 38, win: 20, draw: 6, lose: 12, goalDifference: 13 },
  ],
};
