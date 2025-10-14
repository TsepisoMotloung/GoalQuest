
import type { League, Standing } from './types';

// This file is now mostly deprecated in favor of the Scorebat API service.
// We'll keep the leagues for now for potential filtering, but this could also come from an API.

export const leagues: League[] = [
  { id: 'eng-pl', name: 'Premier League' },
  { id: 'esp-liga', name: 'La Liga' },
  { id: 'ita-seriea', name: 'Serie A' },
  { id: 'ger-bundesliga', name: 'Bundesliga' },
  { id: 'fra-ligue1', name: 'Ligue 1' },
];


export const mockStandings: { [key: string]: Standing[] } = {
  'eng-pl': [
    { rank: 1, team: { id: 'mc', name: 'Manchester City', logoUrl: 'https://picsum.photos/seed/mc/100/100' }, points: 91, played: 38, win: 28, draw: 7, lose: 3, goalDifference: 62 },
    { rank: 2, team: { id: 'ars', name: 'Arsenal', logoUrl: 'https://picsum.photos/seed/ars/100/100' }, points: 89, played: 38, win: 28, draw: 5, lose: 5, goalDifference: 62 },
    { rank: 3, team: { id: 'liv', name: 'Liverpool', logoUrl: 'https://picsum.photos/seed/liv/100/100' }, points: 82, played: 38, win: 24, draw: 10, lose: 4, goalDifference: 45 },
    { rank: 4, team: { id: 'av', name: 'Aston Villa', logoUrl: 'https://picsum.photos/seed/av/100/100' }, points: 68, played: 38, win: 20, draw: 8, lose: 10, goalDifference: 15 },
    { rank: 5, team: { id: 'th', name: 'Tottenham Hotspur', logoUrl: 'https://picsum.photos/seed/th/100/100' }, points: 66, played: 38, win: 20, draw: 6, lose: 12, goalDifference: 13 },
  ],
  'esp-liga': [
    { rank: 1, team: { id: 'rm', name: 'Real Madrid', logoUrl: 'https://picsum.photos/seed/rm/100/100' }, points: 95, played: 38, win: 29, draw: 8, lose: 1, goalDifference: 61 },
    { rank: 2, team: { id: 'bar', name: 'Barcelona', logoUrl: 'https://picsum.photos/seed/bar/100/100' }, points: 85, played: 38, win: 26, draw: 7, lose: 5, goalDifference: 35 },
  ],
  'ita-seriea': [
    { rank: 1, team: { id: 'inter', name: 'Inter Milan', logoUrl: 'https://picsum.photos/seed/inter/100/100' }, points: 94, played: 38, win: 29, draw: 7, lose: 2, goalDifference: 67 },
    { rank: 2, team: { id: 'acm', name: 'AC Milan', logoUrl: 'https://picsum.photos/seed/acm/100/100' }, points: 75, played: 38, win: 22, draw: 9, lose: 7, goalDifference: 27 },
  ],
  'ger-bundesliga': [
      { rank: 1, team: { id: 'bayer', name: 'Bayer Leverkusen', logoUrl: 'https://picsum.photos/seed/bayer/100/100' }, points: 90, played: 34, win: 28, draw: 6, lose: 0, goalDifference: 65 },
      { rank: 2, team: { id: 'stut', name: 'VfB Stuttgart', logoUrl: 'https://picsum.photos/seed/stut/100/100' }, points: 73, played: 34, win: 23, draw: 4, lose: 7, goalDifference: 39 },
  ],
    'fra-ligue1': [
      { rank: 1, team: { id: 'psg', name: 'Paris Saint-Germain', logoUrl: 'https://picsum.photos/seed/psg/100/100' }, points: 76, played: 34, win: 22, draw: 10, lose: 2, goalDifference: 48 },
      { rank: 2, team: { id: 'mon', name: 'AS Monaco', logoUrl: 'https://picsum.photos/seed/mon/100/100' }, points: 67, played: 34, win: 20, draw: 7, lose: 7, goalDifference: 16 },
  ],
};
